const express = require('express');
const http = require('http');
const recommendRoutes = require('./modules/recommend.routes');

const app = express();

const PORT = process.env.PORT2 || 3020;

const server = http.createServer(app);

server.setTimeout(50000, () => {
  console.log('Request timeout exceeded');
});

app.use(express.json());
app.use('/', recommendRoutes); // Rutas de recomendaciones

app.listen(PORT, () => {
  console.log(`RUN Recommend Service http://localhost:${PORT}`);
});
