import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Artist, Artwork } from '../../types';
import { ArtistList } from '../../components/Admin/ArtistList';
import { ArtworkList } from '../../components/Admin/ArtworkList';
import { ArtistForm } from '../../components/Admin/ArtistForm';
import { ArtworkForm } from '../../components/Admin/ArtworkForm';
import { Tabs } from '../../components/Admin/Tabs';
import { Stats } from '../../components/Admin/Stats';
import axios from '../../config/axios';
import { toast } from 'react-hot-toast';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [showArtistForm, setShowArtistForm] = useState(false);
  const [showArtworkForm, setShowArtworkForm] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('artists');
  const [artistFilter, setArtistFilter] = useState('');
  const [stats, setStats] = useState({
    totalArtists: 0,
    totalArtworks: 0,
    totalRatings: 0,
    averageRating: 0
  });

  useEffect(() => {
    if (!user || user.tipo_usuario !== 'admin') {
      toast.error('Acceso denegado');
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const [artistsRes, artworksRes, statsRes] = await Promise.all([
        axios.get('/api/artists'),
        axios.get('/api/artworks'),
        axios.get('/api/admin/stats')
      ]);
      
      setArtists(artistsRes.data);
      setArtworks(artworksRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArtist = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este artista? Esta acción eliminará también todas sus obras.')) {
      return;
    }

    try {
      await axios.delete(`/api/artists/${id}`);
      toast.success('Artista eliminado exitosamente');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting artist:', error);
      toast.error('Error al eliminar el artista');
    }
  };

  const handleDeleteArtwork = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta obra?')) {
      return;
    }

    try {
      await axios.delete(`/api/artworks/${id}`);
      toast.success('Obra eliminada exitosamente');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting artwork:', error);
      toast.error('Error al eliminar la obra');
    }
  };

  const handleEditArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setShowArtistForm(true);
  };

  const handleEditArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setShowArtworkForm(true);
  };

  const handleAddArtwork = (artist: Artist) => {
    setSelectedArtist(artist);
    setShowArtworkForm(true);
  };

  const handleCloseArtworkForm = () => {
    setShowArtworkForm(false);
    setSelectedArtist(null);
    setSelectedArtwork(null);
  };

  const filteredArtworks = artistFilter
    ? artworks.filter(artwork => artwork.artist_id === artistFilter)
    : artworks;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestiona artistas, obras y visualiza estadísticas de la galería
          </p>
        </div>

        <Stats stats={stats} />

        <Tabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onAddArtist={() => setShowArtistForm(true)}
        />

        <div className="mt-6">
          {activeTab === 'artists' ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ArtistList
                artists={artists}
                onDelete={handleDeleteArtist}
                onEdit={handleEditArtist}
                onAddArtwork={handleAddArtwork}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ArtworkList
                artworks={filteredArtworks}
                onDelete={handleDeleteArtwork}
                onEdit={handleEditArtwork}
                artistFilter={artistFilter}
                onArtistFilterChange={setArtistFilter}
                artists={artists}
              />
            </div>
          )}
        </div>

        {/* Artist Form Modal */}
        {showArtistForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-3xl p-6 m-4">
              <h2 className="text-xl font-bold mb-4">
                {selectedArtist ? 'Editar Artista' : 'Agregar Nuevo Artista'}
              </h2>
              <ArtistForm
                artist={selectedArtist}
                onSuccess={() => {
                  setShowArtistForm(false);
                  setSelectedArtist(null);
                  fetchDashboardData();
                }}
                onCancel={() => {
                  setShowArtistForm(false);
                  setSelectedArtist(null);
                }}
              />
            </div>
          </div>
        )}

        {/* Artwork Form Modal */}
        {showArtworkForm && (selectedArtist || selectedArtwork) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 m-4">
              <h2 className="text-xl font-bold mb-4">
                {selectedArtwork ? 'Editar Obra' : `Agregar Obra para ${selectedArtist?.nombre}`}
              </h2>
              <ArtworkForm
                artist={selectedArtist || selectedArtwork?.artist_id}
                artwork={selectedArtwork}
                onSuccess={() => {
                  handleCloseArtworkForm();
                  fetchDashboardData();
                }}
                onCancel={handleCloseArtworkForm}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};