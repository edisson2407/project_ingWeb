export interface User {
  _id: string;
  nombre: string;
  email: string;
  tipo_usuario: 'admin' | 'regular';
  fecha_registro: string;
}

export interface Artist {
  _id: string;
  artist_id: string;
  nombre: string;
  edad: number;
  perfil: string;
  redes_sociales: Record<string, string>;
  contacto: string;
  fecha_registro: string;
  estado: string;
  genero: string;
  valoracion_promedio: number;
  numero_valoraciones: number;
  obras: Artwork[];
}

export interface Artwork {
  _id: string;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  fecha_creacion: string;
  tecnica: string;
  dimensiones: string;
  precio: number;
  disponible: boolean;
  rating?: number;
  numero_valoraciones?: number;
}

export interface Rating {
  _id: string;
  artwork_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  fecha: string;
}