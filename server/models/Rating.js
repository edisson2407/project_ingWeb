import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  artwork_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String,
  fecha: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Rating', ratingSchema);