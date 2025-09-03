import React from 'react';

const UserGroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M8 10a4 4 0 118 0 4 4 0 01-8 0zm-2 9a2 2 0 012-2h8a2 2 0 012 2v1H6v-1zm14-1a1 1 0 00-1-1h-2a1 1 0 100 2h2a1 1 0 001-1zm-2-9a4 4 0 10-8 0 4 4 0 008 0zm-2 9a2 2 0 002-2v-1h-4v1a2 2 0 002 2zM4 18a2 2 0 012-2h2a1 1 0 100-2H6a4 4 0 00-4 4v1h4v-1zm12-9a4 4 0 10-8 0 4 4 0 008 0z" clipRule="evenodd" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-5xl text-center mb-8">
      <div className="flex justify-center items-center gap-4">
        <UserGroupIcon />
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-teal-500 text-transparent bg-clip-text">
          AI Face Recognition
        </h1>
      </div>
      <p className="mt-4 text-lg text-gray-400">
        Register faces and use AI to identify them in new photos.
      </p>
    </header>
  );
};
