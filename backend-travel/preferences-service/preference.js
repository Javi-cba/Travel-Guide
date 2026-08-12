const express = require('express');
const { requireDB } = require('./config/db');
const preferenciasRoutes = require('./modules/preference.routes');

const app = express();
const PORT = process.env.PORT1 || 3010;

app.use(express.json());

// Health check: no toca la base de datos.
app.get('/', (req, res) => {
  res.send('Servicio de preferencias');
});

// Las rutas que usan modelos esperan a que la conexión esté lista.
app.use(requireDB);
app.use('/', preferenciasRoutes); // Rutas de preferencias

app.use((error, req, res, next) => {
  console.error('Error no controlado en preferencias:', error);
  res.status(500).json({ message: 'Error interno del servicio de preferencias' });
});

app.listen(PORT, () => {
  console.log(`RUN Preferencias Service http://localhost:${PORT}`);
});
