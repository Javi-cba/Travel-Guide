const express = require('express');
const recommendRoutes = require('./modules/recommend.routes');

const app = express();

const PORT = process.env.PORT2 || 3020;

app.use(express.json());
app.use('/', recommendRoutes); // Rutas de recomendaciones

app.use((error, req, res, next) => {
  console.error('Error no controlado en recomendaciones:', error.message);
  res
    .status(500)
    .json({ message: 'Error interno del servicio de recomendaciones' });
});

const server = app.listen(PORT, () => {
  console.log(`RUN Recommend Service http://localhost:${PORT}`);
});

server.setTimeout(50000);
