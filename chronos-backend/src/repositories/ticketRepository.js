const db = require('../config/db');

const createTicket = async (ticketData) => {
    const { title, clientName, description, clientTier } = ticketData;

    const query = `
    INSERT INTO tickets (title, client_name, description, client_tier)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `;

    const values = [ title, clientName, description, clientTier];

    const result = await db.query(query, values);
    return result.rows[0];
};

const findAllTickets = async () => {
    const query = `SELECT * FROM tickets ORDER BY created_at DESC`;
    const result = await db.query(query);
    return result.rows;
};

const updateStatus = async (id, newStatus) => {
    const query = `
    UPDATE tickets
    SET status = $1
    WHERE id = $2
    RETURNING *;
    `

    const values = [newStatus, id];
    const result = await db.query(query, values);
    return result.rows[0];
};

module.exports = {
    createTicket,
    findAllTickets,
    updateStatus,
};
