import React from 'react';
import { Artwork } from '../../types';
import { ArtworkCard } from './ArtworkCard';

interface ArtworkGridProps {
  artworks: Artwork[];
  onRate?: (artworkId: string, rating: number, comment: string) => Promise<void>;
  showRating?: boolean;
}

export const ArtworkGrid: React.FC<ArtworkGridProps> = ({
  artworks,
  onRate,
  showRating = true,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {artworks.map((artwork) => (
        <ArtworkCard
          key={artwork._id}
          artwork={artwork}
          onRate={onRate}
          showRating={showRating}
        />
      ))}
    </div>
  );
};