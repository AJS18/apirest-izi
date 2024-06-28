const express = require('express');
const router = express.Router();

const PedidosController = require('../controllers/pedidos-controller');

//retorna todos os pedidos
router.get('/', PedidosController.getPedidos);

//insere um pedido
router.post('/', PedidosController.postPedidos);

//retorna os dados de um pedido
router.get('/:id_pedido', PedidosController.getUmPedido);

//exclui um pedido
router.delete('/', PedidosController.deletePedido);

module.exports = router;