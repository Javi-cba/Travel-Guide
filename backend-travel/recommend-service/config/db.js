const mongoose = require('mongoose');
require('dotenv').config();

const conectarDB = async () => {
  try {
    //  URL de base de datos
    const mongoURI = process.env.DBurl;

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DBurl: ', mongoURI);

    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;
