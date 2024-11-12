// index.js
const express = require('express');
const conectarDB = require('./config/db');
const userRoutes = require('./modules/user.routes');

const app = express();
const PORT = process.env.PORT3 || 3030;

conectarDB();

app.use(express.json());
app.use('/', userRoutes); // Rutas de usuarios

app.listen(PORT, () => {
  console.log(`User service running at http://localhost:${PORT}`);
});
