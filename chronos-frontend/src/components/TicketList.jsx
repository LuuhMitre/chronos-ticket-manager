import { useEffect, useState } from 'react';
import './TicketList.css';

function TicketList({ shouldRefresh }) {
    const [tickets, setTickets] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const fetchTickets = async () => {
        try {
            const response = await fetch(`${API_URL}/api/tickets`);
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error('Erro ao buscar tickets: ', error);
        }
    };

    useEffect(() => {
        fetchTickets();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, [shouldRefresh]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/api/tickets/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) fetchTickets();
        } catch (error) {
            console.error('Erro ao atualizar: ', error);
        }
    };

    const getStatusColor = (status) => {
        if (status === 'Aberto') return '#e74c3c';
        if (status === 'Em análise') return '#f39c12';
        return '#27ae60';
    };

    const calculateSLADisplay = (deadlineStr, status) => {
        if (status === 'Concluído') return { text: "Finalizado", className: 'sla-done' };
        const deadline = new Date(deadlineStr);
        const now = new Date();
        const diffMs = deadline - now;
        const diffAbs = Math.abs(diffMs);
        const hours = Math.floor(diffAbs / (1000 * 60 * 60));
        const minutes = Math.floor((diffAbs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffMs > 0) return { text: `⏳ Restam ${hours}h ${minutes}m`, className: 'sla-ok' };
        else return { text: `🔥 ESTOURADO há ${hours}h ${minutes}m`, className: 'sla-breached' };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className='list-container'>
            <h2 style={{ textAlign: 'center', marginTop: '40px', color: '#4834d4', fontWeight: 'bold' }}>Painel de Gestão</h2>
            
            <div className='grid'>
                {Array.isArray(tickets) && tickets.length > 0 ? (
                    tickets.map((ticket) => {
                        const slaInfo = calculateSLADisplay(ticket.sla_deadline, ticket.status);
                        return (
                            <div key={ticket.id} className='ticket-card' style={{ borderLeft: `6px solid ${getStatusColor(ticket.status)}` }}>
                                <div className='card-header'>
                                    <span className='id'>#{ticket.id}</span>
                                    <span className='date'>Aberto: {formatDate(ticket.created_at)}</span>
                                </div>
                                <h3>{ticket.title}</h3>
                                <p className="client-name">👤 {ticket.client_name}</p> 
                                <p className='desc'>{ticket.description}</p>
                                <div className='meta'>
                                    <div className='meta-row'>
                                        <span>Contrato:</span>
                                        <strong>{ticket.client_tier}</strong>
                                    </div>
                                    <div className='meta-row'>
                                        <span>Prazo Limite:</span>
                                        <span>{formatDate(ticket.sla_deadline)}</span>
                                    </div>
                                    <div className={`sla-status ${slaInfo.className}`}>
                                        {slaInfo.text}
                                    </div>
                                </div>
                                <div className='actions'>
                                    <label>Status:</label>
                                    <select
                                        value={ticket.status} 
                                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                        style={{ borderColor: getStatusColor(ticket.status), color: getStatusColor(ticket.status) }}
                                    >
                                        <option value="Aberto">Aberto</option>
                                        <option value="Em análise">Em análise</option>
                                        <option value="Concluído">Concluído</option>
                                    </select>   
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', color: '#636e72', width: '100%', padding: '20px' }}>
                        <h3>Nenhum ticket encontrado... ou ocorreu um erro.</h3>
                        <p>Verifique se o Backend está rodando corretamente.</p>
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default TicketList;