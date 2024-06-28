const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt'); // Biblioteca para hashing de senhas

// Função para listar todos os usuários
exports.getUsuarios = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM usuarios;',
            (error, result, fields) => {
                conn.release();
                if (error) { console.error(error); return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    usuarios: result.map(user => {
                        return {
                            id: user.id,
                            nome: user.nome,
                            cpf: user.cpf,
                            email: user.email,
                            cadastrador: user.cadastrador,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um usuário específico',
                                url: process.env.URL_API + 'usuarios/' + user.id
                            }
                        }
                    })
                }
                return res.status(200).send({ response });
            }
        )
    });
}

// Função para criar um novo usuário
exports.postUsuario = (req, res, next) => {
    // Hash da senha antes de salvar no banco de dados
    bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
        if (errBcrypt) { console.error(errBcrypt); return res.status(500).send({ error: errBcrypt }) }
        mysql.getConnection((error, conn) => {
            if (error) { console.error(error); return res.status(500).send({ error: error }) }
            conn.query(
                'INSERT INTO usuarios (nome, cpf, senha, email, cadastrador) VALUES (?,?,?,?,?)',
                [req.body.nome, req.body.cpf, hash, req.body.email, req.body.cadastrador],
                (error, result, field) => {
                    conn.release();
                    if (error) { console.error(error); return res.status(500).send({ error: error }) }
                    const response = {
                        mensagem: 'Usuário inserido com sucesso',
                        usuarioCriado: {
                            id: result.insertId,
                            nome: req.body.nome,
                            cpf: req.body.cpf,
                            email: req.body.email,
                            cadastrador: req.body.cadastrador,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os usuários',
                                url: process.env.URL_API + 'usuarios'
                            }
                        }
                    }
                    return res.status(201).send(response);
                }
            )
        });
    });
}

// Função para obter um usuário específico por ID
exports.getUmUsuario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM usuarios WHERE id = ?;',
            [req.params.id_usuario],
            (error, result, fields) => {
                conn.release();
                if (error) { console.error(error); return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: "Não foi encontrado usuário com este ID."
                    })
                }
                const response = {
                    usuario: {
                        id: result[0].id,
                        nome: result[0].nome,
                        cpf: result[0].cpf,
                        email: result[0].email,
                        cadastrador: result[0].cadastrador,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os usuários',
                            url: process.env.URL_API + 'usuarios'
                        }
                    }
                }
                return res.status(200).send(response);
            }
        )
    });
}

// Função para atualizar um usuário
exports.updateUsuario = (req, res, next) => {
    // Verifique se a senha está sendo atualizada
    if (req.body.senha) {
        // Se a senha for fornecida, gere um novo hash para ela
        bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if (errBcrypt) { console.error(errBcrypt); return res.status(500).send({ error: errBcrypt }) }
            updateUserWithHash(req, res, hash); // Chama a função de atualização com o hash gerado
        });
    } else {
        // Se a senha não for fornecida, atualize os outros campos sem alterar a senha
        updateUserWithoutHash(req, res);
    }
}

// Função auxiliar para atualizar o usuário com uma nova senha hash
const updateUserWithHash = (req, res, hashedPassword) => {
    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE usuarios
                SET nome = ?,
                    cpf = ?,
                    senha = ?,
                    email = ?,
                    cadastrador = ?
                WHERE id = ?`,
            [req.body.nome, req.body.cpf, hashedPassword, req.body.email, req.body.cadastrador, req.body.id],
            (error, result, field) => {
                conn.release();
                if (error) { console.error(error); return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Usuário atualizado com sucesso',
                    usuarioAtualizado: {
                        id: req.body.id,
                        nome: req.body.nome,
                        cpf: req.body.cpf,
                        email: req.body.email,
                        cadastrador: req.body.cadastrador,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um usuário específico',
                            url: process.env.URL_API + 'usuarios/' + req.body.id
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
}

// Função auxiliar para atualizar o usuário sem alterar a senha
const updateUserWithoutHash = (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE usuarios
                SET nome = ?,
                    cpf = ?,
                    email = ?,
                    cadastrador = ?
                WHERE id = ?`,
            [req.body.nome, req.body.cpf, req.body.email, req.body.cadastrador, req.body.id],
            (error, result, field) => {
                conn.release();
                if (error) { console.error(error); return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Usuário atualizado com sucesso',
                    usuarioAtualizado: {
                        id: req.body.id,
                        nome: req.body.nome,
                        cpf: req.body.cpf,
                        email: req.body.email,
                        cadastrador: req.body.cadastrador,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um usuário específico',
                            url: process.env.URL_API + 'usuarios/' + req.body.id
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
}

// Função para deletar um usuário
exports.deleteUsuario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM usuarios WHERE id = ?`,
            [req.body.id],
            (error, result, field) => {
                conn.release();
                if (error) { console.error(error); return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'Usuário removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um usuário',
                        url: process.env.URL_API + 'usuarios',
                        body: {
                            nome: 'String',
                            cpf: 'String',
                            senha: 'String',
                            email: 'String',
                            cadastrador: 'Boolean'
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });
}
