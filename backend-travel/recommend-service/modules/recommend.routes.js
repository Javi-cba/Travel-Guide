const express = require('express');
const router = express.Router();
const Recomendaciones = require('./recommend.service'); // Importa los servicios

// Códigos de 429 que sí se destraban esperando. El resto son de facturación.
const TRANSITORIOS = ['rate_limit_exceeded', 'requests', 'tokens'];

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
    // las API keys y quedaría expuesta en la respuesta al cliente. Del cuerpo
    // del error externo solo se propaga el código, que no es sensible.
    const status = error.response?.status;
    const codigo = error.response?.data?.error?.code;
    const tipo = error.response?.data?.error?.type;
    const detalle = error.response?.data?.error?.message;
    // El flujo llama a dos servicios externos: sin saber cuál falló, un 429 del
    // user-service se leería como falta de crédito de OpenAI.
    const origen = error.origen || 'desconocido';

    console.error(
      `Error al obtener Recomendaciones [origen=${origen}]:`,
      error.message,
      status ? `| upstream ${status} ${codigo || ''} ${detalle || ''}` : ''
    );

    if (error.noEncontrado || (origen === 'usuarios' && status === 404)) {
      return res.status(404).json({ message: 'Usuario no encontrado', origen });
    }

    if (origen === 'usuarios') {
      return res.status(502).json({
        message: 'No se pudo obtener el usuario para generar recomendaciones',
        origen,
      });
    }

    if (status === 429) {
      // OpenAI usa 429 tanto para falta de crédito como para rate limit, y
      // tiene varios códigos para lo primero (insufficient_quota,
      // credit_balance_exhausted, billing_hard_limit_reached...). Solo se
      // tratan como reintentables los códigos transitorios conocidos: ante uno
      // desconocido conviene decir "falta crédito" y no "probá de nuevo",
      // porque esperar no destraba un problema de facturación.
      const transitorio = TRANSITORIOS.includes(codigo) || TRANSITORIOS.includes(tipo);

      if (!transitorio) {
        return res.status(503).json({
          message:
            'El servicio de recomendaciones no está disponible: la cuenta de IA no tiene crédito.',
          codigo,
          origen,
        });
      }

      return res.status(429).json({
        message:
          'Demasiadas solicitudes al servicio de recomendaciones. Probá de nuevo en unos segundos.',
        codigo,
        origen,
      });
    }

    if (status === 401 || status === 403) {
      return res.status(502).json({
        message: 'Error de credenciales con un servicio externo',
        codigo,
        origen,
      });
    }

    if (codigo === 'model_not_found' || codigo === 'invalid_request_error') {
      return res.status(502).json({
        message: 'El modelo de IA configurado no es válido para esta cuenta',
        codigo,
        origen,
      });
    }

    res.status(500).json({ message: 'Error al obtener Recomendaciones', origen });
  }
});

module.exports = router;
