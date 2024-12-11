import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import Artist from '../models/Artist.js';
import Artwork from '../models/Artwork.js';
import Rating from '../models/Rating.js';

const router = express.Router();

// Get admin dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [artists, artworks, ratings] = await Promise.all([
      Artist.countDocuments(),
      Artwork.countDocuments(),
      Rating.find()
    ]);

    const averageRating = ratings.length > 0
      ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
      : 0;

    res.json({
      totalArtists: artists,
      totalArtworks: artworks,
      totalRatings: ratings.length,
      averageRating
    });
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
});

export default router;