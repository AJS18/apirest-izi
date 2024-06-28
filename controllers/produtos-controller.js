const mysql = require('../mysql').pool;

exports.getProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos;',
            (error, result, fields) => {
                conn.release();
                if (error) { console.error(error); res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id: prod.id,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto específico',
                                url: process.env.URL_API + '/produtos/' + prod.id
                            }
                        }
                    })
                }
                return res.status(200).send({ response });
            }
        )
    });
}

exports.postProdutos = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?)',
            [req.body.nome, req.body.preco],
            (error, result, field) => {
                conn.release();
                if (error) { console.error(error); res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_produto: result.id,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: process.env.URL_API + '/produtos'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
    });
}

exports.getUmProduto =
(req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos WHERE id = ?;',
            [req.params.id_produto],
            (error, result, fields) => {
                if (error) { console.error(error); res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: "Não foi encontrado produto com este ID."
                    })
                }
                const response = {
                    produto: {
                        id_produto: result[0].id,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna um produto',
                            url: process.env.URL_API + '/produtos'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
}

exports.updateProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE produtos
                SET nome = ?,
                    preco = ?
                WHERE id = ?`,
            [req.body.nome,
            req.body.preco,
            req.body.id
            ],
            (error, result, field) => {
                conn.release();
                if (error) { console.error(error); res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto atualizado com sucesso',
                    produtoAtualizado: {
                        id_produto: req.body.id,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um produto específico',
                            url: process.env.URL_API + '/produtos/' + req.body.id
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
}

exports.deleteProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM produtos WHERE id = ?`,
            [req.body.id],
            (error, result, field) => {
                conn.release();
                if (error) { console.error(error); res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: process.env.URL_API + '/produtos',
                        body: {
                            nome: 'String',
                            preco: 'Number'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
}