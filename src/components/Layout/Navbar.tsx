import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Palette, User, Image, Activity, Archive } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[rgba(18,40,63,0.4)] backdrop-blur-md shadow-lg">
      <div className="max-w-8xl mx-auto px-10">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-display text-xl font-bold">
                <img
                  src="/images/logo1.png"
                  alt="Logo"
                  className="h-20 w-auto" 
                />
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-5">
              <Link
                to="/obras"
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
              >
                <Archive className="h-5 w-5" />
                <span>Obras</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.tipo_usuario === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2"
                  >
                    Panel Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                >
                  <User className="h-5 w-5" />
                  <span>{user.nombre}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-[rgb(18,40,63)] text-white px-4 py-2 rounded-md hover:bg-primary-700"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};