import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema({
  artist_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  titulo: {
    type: String,
    required: [true, 'El título es requerido']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida']
  },
  imagen_url: {
    type: String,
    required: [true, 'La imagen es requerida']
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  tecnica: {
    type: String,
    required: [true, 'La técnica es requerida']
  },
  dimensiones: {
    type: String,
    required: [true, 'Las dimensiones son requeridas']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio debe ser mayor a 0']
  },
  disponible: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numero_valoraciones: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Artwork', artworkSchema);