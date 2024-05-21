const express = require('express');
const app = express();
const morgan = require('morgan');

const rotaProdutos = require('./rotas/produtos');
const rotaPedidos = require('./rotas/pedidos');

app.use(morgan('dev'));

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);

//quando nao encontra rota, entra aqui:
app.use((req, res, next) => {
    const erro = new Error('nao encontrato');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;