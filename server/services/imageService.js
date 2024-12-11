import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = 'uploads/images';
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const imageService = {
  async saveImage(base64String) {
    try {
      // Create uploads directory if it doesn't exist
      await fs.mkdir(path.join(process.cwd(), UPLOAD_DIR), { recursive: true });

      // Extract image data and format from base64
      const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
      
      if (!matches || matches.length !== 3) {
        throw new Error('Formato de imagen inválido');
      }

      const imageBuffer = Buffer.from(matches[2], 'base64');
      
      // Check file size
      if (imageBuffer.length > MAX_FILE_SIZE) {
        throw new Error('La imagen excede el tamaño máximo permitido de 50MB');
      }

      const imageType = matches[1];
      const randomName = crypto.randomBytes(16).toString('hex');
      const fileName = `${randomName}.${imageType}`;
      const filePath = path.join(process.cwd(), UPLOAD_DIR, fileName);

      // Save the file
      await fs.writeFile(filePath, imageBuffer);

      // Return the relative path
      return `/${UPLOAD_DIR}/${fileName}`;
    } catch (error) {
      console.error('Error saving image:', error);
      throw new Error(error.message || 'Error al guardar la imagen');
    }
  },

  async deleteImage(imagePath) {
    try {
      if (!imagePath) return;

      const fullPath = path.join(process.cwd(), imagePath.replace(/^\//, ''));
      await fs.unlink(fullPath);
    } catch (error) {
      console.error('Error deleting image:', error);
      // Don't throw error for delete operations
    }
  }
};