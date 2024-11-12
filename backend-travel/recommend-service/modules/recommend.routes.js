const express = require('express');
const router = express.Router();
const Recomendaciones = require('./recommend.service'); // Importa los servicios

// Get de prueba
router.get('/', (req, res) => {
  res.send('Servicio de Recomendaciones');
});

router.post('/usuario', async (req, res) => {
  const { email } = req.query;
  try {
    console.log(email);
    const recomends = await Recomendaciones.getByUser(email);
    res.status(200).json(recomends);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener Recomendaciones', error: error });
  }
});

module.exports = router;
