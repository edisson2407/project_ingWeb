import React from 'react';
import { X, Star } from 'lucide-react';
import { Artwork, Rating as RatingType } from '../../types';
import { RatingStars } from '../Rating/RatingStars';
import { formatDate } from '../../utils/dateUtils';

interface ArtworkDetailsModalProps {
  artwork: Artwork;
  ratings: RatingType[];
  onClose: () => void;
  artistName?: string;
}

export const ArtworkDetailsModal: React.FC<ArtworkDetailsModalProps> = ({
  artwork,
  ratings,
  onClose,
  artistName
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{artwork.titulo}</h2>
            {artistName && (
              <p className="text-sm text-gray-600 mt-1">por {artistName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Image */}
          <div>
            <img
              src={`${import.meta.env.VITE_API_URL}${artwork.imagen_url}`}
              alt={artwork.titulo}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Detalles de la Obra</h3>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Técnica</dt>
                  <dd className="text-sm text-gray-900">{artwork.tecnica}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Dimensiones</dt>
                  <dd className="text-sm text-gray-900">{artwork.dimensiones}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fecha de Creación</dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(artwork.fecha_creacion)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Estado</dt>
                  <dd className="text-sm text-gray-900">
                    {artwork.disponible ? (
                      <span className="text-green-600">Disponible</span>
                    ) : (
                      <span className="text-red-600">No disponible</span>
                    )}
                  </dd>
                </div>
                {artwork.disponible && artwork.precio > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Precio</dt>
                    <dd className="text-sm font-semibold text-primary-600">
                      ${artwork.precio.toLocaleString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-700">{artwork.descripcion}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Valoraciones</h3>
                <RatingStars
                  rating={artwork.rating || 0}
                  size="lg"
                  showCount
                  count={artwork.numero_valoraciones}
                />
              </div>

              <div className="space-y-4 max-h-60 overflow-y-auto pr-4">
                {ratings.length > 0 ? (
                  ratings.map((rating) => (
                    <div
                      key={rating._id}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${
                                index < rating.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatDate(rating.fecha)}
                        </span>
                      </div>
                      {rating.comment && (
                        <p className="text-gray-700 text-sm">{rating.comment}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Esta obra aún no tiene valoraciones
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};