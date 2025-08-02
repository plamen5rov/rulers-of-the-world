
import React from 'react';
import PortraitCard from './PortraitCard';
import { Portrait } from '../types';

interface GameBoardProps {
  rulerName: string;
  portraits: Portrait[];
  onCardClick: (index: number) => void;
  selectedCardIndex: number | null;
  isRoundResult: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ rulerName, portraits, onCardClick, selectedCardIndex, isRoundResult }) => {
  return (
    <div className="w-full flex-grow flex flex-col items-center p-4 md:p-8 animate-fade-in">
      <h2 className="text-center text-brand-light text-2xl font-sans">Identify the portrait of...</h2>
      <h1 className="text-center text-5xl md:text-6xl font-serif font-bold text-brand-gold my-4 drop-shadow-lg">
        {rulerName}
      </h1>
      <div className="w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-6">
        {portraits.map((portrait, index) => (
          <PortraitCard
            key={index}
            imageUrl={portrait.imageUrl}
            onClick={() => onCardClick(index)}
            isCorrect={portrait.isCorrect}
            isSelected={selectedCardIndex === index}
            isDisabled={isRoundResult}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;