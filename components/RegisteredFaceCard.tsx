import React from 'react';
import { type RegisteredFace } from '../types';

interface RegisteredFaceCardProps {
  face: RegisteredFace;
  onDelete: (id: string) => void;
}

export const RegisteredFaceCard: React.FC<RegisteredFaceCardProps> = ({ face, onDelete }) => {
  return (
    <div className="group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 transform transition-transform duration-300 hover:scale-105 hover:border-cyan-500">
      <img
        src={`data:${face.mimeType};base64,${face.imageBase64}`}
        alt={face.name}
        className="w-full h-32 object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <p className="absolute bottom-0 left-0 right-0 p-2 text-center text-sm font-semibold text-white truncate">
        {face.name}
      </p>
      <button
        onClick={() => onDelete(face.id)}
        className="absolute top-1 right-1 bg-red-600/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500"
        aria-label={`Delete ${face.name}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};
