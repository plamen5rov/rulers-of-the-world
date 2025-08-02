import React from 'react';

interface PortraitCardProps {
  imageUrl: string;
  onClick: () => void;
  isCorrect: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

const PortraitCard: React.FC<PortraitCardProps> = ({ imageUrl, onClick, isCorrect, isSelected, isDisabled }) => {
  const baseClasses = "relative w-full aspect-[3/4] rounded-lg shadow-lg cursor-pointer transition-all duration-300 overflow-hidden";
  const hoverClasses = isDisabled ? "" : "hover:scale-105 hover:shadow-xl";
  
  let borderClass = 'border-4 border-transparent';
  if (isSelected) {
    // When a card is selected, show feedback.
    borderClass = isCorrect ? 'border-4 border-green-500 animate-pulse' : 'border-4 border-red-600 animate-shake';
  }

  return (
    <button onClick={onClick} disabled={isDisabled} className={`${baseClasses} ${hoverClasses} ${borderClass}`}>
        <img src={imageUrl} alt="Portrait" className="w-full h-full object-cover" />
        {/* Overlay to show correctness */}
        {isSelected && (
          <div className={`absolute inset-0 flex items-center justify-center text-white text-6xl font-bold ${isCorrect ? 'bg-green-500/50' : 'bg-red-600/50'}`}>
            {isCorrect ? '✓' : '✗'}
          </div>
        )}
    </button>
  );
};

export default PortraitCard;