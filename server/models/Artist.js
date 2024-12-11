import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  edad: {
    type: Number,
    required: true
  },
  perfil: {
    type: String,
    required: true
  },
  foto_url: {
    type: String,
    required: true
  },
  redes_sociales: {
    instagram: String,
    twitter: String,
    website: String
  },
  contacto: {
    type: String,
    required: true
  },
  fecha_registro: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  },
  genero: {
    type: String,
    required: true
  },
  valoracion_promedio: {
    type: Number,
    default: 0
  },
  numero_valoraciones: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Artist', artistSchema);