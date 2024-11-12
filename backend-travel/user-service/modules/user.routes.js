const express = require('express');
const router = express.Router();
const userService = require('./user.service'); // Importa los servicios

// Rutas de usuarios
router.post('/crear', async (req, res) => {
  try {
    const resp = await userService.crear(req.body);
    res.status(201).json({ message: 'Usuario creado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error });
  }
});

router.get('/get', async (req, res) => {
  try {
    const resp = await userService.findAll();
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

router.get('/valida-existe', async (req, res) => {
  if (!req.query.email) {
    return res.status(400).json({ message: 'email de usuario requerido' });
  }
  try {
    const resp = await userService.existUserByMail(req.query.email);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar usuario' });
  }
});

router.get('/buscar-email', async (req, res) => {
  if (!req.query.email) {
    return res.status(400).json({ message: 'mail de usuario requerido' });
  }
  try {
    const resp = await userService.userByMail(req.query.email);
    res.status(200).json(resp);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar usuario' });
  }
});

router.put('/modificar', async (req, res) => {
  try {
    const resp = await userService.modificar(req.body);
    res.status(200).json({ message: 'Usuario modificado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al modificar usuario ' });
  }
});

module.exports = router;
