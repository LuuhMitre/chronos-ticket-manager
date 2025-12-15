const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const ticketRoutes = require('./routes/ticketRoutes');
require('dotenv').config(); 

const app = express();

app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

// 2. Limitador Geral (Para todo o site)
// Permite 100 requisições a cada 15 minutos por IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, 
  message: 'Muitas requisições vindas deste IP, tente novamente mais tarde.'
});

// 3. Limitador Específico para CRIAÇÃO de Tickets 
// Permite apenas 5 tickets por hora por IP
const createTicketLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5,
  message: { error: '⛔ Você excedeu o limite de 5 tickets por hora.' }
});

app.use(globalLimiter);

app.use('/api/tickets', ticketRoutes);

// --- Inicialização ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n🚀 Chronos Ticket Manager rodando a todo vapor!`);
    console.log(`🌍 URL Base: http://localhost:${PORT}/api/tickets`);
    console.log(`Waiting for requests...\n`);
})


