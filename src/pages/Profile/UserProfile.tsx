import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { User, Camera, Lock } from 'lucide-react';
import axios from '../../config/axios';
import { ProfileForm } from '../../components/Profile/ProfileForm';
import { PasswordForm } from '../../components/Profile/PasswordForm';
import { PhotoUpload } from '../../components/Profile/PhotoUpload';

export const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profileData, setProfileData] = useState({
    nombre: '',
    email: '',
    foto_url: '',
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`/api/users/profile`);
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error al cargar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data: typeof profileData) => {
    try {
      const response = await axios.put('/api/users/profile', data);
      setProfileData(response.data);
      updateUser(response.data);
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    }
  };

  const handlePhotoUpload = async (photoData: string) => {
    try {
      const response = await axios.put('/api/users/profile/photo', { foto_url: photoData });
      setProfileData(prev => ({ ...prev, foto_url: response.data.foto_url }));
      updateUser({ ...user!, foto_url: response.data.foto_url });
      toast.success('Foto de perfil actualizada');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Error al actualizar la foto de perfil');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Perfil de Usuario
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Actualiza tu información personal y foto de perfil
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="space-y-6">
                  <PhotoUpload
                    currentPhoto={profileData.foto_url}
                    onPhotoUpload={handlePhotoUpload}
                  />
                  <ProfileForm
                    initialData={profileData}
                    onSubmit={handleUpdateProfile}
                  />
                  <div className="border-t border-gray-200 pt-6">
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {showPasswordForm ? 'Cancelar' : 'Cambiar Contraseña'}
                    </button>
                  </div>
                  {showPasswordForm && (
                    <PasswordForm onCancel={() => setShowPasswordForm(false)} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};