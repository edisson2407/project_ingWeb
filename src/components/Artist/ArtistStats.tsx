import React from 'react';
import { Artist } from '../../types';
import { Star, Image, Calendar } from 'lucide-react';

interface ArtistStatsProps {
  artist: Artist;
}

export const ArtistStats: React.FC<ArtistStatsProps> = ({ artist }) => {
  const joinDate = new Date(artist.fecha_registro).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Estadísticas</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            <span>Valoración</span>
          </div>
          <div className="text-gray-900 font-medium">
            {artist.valoracion_promedio.toFixed(1)} ({artist.numero_valoraciones})
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Image className="h-5 w-5 mr-2" />
            <span>Obras</span>
          </div>
          <div className="text-gray-900 font-medium">{artist.obras.length}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2" />
            <span>Miembro desde</span>
          </div>
          <div className="text-gray-900 font-medium">{joinDate}</div>
        </div>
      </div>
    </div>
  );
};