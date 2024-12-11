import { useState, useCallback } from 'react';
import axios from '../config/axios';
import { toast } from 'react-hot-toast';
import { Artist, Artwork } from '../types';

export const useGalleryData = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [artistsRes, artworksRes] = await Promise.all([
        axios.get('/api/artists'),
        axios.get('/api/artworks')
      ]);

      setArtists(artistsRes.data || []);
      setArtworks(artworksRes.data || []);
    } catch (err) {
      const errorMessage = 'Error al cargar los datos';
      console.error(errorMessage, err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const rateArtwork = async (artworkId: string, rating: number, comment: string) => {
    try {
      await axios.post(`/api/artworks/${artworkId}/ratings`, { rating, comment });
      toast.success('Calificación registrada exitosamente');
      await loadData();
    } catch (err) {
      const errorMessage = 'Error al calificar la obra';
      console.error(errorMessage, err);
      toast.error(errorMessage);
    }
  };

  return {
    artists,
    artworks,
    loading,
    error,
    loadData,
    rateArtwork
  };
};