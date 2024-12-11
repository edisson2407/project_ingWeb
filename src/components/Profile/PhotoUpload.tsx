import React, { useState, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PhotoUploadProps {
  currentPhoto: string;
  onPhotoUpload: (photoData: string) => Promise<void>;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ currentPhoto, onPhotoUpload }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!previewUrl) return;

    setIsUploading(true);
    try {
      await onPhotoUpload(previewUrl);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={previewUrl || currentPhoto || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover"
          />
          {previewUrl && (
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Camera className="h-5 w-5 mr-2" />
            Cambiar Foto
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
        </div>
      </div>

      {previewUrl && (
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isUploading ? 'Guardando...' : 'Guardar Foto'}
          </button>
        </div>
      )}
    </div>
  );
};