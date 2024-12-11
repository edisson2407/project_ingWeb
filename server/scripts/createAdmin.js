import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminUser = {
      nombre: 'Administrador',
      email: 'admin@artgallery.com',
      password: 'Admin123!',
      tipo_usuario: 'admin'
    };

    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('El usuario administrador ya existe');
      process.exit(0);
    }

    const newAdmin = new User(adminUser);
    await newAdmin.save();
    
    console.log('Usuario administrador creado exitosamente');
    console.log('Email:', adminUser.email);
    console.log('Contraseña:', adminUser.password);
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser();