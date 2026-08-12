const mongoose = require('mongoose');
require('dotenv').config();

// En serverless (Vercel) el proceso se congela entre invocaciones y se reutiliza
// en la siguiente: la conexión se cachea a nivel global y se reintenta si se
// cayó. Nunca process.exit(), porque mata la lambda y Vercel responde
// FUNCTION_INVOCATION_FAILED en vez del error real.
const cache =
  globalThis.__mongooseCache || (globalThis.__mongooseCache = { promise: null });

const OPCIONES = {
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 20000,
  maxPoolSize: 5,
  bufferCommands: false, // fallar rápido y claro en vez de encolar 10s
};

const conectarDB = async () => {
  const mongoURI = process.env.DBurl;

  if (!mongoURI) {
    throw new Error('Falta la variable de entorno DBurl');
  }

  // readyState: 0 desconectado, 1 conectado, 2 conectando, 3 desconectando
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState !== 2) {
    cache.promise = null; // la conexión cacheada murió, hay que rehacerla
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(mongoURI, OPCIONES)
      .then(conexion => {
        console.log('Conectado a MongoDB');
        return conexion;
      })
      .catch(error => {
        cache.promise = null; // el próximo request reintenta
        throw error;
      });
  }

  await cache.promise;

  return mongoose.connection;
};

// Middleware: garantiza que la conexión esté lista antes de tocar los modelos.
const requireDB = async (req, res, next) => {
  try {
    await conectarDB();
    next();
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    res.status(503).json({ message: 'Base de datos no disponible' });
  }
};

module.exports = conectarDB;
module.exports.conectarDB = conectarDB;
module.exports.requireDB = requireDB;
