const mongoose = require('mongoose');

const DestinoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String },
    categoria: [String],
    coordenadas: {
      latitud: { type: Number },
      longitud: { type: Number },
    },
    clima: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Destino', DestinoSchema);
