const Preferencias = require('../models/MPreferencia');

// para obtener todas las preferencias
async function findAll() {
  try {
    return await Preferencias.find();
  } catch (error) {
    console.error('Error fetching preferences:', error);
    throw error;
  }
}

// para guardar preferencias de un usuario
async function insertMany(preferencia) {
  try {
    return await Preferencias.insertMany(preferencia);
  } catch (error) {
    console.error('Error insert preferences:', error);
    throw error;
  }
}

// para encontrar preferencias por ID de usuario
async function findByUsuarioId(usuarioId) {
  try {
    return await Preferencias.findOne({ usuarioId }).exec();
  } catch (error) {
    console.error('Error fetch preferences/userId:', error);
    throw error;
  }
}

module.exports = { findAll, insertMany, findByUsuarioId };
