const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/', ticketController.create);
router.get('/', ticketController.list);
router.put('/:id/status', ticketController.updateStatus);

module.exports = router;
