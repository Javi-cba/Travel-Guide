const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
const recommendRoutes = require('./modules/recommend.routes');

const app = express();
const corsOptions = {
  origin: '*',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
};

app.options('', cors(corsOptions));
app.use(cors(corsOptions));

const PORT = process.env.PORT2 || 3020;

conectarDB();

app.use(express.json());
app.use('/', recommendRoutes); // Rutas de recomendaciones

app.listen(PORT, () => {
  console.log(`RUN Recommend Service http://localhost:${PORT}`);
});
