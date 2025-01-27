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
const PORT = env.PORT;

const app = express();
const corsOptions = {
  origin: '*',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.options('', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());

// verifyToken: POR AHORA EL JWT TOKEN NO LO VAMOS A USAR...
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
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

app.get('/', (req, res) => {
  res.send('GATEWAY LISTO');
});

// Microservices
app.use('/preferencias', proxy(URLPRF));
app.use('/recomendaciones', proxy(URL_REC));
app.use('/usuarios', proxy(URLUSU));

app.listen(PORT, () => {
  console.log(
    `Servidor GateWay index.js levantado en http://localhost:${PORT}`
  );
});
