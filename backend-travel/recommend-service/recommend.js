const express = require('express');
const conectarDB = require('./config/db');
const recommendRoutes = require('./modules/recommend.routes');

const app = express();
const PORT = process.env.PORT2 || 3020;

conectarDB();

app.use(express.json());
app.use('/', recommendRoutes); // Rutas de recomendaciones

app.listen(PORT, () => {
  console.log(`RUN Recommend Service http://localhost:${PORT}`);
});
