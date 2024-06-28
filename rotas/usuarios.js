const express = require('express');
const router = express.Router();

const UsuariosController = require('../controllers/usuarios-controller');

// Retorna todos os usuários
router.get('/', UsuariosController.getUsuarios);

// Insere um usuário
router.post('/', UsuariosController.postUsuario);

// Retorna os dados de um usuário específico
router.get('/:id_usuario', UsuariosController.getUmUsuario);

// Altera um usuário
router.patch('/', UsuariosController.updateUsuario);

// Exclui um usuário
router.delete('/', UsuariosController.deleteUsuario);

module.exports = router;
