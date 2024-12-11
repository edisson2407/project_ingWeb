import React from 'react';
import { Artist } from '../../types';
import { Mail, Globe, Instagram, Twitter } from 'lucide-react';

interface ArtistInfoProps {
  artist: Artist;
}

export const ArtistInfo: React.FC<ArtistInfoProps> = ({ artist }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full overflow-hidden mb-4">
          {/* Placeholder for artist avatar */}
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
            {artist.nombre.charAt(0)}
          </div>
        </div>
        <h1 className="text-2xl font-display font-bold text-gray-900">{artist.nombre}</h1>
        <p className="text-gray-600 mt-1">{artist.genero}</p>
      </div>

      <div className="space-y-4">
        <p className="text-gray-700">{artist.perfil}</p>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Contacto y Redes Sociales</h3>
          <div className="space-y-2">
            <a
              href={`mailto:${artist.contacto}`}
              className="flex items-center text-gray-600 hover:text-primary-600"
            >
              <Mail className="h-4 w-4 mr-2" />
              {artist.contacto}
            </a>
            {artist.redes_sociales.website && (
              <a
                href={`https://${artist.redes_sociales.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-primary-600"
              >
                <Globe className="h-4 w-4 mr-2" />
                {artist.redes_sociales.website}
              </a>
            )}
            {artist.redes_sociales.instagram && (
              <a
                href={`https://instagram.com/${artist.redes_sociales.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-primary-600"
              >
                <Instagram className="h-4 w-4 mr-2" />
                {artist.redes_sociales.instagram}
              </a>
            )}
            {artist.redes_sociales.twitter && (
              <a
                href={`https://twitter.com/${artist.redes_sociales.twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-primary-600"
              >
                <Twitter className="h-4 w-4 mr-2" />
                {artist.redes_sociales.twitter}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};