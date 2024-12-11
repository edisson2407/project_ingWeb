import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Artist, Artwork } from '../../types';
import { FilterBar } from '../../components/Gallery/FilterBar';
import { ArtworkCard } from '../../components/Gallery/ArtworkCard';
import { ArtistCard } from '../../components/Gallery/ArtistCard';
import { useAuth } from '../../contexts/AuthContext';

export const GalleryView = () => {
  const { user } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [artistsRes, artworksRes] = await Promise.all([
        axios.get('/api/artists'),
        axios.get('/api/artworks/featured'),
      ]);

      // Ensure we always have arrays, even if the response is empty
      setArtists(Array.isArray(artistsRes.data) ? artistsRes.data : []);
      setFeaturedArtworks(Array.isArray(artworksRes.data) ? artworksRes.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar la galería');
      setArtists([]);
      setFeaturedArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (artworkId: string, rating: number, comment: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/artworks/${artworkId}/ratings`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Calificación registrada');
      fetchData(); // Refresh data to show updated ratings
    } catch (error) {
      toast.error('Error al calificar la obra');
    }
  };

  const handleLike = async (artworkId: string) => {
    if (!user) {
      toast.error('Debes iniciar sesión para guardar obras en favoritos');
      return;
    }
    // Implement like functionality
    toast.success('Obra agregada a favoritos');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  // Apply filters and sorting
  const filteredArtworks = featuredArtworks
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

  return (
    <div className="min-h-screen bg-background-light">
      <div className="relative bg-cover bg-center" style={{ backgroundImage: `url('/images/ciudad.png')`, height: '60vh' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white text-center py-12">
          <h1 className="text-4xl font-extrabold mb-4">Discover Your Life, Travel</h1>
          <h1 className="text-4xl font-extrabold mb-4">Where You Want</h1>
          <p className="text-lg mb-6">Would you explore natural paradise in the world, let's find the best</p>
          <p className="text-lg mb-6">destination in the world with us.</p>
        </div>
      </div>


      <FilterBar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onFilterClick={() => setShowFilters(!showFilters)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
            Obras Destacadas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtworks.map((artwork) => (
              <ArtworkCard
                key={artwork._id}
                artwork={artwork}
                onRate={handleRate}
                onLike={() => handleLike(artwork._id)}
              />
            ))}
          </div>
          {filteredArtworks.length === 0 && (
            <p className="text-center text-gray-500 mt-8">
              No se encontraron obras que coincidan con tu búsqueda.
            </p>
          )}
        </section>

        {/* Artists Section */}
        <section>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
            Artistas Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist._id} artist={artist} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};