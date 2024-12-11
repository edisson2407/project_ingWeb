import express from 'express';
import Artist from '../models/Artist.js';
import Artwork from '../models/Artwork.js';
import { auth } from '../middleware/auth.js';
import { adminAuth } from '../middleware/adminAuth.js';
import { imageService } from '../services/imageService.js';

const router = express.Router();

// Get all artists
router.get('/', async (req, res) => {
  try {
    const artists = await Artist.find();
    const artistsWithArtworks = await Promise.all(
      artists.map(async (artist) => {
        const artworks = await Artwork.find({ artist_id: artist._id });
        return {
          ...artist.toObject(),
          obras: artworks
        };
      })
    );
    res.json(artistsWithArtworks);
  } catch (error) {
    console.error('Error getting artists:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Get artist by ID
router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artista no encontrado' });
    }
    
    const artworks = await Artwork.find({ artist_id: artist._id });
    res.json({
      ...artist.toObject(),
      obras: artworks
    });
  } catch (error) {
    console.error('Error getting artist:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Create artist (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { nombre, edad, perfil, foto_url, contacto, genero } = req.body;
    
    const validationErrors = [];
    
    if (!nombre?.trim()) validationErrors.push('El nombre es requerido');
    if (!edad || isNaN(edad) || edad < 1) validationErrors.push('La edad debe ser un número válido mayor a 0');
    if (!perfil?.trim()) validationErrors.push('El perfil es requerido');
    if (!foto_url?.trim()) validationErrors.push('La foto es requerida');
    if (!contacto?.trim()) validationErrors.push('El contacto es requerido');
    if (!genero?.trim()) validationErrors.push('El género artístico es requerido');

    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Error de validación',
        errors: validationErrors
      });
    }

    // Save image and get path
    const imagePath = await imageService.saveImage(foto_url);

    // Create new artist
    const artist = new Artist({
      nombre,
      edad: parseInt(edad),
      perfil,
      foto_url: imagePath,
      contacto,
      genero,
      redes_sociales: req.body.redes_sociales || {},
      estado: 'activo',
      valoracion_promedio: 0,
      numero_valoraciones: 0
    });

    const savedArtist = await artist.save();
    console.log('Artist saved:', savedArtist);
    res.status(201).json(savedArtist);
  } catch (error) {
    console.error('Error creating artist:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Error de validación',
        errors: validationErrors
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Error de duplicación',
        errors: ['Ya existe un artista con ese correo electrónico']
      });
    }

    res.status(500).json({ 
      message: 'Error al crear el artista',
      errors: [error.message]
    });
  }
});

// Update artist (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { foto_url, ...updateData } = req.body;
    
    // If there's a new image, save it
    if (foto_url && foto_url.startsWith('data:image')) {
      const oldArtist = await Artist.findById(req.params.id);
      if (oldArtist) {
        await imageService.deleteImage(oldArtist.foto_url);
      }
      updateData.foto_url = await imageService.saveImage(foto_url);
    }

    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!artist) {
      return res.status(404).json({ message: 'Artista no encontrado' });
    }
    res.json(artist);
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Delete artist (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artista no encontrado' });
    }

    // Delete artist's image
    await imageService.deleteImage(artist.foto_url);

    // Delete artist and their artworks
    await Artist.findByIdAndDelete(req.params.id);
    await Artwork.deleteMany({ artist_id: req.params.id });

    res.json({ message: 'Artista eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting artist:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;