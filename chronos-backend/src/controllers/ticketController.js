const ticketRepository = require('../repositories/ticketRepository');

const create = async (req, res) => {
    const { title, clientName, description, clientTier } = req.body;

    // Validação dos campos obrigatórios
    if (!title || !clientName || !description || !clientTier) {
        return res.status(400).json({
            error: 'Erro: Campos obrigatórios (title, clientName, description, clientTier) faltando.'
        });
    }

    // Validação da Regra de negócio (ENUM)
    const validTiers = ['ISP', 'Corporativo', 'PME_Plus', 'PME'];

    if (!validTiers.includes(clientTier)) {
        return res.status(400).json({
            error: `Erro: O tipo '${clientTier}' é inválido. Use: ISP, Corporativo, PME_Plus ou PME.`
        });
    }

    try {
        const newTicket = await ticketRepository.createTicket({
            title,
            clientName,
            description,
            clientTier
        });

        return res.status(201).json({
            message: 'Ticket criado com sucesso!',
            ticket: newTicket
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno no servidor.'});
    }
};

const list = async (req, res) => {
    try {
        const tickets = await ticketRepository.findAllTickets();
        return res.status(200).json(tickets);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar tickets.'});
    }
};

const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ['Aberto', 'Em análise', 'Concluído'];
    if (!validStatus.includes(status)) {
        return res.status(400).json({ error: 'Status inválido.' });
    }

    try {
        const updatedTicket = await ticketRepository.updateStatus(id, status);

        if (!updatedTicket) {
            return res.status(404).json({ error: 'Ticket não encontrado.' });
        }
        return res.status(200).json({ message: 'Status atualizado!', ticket: updatedTicket });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao atualizar status' });
    };
};

module.exports = {
    create,
    list, 
    updateStatus,
};