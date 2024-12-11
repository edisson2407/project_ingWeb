import React from 'react';
import { Users, Image, Star, TrendingUp } from 'lucide-react';

interface StatsProps {
  stats: {
    totalArtists: number;
    totalArtworks: number;
    totalRatings: number;
    averageRating: number;
  };
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  const statItems = [
    {
      name: 'Artistas',
      value: stats.totalArtists,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Obras',
      value: stats.totalArtworks,
      icon: Image,
      color: 'bg-green-500',
    },
    {
      name: 'Calificaciones',
      value: stats.totalRatings,
      icon: Star,
      color: 'bg-yellow-500',
    },
    {
      name: 'Calificación Promedio',
      value: stats.averageRating.toFixed(1),
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <div
          key={item.name}
          className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
        >
          <dt>
            <div className={`absolute rounded-md p-3 ${item.color}`}>
              <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 text-sm font-medium text-gray-500 truncate">
              {item.name}
            </p>
          </dt>
          <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
          </dd>
        </div>
      ))}
    </div>
  );
};