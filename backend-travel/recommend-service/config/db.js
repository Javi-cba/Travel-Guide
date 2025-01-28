const mongoose = require('mongoose');
require('dotenv').config();

const conectarDB = async () => {
  try {
    // URL de base de datos
    const mongoURI = process.env.DBurl;

    // Conectamos a la base de datos
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    });

    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;
