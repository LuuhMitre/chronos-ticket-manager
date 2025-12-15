const express = require('express');
const cors = require('cors');
require('dotenv').config(); 
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

// --- Middlewares ---
// O comando abaixo permite que o servidor entenda JSON (vinda do Postman/React)
app.use(cors());
app.use(express.json());

// --- Rotas ---
// Definimos o prefixo '/api/tickets'.
// Isso significa que todas as rotas do arquivo ticketRoutes terão esse prefixo antes.
app.use('/api/tickets', ticketRoutes);

// --- Inicialização ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n🚀 Chronos Ticket Manager rodando a todo vapor!`);
    console.log(`🌍 URL Base: http://localhost:${PORT}/api/tickets`);
    console.log(`Waiting for requests...\n`);
})


