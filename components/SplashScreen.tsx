
import React from 'react';

interface SplashScreenProps {
  onStart: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center p-8 animate-fade-in">
      <h1 className="text-6xl md:text-8xl font-serif font-bold text-brand-gold drop-shadow-lg">
        Rulers of The World
      </h1>
      <p className="mt-4 text-xl md:text-2xl text-brand-light max-w-2xl">
        Test your knowledge of history's most iconic figures. Can you identify the true ruler from a gallery of pretenders?
      </p>
      <button
        onClick={onStart}
        className="mt-12 px-12 py-4 bg-brand-gold text-brand-primary text-2xl font-bold font-serif rounded-lg shadow-lg hover:bg-yellow-300 transform transition-transform duration-200 hover:scale-105"
      >
        Begin Your Reign
      </button>
    </div>
  );
};

export default SplashScreen;
