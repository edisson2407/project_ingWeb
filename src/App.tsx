import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Layout/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Admin/Dashboard';
import { GalleryView } from './pages/Gallery/GalleryView';
import { ArtworkGallery } from './pages/Gallery/ArtworkGallery';
import { ArtistProfile } from './pages/Artist/ArtistProfile';
import { UserProfile } from './pages/Profile/UserProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background-light">
          <Navbar />
          <Routes>
            <Route path="/" element={<GalleryView />} />
            <Route path="/obras" element={<ArtworkGallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/artists/:id" element={<ArtistProfile />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;