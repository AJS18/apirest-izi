const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaProdutos = require('./rotas/produtos');
const rotaPedidos = require('./rotas/pedidos');
const rotaUsuarios = require('./rotas/usuarios');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true })); //apenas dados simples
app.use(bodyParser.json()); //json de entrada do body

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') //é aonde libero qual servidor pode usar a api
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type', 'Accept', 'Authorization'
    ); //é aonde aceita quais cabeçalhos eu querer

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).send({});
    }

    next();

});


app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);
app.use('/usuarios', rotaUsuarios);

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