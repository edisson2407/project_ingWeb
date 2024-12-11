import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Artist } from '../../types';
import { ArtworkGrid } from '../../components/Artist/ArtworkGrid';
import { ArtistInfo } from '../../components/Artist/ArtistInfo';
import { ArtistStats } from '../../components/Artist/ArtistStats';
import axios from 'axios';

// Mock data for development
const mockArtist: Artist = {
  _id: '1',
  artist_id: 'artist1',
  nombre: 'María González',
  edad: 35,
  perfil: 'Artista contemporánea especializada en pintura al óleo y técnicas mixtas. Con más de 10 años de experiencia, mi trabajo explora la intersección entre la naturaleza y la urbanización moderna.',
  redes_sociales: {
    instagram: '@mariagonzalez.art',
    twitter: '@mariagonzalez',
    website: 'www.mariagonzalez.art'
  },
  contacto: 'maria@example.com',
  fecha_registro: '2024-01-01',
  estado: 'activo',
  genero: 'Pintura',
  valoracion_promedio: 4.8,
  numero_valoraciones: 24,
  obras: [
    {
      _id: '1',
      titulo: 'Atardecer en el Valle',
      descripcion: 'Una vista panorámica del valle al atardecer, con colores cálidos y vibrantes.',
      imagen_url: 'https://images.unsplash.com/photo-1617503752587-97d2103a96ea',
      fecha_creacion: '2024-01-15',
      tecnica: 'Óleo sobre lienzo',
      dimensiones: '100x80cm',
      precio: 1200,
      disponible: true
    },
    {
      _id: '2',
      titulo: 'Abstracción Urbana',
      descripcion: 'Interpretación abstracta de la vida urbana moderna.',
      imagen_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262',
      fecha_creacion: '2024-02-01',
      tecnica: 'Acrílico sobre tela',
      dimensiones: '120x100cm',
      precio: 1500,
      disponible: true
    }
  ]
};

export const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtist();
  }, [id]);

  const fetchArtist = async () => {
    try {
      // In development, use mock data
      // In production, uncomment the API call
      /*
      const response = await axios.get(`/api/artists/${id}`);
      setArtist(response.data);
      */
      
      // Using mock data for development
      setArtist(mockArtist);
    } catch (error) {
      toast.error('Error al cargar el perfil del artista');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Artista no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with artist info */}
          <div className="lg:col-span-1">
            <ArtistInfo artist={artist} />
            <div className="mt-6">
              <ArtistStats artist={artist} />
            </div>
          </div>

          {/* Main content with artwork grid */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
              Obras del Artista
            </h2>
            <ArtworkGrid artworks={artist.obras} />
          </div>
        </div>
      </div>
    </div>
  );
};