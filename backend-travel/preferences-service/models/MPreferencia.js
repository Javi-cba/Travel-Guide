const mongoose = require('mongoose');

const PreferenciasSchema = new mongoose.Schema({
  tipoDeAventurero: {
    type: String,
    required: true,
  },
  preferencias: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model('Preferencias', PreferenciasSchema);
