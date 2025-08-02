
import React from 'react';

interface LoadingScreenProps {
  message: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-brand-bg bg-opacity-90 flex flex-col justify-center items-center z-50 animate-fade-in">
      <div className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-6 text-2xl font-serif text-brand-light tracking-wider">{message}</p>
    </div>
  );
};

export default LoadingScreen;
