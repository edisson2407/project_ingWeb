import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import configureExpress from './config/express.js';
import authRoutes from './routes/auth.js';
import artistRoutes from './routes/artists.js';
import artworkRoutes from './routes/artworks.js';
import adminRoutes from './routes/admin.js';
import path from 'path';

dotenv.config();

const app = express();

// Configure express middleware
configureExpress(app);

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    message: 'Error en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 27017;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});