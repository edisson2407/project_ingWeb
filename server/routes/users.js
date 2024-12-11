import express from 'express';
import bcrypt from 'bcryptjs';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import { imageService } from '../services/imageService.js';

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { nombre, email } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Formato de email inválido' });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: req.user.userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está en uso' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { nombre, email },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
});

// Update profile photo
router.put('/profile/photo', auth, async (req, res) => {
  try {
    const { foto_url } = req.body;
    
    // Save new photo
    const imagePath = await imageService.saveImage(foto_url);

    // Get current user to delete old photo
    const currentUser = await User.findById(req.user.userId);
    if (currentUser?.foto_url) {
      await imageService.deleteImage(currentUser.foto_url);
    }

    // Update user with new photo
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { foto_url: imagePath },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Error updating profile photo:', error);
    res.status(500).json({ message: 'Error al actualizar la foto de perfil' });
  }
});

// Update password
router.put('/profile/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña actual incorrecta' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error al actualizar la contraseña' });
  }
});

export default router;