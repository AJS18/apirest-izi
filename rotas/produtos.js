const express = require('express');
const router = express.Router();

//retorna todos os produtos
router.get('/', (req, res, next) => {
    res.status(200).send({
        mensagem: 'retorna todos os produtos'
    });
});

//insere um produto
router.post('/', (req, res, next) => {

    const produto = {
        nome: req.body.nome,
        preco: req.body.preco
    };

    res.status(201).send({
        mensagem: 'insere um produto',
        produtoCriado: produto
    });
});

//retorna os dados de um produto
router.get('/:id_produto', (req, res, next) => {
    const id = req.params.id_produto
    if (id == 'especial') {
        res.status(200).send({
            mensagem: 'Voce descobriu o ID especial',
            id: id
        });
    } else {
        res.status(200).send({
            mensagem: 'voce passou um id'
        });
    }
    res.status(200).send({
        mensagem: 'Usando o GET de um produto exclusivo',
        id: id
    });
});

//altera um produto
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'produto alterado'
    });
});

//exclui um produto
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'produto excluido'
    });
});

module.exports = router;