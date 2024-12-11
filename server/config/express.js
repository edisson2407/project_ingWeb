import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const configureExpress = (app) => {
  // Configure body parser with increased limit
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  
  // Configure CORS
  app.use(cors());
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    
    if (err.type === 'entity.too.large') {
      return res.status(413).json({
        message: 'El archivo es demasiado grande',
        error: 'El tamaño máximo permitido es 50MB'
      });
    }
    
    res.status(500).json({ 
      message: 'Error en el servidor',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });
};

export default configureExpress;