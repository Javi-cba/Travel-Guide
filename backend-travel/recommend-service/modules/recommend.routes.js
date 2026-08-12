const express = require('express');
const router = express.Router();
const Recomendaciones = require('./recommend.service'); // Importa los servicios

// Get de prueba
router.get('/', (req, res) => {
  res.send('Servicio de Recomendaciones');
});

router.post('/usuario', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'email de usuario requerido' });
  }

  try {
    const recomends = await Recomendaciones.getByUser(email);
    res.status(200).json(recomends);
  } catch (error) {
    // Nunca serializar el error de axios: su config incluye los headers con
    // las API keys y quedaría expuesta en la respuesta al cliente.
    console.error('Error al obtener Recomendaciones:', error.message);

    const status = error.response?.status;

    if (status === 429) {
      return res.status(429).json({
        message:
          'El servicio de recomendaciones alcanzó su límite de uso. Intentá más tarde.',
      });
    }

    if (status === 401 || status === 403) {
      return res.status(502).json({
        message: 'Error de credenciales con un servicio externo',
      });
    }

    res.status(500).json({ message: 'Error al obtener Recomendaciones' });
  }
});

module.exports = router;
