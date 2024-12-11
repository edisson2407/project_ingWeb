import React, { useState } from 'react';
import { Artwork } from '../../types';
import { Trash2, Edit, Star } from 'lucide-react';
import { ArtworkDetailsModal } from '../Gallery/ArtworkDetailsModal';
import axios from '../../config/axios';
import { toast } from 'react-hot-toast';

interface ArtworkListProps {
  artworks: Artwork[];
  onDelete: (id: string) => void;
  onEdit: (artwork: Artwork) => void;
  artistFilter: string;
  onArtistFilterChange: (artistId: string) => void;
  artists: Array<{ _id: string; nombre: string }>;
}

export const ArtworkList: React.FC<ArtworkListProps> = ({
  artworks,
  onDelete,
  onEdit,
  artistFilter,
  onArtistFilterChange,
  artists,
}) => {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [ratings, setRatings] = useState([]);

  const handleArtworkClick = async (artwork: Artwork) => {
    try {
      const response = await axios.get(`/api/artworks/${artwork._id}/ratings`);
      setRatings(response.data);
      setSelectedArtwork(artwork);
    } catch (error) {
      console.error('Error fetching artwork details:', error);
      toast.error('Error al cargar los detalles de la obra');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <label htmlFor="artistFilter" className="block text-sm font-medium text-gray-700 mb-2">
          Filtrar por Artista
        </label>
        <select
          id="artistFilter"
          value={artistFilter}
          onChange={(e) => onArtistFilterChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="">Todos los artistas</option>
          {artists.map((artist) => (
            <option key={artist._id} value={artist._id}>
              {artist.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Imagen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artista
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valoración
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {artworks.map((artwork) => {
              const artist = artists.find(a => a._id === artwork.artist_id);
              return (
                <tr 
                  key={artwork._id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleArtworkClick(artwork)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${artwork.imagen_url}`}
                      alt={artwork.titulo}
                      className="h-16 w-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{artwork.titulo}</div>
                    <div className="text-sm text-gray-500">{artwork.tecnica}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {artist?.nombre || 'Artista no encontrado'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {artwork.disponible && artwork.precio > 0 ? (
                        `$${artwork.precio.toLocaleString()}`
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-900">
                        {artwork.rating?.toFixed(1)} ({artwork.numero_valoraciones})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      artwork.disponible
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {artwork.disponible ? 'Disponible' : 'No disponible'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(artwork);
                      }}
                      className="text-primary-600 hover:text-primary-900 mx-2"
                      title="Editar obra"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(artwork._id);
                      }}
                      className="text-red-600 hover:text-red-900 mx-2"
                      title="Eliminar obra"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedArtwork && (
        <ArtworkDetailsModal
          artwork={selectedArtwork}
          ratings={ratings}
          onClose={() => setSelectedArtwork(null)}
          artistName={artists.find(a => a._id === selectedArtwork.artist_id)?.nombre}
        />
      )}
    </div>
  );
};