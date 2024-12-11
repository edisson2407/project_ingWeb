import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export const useRating = () => {
  const { user } = useAuth();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const submitRating = async (
    artworkId: string,
    rating: number,
    comment: string
  ) => {
    if (!user) {
      toast.error('Debes iniciar sesión para calificar obras');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/artworks/${artworkId}/ratings`,
        {
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('¡Gracias por tu calificación!');
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error('Ya has calificado esta obra');
      } else {
        toast.error('Error al enviar la calificación');
      }
      throw error;
    }
  };

  return {
    isRatingModalOpen,
    openRatingModal: () => setIsRatingModalOpen(true),
    closeRatingModal: () => setIsRatingModalOpen(false),
    submitRating,
  };
};