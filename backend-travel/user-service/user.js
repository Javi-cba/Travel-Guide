// index.js
const express = require('express');
const { requireDB } = require('./config/db');
const userRoutes = require('./modules/user.routes');

const app = express();
const PORT = process.env.PORT3 || 3030;

app.use(express.json());

// Health check: no toca la base de datos.
app.get('/', (req, res) => {
  res.send('Servicio de usuarios');
});

// Las rutas que usan modelos esperan a que la conexión esté lista.
app.use(requireDB);
app.use('/', userRoutes); // Rutas de usuarios

app.use((error, req, res, next) => {
  console.error('Error no controlado en usuarios:', error);
  res.status(500).json({ message: 'Error interno del servicio de usuarios' });
});

app.listen(PORT, () => {
  console.log(`User service running at http://localhost:${PORT}`);
});
