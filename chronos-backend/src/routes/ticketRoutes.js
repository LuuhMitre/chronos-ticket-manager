const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const rateLimit = require('express-rate-limit');

const createLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // Maximo 5 tickets por hora por pessoa
    message: { error: "Muitos tickets criados. Tente novamente em 1 hora." }
});

router.post('/', createLimiter, ticketController.create);
router.get('/', ticketController.list);
router.put('/:id/status', ticketController.updateStatus);

module.exports = router;
