import React from 'react';
import { Artwork } from '../../types';
import { ArtworkCard } from '../Gallery/ArtworkCard';

interface ArtworkGridProps {
  artworks: Artwork[];
}

export const ArtworkGrid: React.FC<ArtworkGridProps> = ({ artworks }) => {
  if (artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Este artista aún no ha publicado obras.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {artworks.map((artwork) => (
        <ArtworkCard
          key={artwork._id}
          artwork={artwork}
          onRate={() => {}}
          onLike={() => {}}
        />
      ))}
    </div>
  );
};