import React from 'react';
import { Artist } from '../../types';
import { Trash2, Edit, Image } from 'lucide-react';

interface ArtistListProps {
  artists: Artist[];
  onDelete: (id: string) => void;
  onEdit: (artist: Artist) => void;
  onAddArtwork: (artist: Artist) => void;
}

export const ArtistList: React.FC<ArtistListProps> = ({
  artists,
  onDelete,
  onEdit,
  onAddArtwork,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Foto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Género
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
          {artists.map((artist) => (
            <tr key={artist._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={`${import.meta.env.VITE_API_URL}${artist.foto_url}`}
                  alt={artist.nombre}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{artist.nombre}</div>
                <div className="text-sm text-gray-500">{artist.contacto}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {artist.genero}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{artist.valoracion_promedio.toFixed(1)}</div>
                <div className="text-sm text-gray-500">{artist.numero_valoraciones} valoraciones</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  artist.estado === 'activo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {artist.estado}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onAddArtwork(artist)}
                  className="text-primary-600 hover:text-primary-900 mx-2"
                  title="Agregar obra"
                >
                  <Image className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onEdit(artist)}
                  className="text-primary-600 hover:text-primary-900 mx-2"
                  title="Editar artista"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(artist._id)}
                  className="text-red-600 hover:text-red-900 mx-2"
                  title="Eliminar artista"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};