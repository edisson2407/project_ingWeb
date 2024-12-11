import express from 'express';
import multer from 'multer';
import Artwork from '../models/Artwork.js';
import Rating from '../models/Rating.js';
import { auth } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { imageService } from '../services/imageService.js';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo inválido. Solo se permiten JPEG, PNG y GIF.'));
    }
  },
});

// Get all artworks
router.get('/', async (req, res) => {
  try {
    const artworks = await Artwork.find().populate('artist_id');
    res.json(artworks);
  } catch (error) {
    console.error('Error getting artworks:', error);
    res.status(500).json({ message: 'Error al obtener las obras' });
  }
});

// Get featured artworks
router.get('/featured', async (req, res) => {
  try {
    const artworks = await Artwork.find()
      .sort({ rating: -1 })
      .limit(8)
      .populate('artist_id');
    res.json(artworks);
  } catch (error) {
    console.error('Error getting featured artworks:', error);
    res.status(500).json({ message: 'Error al obtener las obras destacadas' });
  }
});

// Get artwork ratings
router.get('/:id/ratings', async (req, res) => {
  try {
    const ratings = await Rating.find({ artwork_id: req.params.id })
      .sort({ fecha: -1 })
      .populate('user_id', 'nombre');
    res.json(ratings);
  } catch (error) {
    console.error('Error getting artwork ratings:', error);
    res.status(500).json({ message: 'Error al obtener las valoraciones' });
  }
});

// Create artwork (admin only)
router.post('/:artistId/artworks', adminAuth, upload.single('imagen'), async (req, res) => {
  try {
    const { titulo, descripcion, tecnica, dimensiones, precio, disponible } = req.body;
    
    // Validate required fields
    const validationErrors = [];
    if (!titulo) validationErrors.push('El título es requerido');
    if (!descripcion) validationErrors.push('La descripción es requerida');
    if (!req.file) validationErrors.push('La imagen es requerida');
    if (!tecnica) validationErrors.push('La técnica es requerida');
    if (!dimensiones) validationErrors.push('Las dimensiones son requeridas');

    // Only validate price if artwork is available for purchase
    const isAvailable = disponible === 'true';
    const parsedPrice = parseFloat(precio);
    if (isAvailable && precio && (isNaN(parsedPrice) || parsedPrice < 0)) {
      validationErrors.push('El precio debe ser un número válido mayor o igual a 0');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Error de validación',
        errors: validationErrors,
      });
    }

    // Convert image buffer to base64 and save
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const imagePath = await imageService.saveImage(base64Image);

    const artwork = new Artwork({
      artist_id: req.params.artistId,
      titulo,
      descripcion,
      imagen_url: imagePath,
      tecnica,
      dimensiones,
      precio: isAvailable && precio ? parsedPrice : 0,
      fecha_creacion: new Date(),
      disponible: isAvailable,
      rating: 0,
      numero_valoraciones: 0,
    });

    const savedArtwork = await artwork.save();
    console.log('Artwork saved:', savedArtwork);
    res.status(201).json(savedArtwork);
  } catch (error) {
    console.error('Error creating artwork:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Error de validación',
        errors: validationErrors
      });
    }
    
    res.status(500).json({ 
      message: 'Error al crear la obra',
      error: error.message 
    });
  }
});

// Rate artwork
router.post('/:id/ratings', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'La calificación debe estar entre 1 y 5' });
    }

    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    // Check if user has already rated
    const existingRating = await Rating.findOne({
      artwork_id: req.params.id,
      user_id: req.user.userId
    });

    if (existingRating) {
      return res.status(400).json({ message: 'Ya has calificado esta obra' });
    }

    // Create new rating
    const newRating = new Rating({
      artwork_id: req.params.id,
      user_id: req.user.userId,
      rating,
      comment,
      fecha: new Date()
    });
    await newRating.save();

    // Update artwork rating
    const ratings = await Rating.find({ artwork_id: req.params.id });
    const avgRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

    artwork.rating = avgRating;
    artwork.numero_valoraciones = ratings.length;
    await artwork.save();

    res.json({ message: 'Calificación registrada exitosamente' });
  } catch (error) {
    console.error('Error rating artwork:', error);
    res.status(500).json({ message: 'Error al calificar la obra' });
  }
});

// Delete artwork (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Obra no encontrada' });
    }

    // Delete artwork image
    await imageService.deleteImage(artwork.imagen_url);

    // Delete artwork and its ratings
    await Artwork.findByIdAndDelete(req.params.id);
    await Rating.deleteMany({ artwork_id: req.params.id });

    res.json({ message: 'Obra eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    res.status(500).json({ message: 'Error al eliminar la obra' });
  }
});

export default router;