import React from 'react';
import { Link } from 'react-router-dom';
import { Artist } from '../../types';
import { Star } from 'lucide-react';

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  return (
    <Link to={`/artists/${artist._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{artist.nombre}</h3>
            <p className="text-sm text-gray-600 mt-1">{artist.genero}</p>
          </div>
          <div className="flex items-center space-x-1 bg-primary-50 px-2 py-1 rounded-full">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-primary-700">
              {artist.valoracion_promedio.toFixed(1)}
            </span>
          </div>
        </div>
        <p className="mt-4 text-gray-600 line-clamp-3">{artist.perfil}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {artist.obras.length} {artist.obras.length === 1 ? 'obra' : 'obras'}
          </span>
          <span className="text-sm text-primary-600 font-medium">Ver perfil →</span>
        </div>
      </div>
    </Link>
  );
};