const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const proxy = require('express-http-proxy');
const jwt = require('jsonwebtoken');

dotenv.config();

const env = process.env;
const URLPRF = env.URL_PRF;
const URLUSU = env.URL_USU;
const URL_REC = env.URL_REC;
const JWT_SECRET = env.JWT_SECRET;
const PORT = env.PORT;

const app = express();
const corsOptions = {
  origin: '*',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());

// verifyToken: POR AHORA EL JWT TOKEN NO LO VAMOS A USAR...
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ error: 'JWT_SECRET no configurado' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = decoded;
    next();
  });
};

// Si falta la URL de un microservicio, ese endpoint responde 503 en vez de
// tirar abajo todo el gateway (proxy() con host vacío lanza al importar).
const crearProxy = (nombre, variable, url, timeout) => {
  if (!url) {
    console.error(`Falta la variable de entorno ${variable} (${nombre})`);
    return (req, res) =>
      res
        .status(503)
        .json({ message: `Servicio de ${nombre} no configurado (${variable})` });
  }

  return proxy(url, {
    timeout,
    proxyErrorHandler: (err, res, next) => {
      console.error(`Error proxy hacia ${nombre}:`, err.code || err.message);
      res
        .status(502)
        .json({ message: `Servicio de ${nombre} no disponible` });
    },
  });
};

app.get('/', (req, res) => {
  res.send('GATEWAY LISTO');
});

// Estado de configuración del gateway, para diagnosticar despliegues.
app.get('/health', (req, res) => {
  res.json({
    ok: Boolean(URLPRF && URLUSU && URL_REC),
    servicios: {
      preferencias: Boolean(URLPRF),
      usuarios: Boolean(URLUSU),
      recomendaciones: Boolean(URL_REC),
    },
  });
});

// Microservices
// Recomendaciones encadena IA + Google Maps + clima, por eso su timeout es mayor.
app.use('/preferencias', crearProxy('preferencias', 'URL_PRF', URLPRF, 25000));
app.use('/usuarios', crearProxy('usuarios', 'URL_USU', URLUSU, 25000));
app.use(
  '/recomendaciones',
  crearProxy('recomendaciones', 'URL_REC', URL_REC, 60000)
);

// Handler de errores: responde JSON en vez de filtrar el stack en HTML.
app.use((error, req, res, next) => {
  console.error('Error no controlado en el gateway:', error);
  res.status(500).json({ message: 'Error interno del gateway' });
});

app.listen(PORT, () => {
  console.log(
    `Servidor GateWay index.js levantado en http://localhost:${PORT}`
  );
});
