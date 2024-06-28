const express = require('express');
const router = express.Router();

const ProdutosController = require('../controllers/produtos-controller');

//retorna todos os produtos
router.get('/', ProdutosController.getProdutos);

//insere um produto
router.post('/', ProdutosController.postProdutos);

//retorna os dados de um produto
router.get('/:id_produto', ProdutosController.getUmProduto);

//altera um produto
router.patch('/', ProdutosController.updateProduto);

//exclui um produto
router.delete('/', ProdutosController.deleteProduto);


module.exports = router;