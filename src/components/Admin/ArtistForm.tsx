import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, X } from 'lucide-react';
import axios from '../../config/axios';

interface ArtistFormProps {
  onSuccess: () => void;
}

export const ArtistForm: React.FC<ArtistFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    edad: '',
    perfil: '',
    foto_url: '',
    contacto: '',
    genero: '',
    redes_sociales: {
      instagram: '',
      twitter: '',
      website: ''
    }
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('redes_')) {
      const social = name.replace('redes_', '');
      setFormData(prev => ({
        ...prev,
        redes_sociales: {
          ...prev.redes_sociales,
          [social]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setFormData(prev => ({
          ...prev,
          foto_url: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.nombre.trim()) {
      errors.push('El nombre es requerido');
    }
    if (!formData.edad || parseInt(formData.edad) < 1) {
      errors.push('La edad debe ser un número válido mayor a 0');
    }
    if (!formData.perfil.trim()) {
      errors.push('El perfil es requerido');
    }
    if (!formData.foto_url) {
      errors.push('La foto es requerida');
    }
    if (!formData.contacto.trim()) {
      errors.push('El contacto es requerido');
    }
    if (!formData.genero.trim()) {
      errors.push('El género artístico es requerido');
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
      const artistData = {
        ...formData,
        edad: parseInt(formData.edad, 10)
      };

      const response = await axios.post('/api/artists', artistData);

      if (response.status === 201) {
        toast.success('Artista agregado exitosamente');
        onSuccess();
        setFormData({
          nombre: '',
          edad: '',
          perfil: '',
          foto_url: '',
          contacto: '',
          genero: '',
          redes_sociales: {
            instagram: '',
            twitter: '',
            website: ''
          }
        });
        setPreviewImage(null);
      }
    } catch (error: any) {
      console.error('Error al agregar artista:', error);
      
      // Handle validation errors from the server
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err: string) => {
          toast.error(err);
        });
      } else {
        toast.error(error.response?.data?.message || 'Error al agregar artista');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Photo Upload Section */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto del Artista *
          </label>
          <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {previewImage ? (
                <div className="relative inline-block">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mx-auto h-32 w-32 object-cover rounded-full"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setFormData(prev => ({ ...prev, foto_url: '' }));
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
                      <span>Sube una foto</span>
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
                  <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="edad" className="block text-sm font-medium text-gray-700">
            Edad *
          </label>
          <input
            type="number"
            name="edad"
            id="edad"
            required
            min="1"
            max="120"
            value={formData.edad}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="perfil" className="block text-sm font-medium text-gray-700">
            Perfil *
          </label>
          <textarea
            name="perfil"
            id="perfil"
            required
            value={formData.perfil}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Describe la trayectoria y estilo del artista..."
          />
        </div>

        <div>
          <label htmlFor="contacto" className="block text-sm font-medium text-gray-700">
            Email de Contacto *
          </label>
          <input
            type="email"
            name="contacto"
            id="contacto"
            required
            value={formData.contacto}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="genero" className="block text-sm font-medium text-gray-700">
            Género Artístico *
          </label>
          <input
            type="text"
            name="genero"
            id="genero"
            required
            value={formData.genero}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        {/* Social Media (Optional) */}
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Redes Sociales (Opcional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="redes_instagram" className="block text-sm text-gray-600">
                Instagram
              </label>
              <input
                type="text"
                name="redes_instagram"
                id="redes_instagram"
                value={formData.redes_sociales.instagram}
                onChange={handleChange}
                placeholder="@usuario"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="redes_twitter" className="block text-sm text-gray-600">
                Twitter
              </label>
              <input
                type="text"
                name="redes_twitter"
                id="redes_twitter"
                value={formData.redes_sociales.twitter}
                onChange={handleChange}
                placeholder="@usuario"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label htmlFor="redes_website" className="block text-sm text-gray-600">
                Sitio Web
              </label>
              <input
                type="text"
                name="redes_website"
                id="redes_website"
                value={formData.redes_sociales.website}
                onChange={handleChange}
                placeholder="www.ejemplo.com"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => onSuccess()}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Artista'}
        </button>
      </div>
    </form>
  );
};