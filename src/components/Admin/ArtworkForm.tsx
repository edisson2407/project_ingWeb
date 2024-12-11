import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, X } from 'lucide-react';
import axios from '../../config/axios';
import { Artist } from '../../types';

interface ArtworkFormProps {
  artist: Artist;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ArtworkForm: React.FC<ArtworkFormProps> = ({ artist, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: null as File | null,
    tecnica: '',
    dimensiones: '',
    precio: '',
    disponible: true,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
      
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check image dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        if (img.width > 4096 || img.height > 4096) {
          toast.error('La imagen no debe exceder 4096x4096 píxeles');
          return;
        }

        setFormData({ ...formData, imagen: file });
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      };

      img.src = objectUrl;
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.titulo.trim()) errors.push('El título es requerido');
    if (!formData.descripcion.trim()) errors.push('La descripción es requerida');
    if (!formData.imagen) errors.push('La imagen es requerida');
    if (!formData.tecnica.trim()) errors.push('La técnica es requerida');
    if (!formData.dimensiones.trim()) errors.push('Las dimensiones son requeridas');
    
    // Only validate price if it's not empty and the artwork is available
    const price = parseFloat(formData.precio);
    if (formData.disponible && formData.precio !== '' && (isNaN(price) || price < 0)) {
      errors.push('El precio debe ser un número válido mayor o igual a 0');
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descripcion', formData.descripcion);
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }
      formDataToSend.append('tecnica', formData.tecnica);
      formDataToSend.append('dimensiones', formData.dimensiones);
      
      // Handle price: if not available or empty, send 0
      const price = formData.disponible && formData.precio ? formData.precio : '0';
      formDataToSend.append('precio', price);
      formDataToSend.append('disponible', String(formData.disponible));

      const response = await axios.post(
        `/api/artworks/${artist._id}/artworks`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        toast.success('Obra agregada exitosamente');
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error al agregar obra:', error);
      
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: string) => {
          toast.error(err);
        });
      } else {
        toast.error(error.response?.data?.message || 'Error al agregar la obra');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Artist Info */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Artista</h3>
        <div className="flex items-center space-x-3">
          <img
            src={`${import.meta.env.VITE_API_URL}${artist.foto_url}`}
            alt={artist.nombre}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{artist.nombre}</p>
            <p className="text-sm text-gray-500">{artist.genero}</p>
          </div>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Imagen de la Obra *
        </label>
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {previewImage ? (
              <div className="relative inline-block">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mx-auto h-64 object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setFormData({ ...formData, imagen: null });
                  }}
                  className="absolute top-0 right-0 -mr-2 -mt-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500">
                    <span>Sube una imagen</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF (máx. 4096x4096px)
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
          Título *
        </label>
        <input
          type="text"
          name="titulo"
          id="titulo"
          required
          value={formData.titulo}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
          Descripción *
        </label>
        <textarea
          name="descripcion"
          id="descripcion"
          required
          value={formData.descripcion}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      {/* Technique */}
      <div>
        <label htmlFor="tecnica" className="block text-sm font-medium text-gray-700">
          Técnica *
        </label>
        <input
          type="text"
          name="tecnica"
          id="tecnica"
          required
          value={formData.tecnica}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      {/* Dimensions */}
      <div>
        <label htmlFor="dimensiones" className="block text-sm font-medium text-gray-700">
          Dimensiones *
        </label>
        <input
          type="text"
          name="dimensiones"
          id="dimensiones"
          required
          value={formData.dimensiones}
          onChange={handleChange}
          placeholder="ej. 100x80cm"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Disponibilidad
        </label>
        <div className="mt-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="disponible"
              id="disponible"
              checked={formData.disponible}
              onChange={(e) => {
                const isAvailable = e.target.checked;
                setFormData({ 
                  ...formData, 
                  disponible: isAvailable,
                  precio: isAvailable ? formData.precio : ''
                });
              }}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="disponible" className="ml-2 block text-sm text-gray-900">
              Disponible para compra
            </label>
          </div>
        </div>
      </div>

      {/* Price - Only shown when available for purchase */}
      {formData.disponible && (
        <div>
          <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
            Precio (opcional)
          </label>
          <input
            type="number"
            name="precio"
            id="precio"
            min="0"
            step="0.01"
            value={formData.precio}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Dejar vacío si el precio está por determinar"
          />
          <p className="mt-1 text-sm text-gray-500">
            Deje este campo vacío si el precio está por determinar
          </p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Obra'}
        </button>
      </div>
    </form>
  );
};