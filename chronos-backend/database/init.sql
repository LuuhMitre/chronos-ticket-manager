-- Clean database
DROP TRIGGER IF EXISTS trigger_set_sla ON tickets;
DROP FUNCTION IF EXISTS calculate_sla;
DROP TABLE IF EXISTS tickets;
DROP TYPE IF EXISTS client_tier_type;
DROP TYPE IF EXISTS status_type;

-- Create Client Tier Type
CREATE TYPE client_tier_type AS ENUM ('ISP', 'Corporativo', 'PME_Plus', 'PME');

-- Create Status Type
CREATE TYPE status_type AS ENUM ('Aberto', 'Em análise', 'Concluído')

-- Create table Tickets
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    client_name VARCHAR NOT NULL,
    client_tier client_tier_type NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    sla_deadline TIMESTAMP,
    status status_type DEFAULT 'Aberto'
);

-- Calculate SLA Function
CREATE OR REPLACE FUNCTION calculate_sla()
RETURNS TRIGGER AS $$
BEGIN
    -- ISP: 4H, CORPORATIVO: 6H, PME_PLUS: 12H, PME: 24H
    IF NEW.client_tier = 'ISP' THEN
        NEW.sla_deadline := NEW.created_at + INTERVAL '4 hours';
    ELSIF NEW.client_tier = 'Corporativo' THEN
        NEW.sla_deadline := NEW.created_at + INTERVAL '6 hours';
    ELSIF NEW.client_tier = 'PME_Plus' THEN
        NEW.sla_deadline := NEW.created_at + INTERVAL '12 hours';
    ELSE    
        NEW.sla_deadline := NEW.created_at + INTERVAL '24 hours';
    END IF;
	
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_set_sla
BEFORE INSERT ON tickets
FOR EACH ROW
EXECUTE FUNCTION calculate_sla();