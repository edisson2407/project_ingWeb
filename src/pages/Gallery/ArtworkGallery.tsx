import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Artwork, Artist } from '../../types';
import { FilterBar } from '../../components/Gallery/FilterBar';
import { ArtworkGrid } from '../../components/Gallery/ArtworkGrid';
import axios from '../../config/axios';

export const ArtworkGallery = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [artworksRes, artistsRes] = await Promise.all([
        axios.get('/api/artworks'),
        axios.get('/api/artists')
      ]);
      setArtworks(Array.isArray(artworksRes.data) ? artworksRes.data : []);
      setArtists(Array.isArray(artistsRes.data) ? artistsRes.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar las obras');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (artworkId: string, rating: number, comment: string) => {
    try {
      await axios.post(`/api/artworks/${artworkId}/ratings`, { rating, comment });
      toast.success('Calificación registrada exitosamente');
      fetchData(); // Refresh to show updated ratings
    } catch (error: any) {
      console.error('Error rating artwork:', error);
      toast.error(error.response?.data?.message || 'Error al calificar la obra');
    }
  };

  // Filter and sort artworks
  const filteredArtworks = artworks
    .filter(artwork =>
      artwork.titulo.toLowerCase().includes(search.toLowerCase()) ||
      artwork.descripcion.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.precio - b.precio;
        case 'price-desc':
          return b.precio - a.precio;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default: // 'recent'
          return new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime();
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light">
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onFilterClick={() => setShowFilters(!showFilters)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Galería de Obras
          </h1>
          <div className="text-sm text-gray-500">
            {filteredArtworks.length} {filteredArtworks.length === 1 ? 'obra' : 'obras'}
          </div>
        </div>

        {filteredArtworks.length > 0 ? (
          <ArtworkGrid
            artworks={filteredArtworks}
            onRate={handleRate}
            showRating={true}
            artists={artists}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron obras que coincidan con tu búsqueda.</p>
          </div>
        )}
      </main>
    </div>
  );
};