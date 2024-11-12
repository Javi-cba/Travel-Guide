const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    preferencias: {
      tipoDeAventurero: {
        type: String,
        required: true,
      },
      preferencias: {
        type: [String],
        required: true,
      },
      presupuesto: { type: String, enum: ['bajo', 'medio', 'alto'] },
      destinosFavoritos: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Destino' },
      ],
    },
    historialViajes: [
      {
        destino: { type: mongoose.Schema.Types.ObjectId, ref: 'Destino' },
        fechaViaje: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Usuario', UsuarioSchema);
