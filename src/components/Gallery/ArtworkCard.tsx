import React, { useState } from 'react';
import { Artwork, Rating } from '../../types';
import { RatingStars } from '../Rating/RatingStars';
import { useRating } from '../../hooks/useRating';
import { RatingModal } from '../Rating/RatingModal';
import { ArtworkDetailsModal } from './ArtworkDetailsModal';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from '../../config/axios';

interface ArtworkCardProps {
  artwork: Artwork;
  onRate?: (artworkId: string, rating: number, comment: string) => Promise<void>;
  showRating?: boolean;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onRate,
  showRating = true,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const {
    isRatingModalOpen,
    openRatingModal,
    closeRatingModal,
    submitRating,
  } = useRating();

  const handleRateClick = () => {
    if (!user) {
      toast.error('Debes iniciar sesión para calificar obras');
      navigate('/login');
      return;
    }
    openRatingModal();
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (onRate) {
      await onRate(artwork._id, rating, comment);
      closeRatingModal();
    }
  };

  const handleShowDetails = async () => {
    try {
      const response = await axios.get(`/api/artworks/${artwork._id}/ratings`);
      setRatings(response.data);
      setShowDetails(true);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      toast.error('Error al cargar las valoraciones');
    }
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
        onClick={handleShowDetails}
      >
        <div className="relative aspect-[3/4]">
          <img
            src={`${import.meta.env.VITE_API_URL}${artwork.imagen_url}`}
            alt={artwork.titulo}
            className="w-full h-full object-cover"
          />
          {artwork.disponible && (
            <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
              Disponible
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {artwork.titulo}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {artwork.descripcion}
          </p>
          <div className="flex justify-between items-center">
            {artwork.disponible && artwork.precio > 0 && (
              <span className="text-primary-600 font-semibold">
                ${artwork.precio.toLocaleString()}
              </span>
            )}
            {showRating && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRateClick();
                }}
                className="p-1.5 text-gray-500 hover:text-yellow-500 transition-colors"
              >
                <RatingStars 
                  rating={artwork.rating || 0} 
                  size="sm"
                  showCount
                  count={artwork.numero_valoraciones}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {showDetails && (
        <ArtworkDetailsModal
          artwork={artwork}
          ratings={ratings}
          onClose={() => setShowDetails(false)}
        />
      )}

      {isRatingModalOpen && (
        <RatingModal
          artwork={artwork}
          onClose={closeRatingModal}
          onSubmit={handleRatingSubmit}
        />
      )}
    </>
  );
};