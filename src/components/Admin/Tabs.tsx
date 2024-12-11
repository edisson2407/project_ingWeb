import React from 'react';
import { Users, Image } from 'lucide-react';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddArtist: () => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange, onAddArtist }) => {
  return (
    <div className="mt-8 sm:mt-12">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Seleccionar vista
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value)}
        >
          <option value="artists">Artistas</option>
          <option value="artworks">Obras</option>
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => onTabChange('artists')}
                className={`
                  flex items-center px-1 py-4 text-sm font-medium border-b-2
                  ${
                    activeTab === 'artists'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Users className="h-5 w-5 mr-2" />
                Artistas
              </button>
              <button
                onClick={() => onTabChange('artworks')}
                className={`
                  flex items-center px-1 py-4 text-sm font-medium border-b-2
                  ${
                    activeTab === 'artworks'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Image className="h-5 w-5 mr-2" />
                Obras
              </button>
            </nav>
            <button
              onClick={onAddArtist}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Agregar Artista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};