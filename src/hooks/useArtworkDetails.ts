import { useState } from 'react';
import axios from '../config/axios';
import { toast } from 'react-hot-toast';
import { Rating } from '../types';

export const useArtworkDetails = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRatings = async (artworkId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/artworks/${artworkId}/ratings`);
      setRatings(response.data);
    } catch (err) {
      const errorMessage = 'Error al cargar las valoraciones';
      console.error(errorMessage, err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearRatings = () => {
    setRatings([]);
    setError(null);
  };

  return {
    ratings,
    loading,
    error,
    fetchRatings,
    clearRatings
  };
};