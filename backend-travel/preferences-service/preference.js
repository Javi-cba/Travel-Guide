const express = require('express');
const conectarDB = require('./config/db');
const preferenciasRoutes = require('./modules/preference.routes');

const app = express();
const PORT = process.env.PORT1 || 3010;

// Conecta a la base de datos
conectarDB();

app.use(express.json());
app.use('/', preferenciasRoutes); // Rutas de preferencias

app.listen(PORT, () => {
  console.log(`RUN Preferencias Service http://localhost:${PORT}`);
});
