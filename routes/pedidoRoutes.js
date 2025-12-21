const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

// Rota para listar todos os pedidos
router.get('/', pedidoController.getAllPedidos);

module.exports = router;