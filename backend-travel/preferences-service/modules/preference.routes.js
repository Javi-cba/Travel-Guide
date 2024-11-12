const express = require('express');
const router = express.Router();
const PreferenciasService = require('./preference.service'); // Importa los servicios

// Get de prueba
router.get('/', (req, res) => {
  res.send('Servicio de preferencias');
});

// Rutas de preferencias
router.post('/crear', async (req, res) => {
  try {
    const prefGuardadas = await PreferenciasService.insertMany(req.body);
    res.status(201).json(prefGuardadas);
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar preferencias' });
  }
});

router.get('/user/:usuarioId', async (req, res) => {
  try {
    const preferencias = await PreferenciasService.findByUsuarioId(
      req.params.usuarioId
    );
    if (!preferencias) {
      return res.status(404).json({ message: 'Preferencias no encontradas' });
    }
    res.status(200).json(preferencias); // Responder con las preferencias encontradas
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener preferencias' });
  }
});

router.get('/get', async (req, res) => {
  try {
    const preferencias = await PreferenciasService.findAll();
    res.status(200).json(preferencias); // Responde con todas las preferencias
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener preferencias', error: error });
  }
});

module.exports = router;
