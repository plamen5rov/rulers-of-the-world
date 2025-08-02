
import React from 'react';
import { TOTAL_ROUNDS, POINTS_PER_CORRECT_ANSWER } from '../constants';

interface GameOverScreenProps {
  score: number;
  onPlayAgain: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onPlayAgain }) => {
  const maxScore = TOTAL_ROUNDS * POINTS_PER_CORRECT_ANSWER;
  const performance = score / maxScore >= 0.7 ? "Excellent!" : score / maxScore >= 0.4 ? "Well Done!" : "Needs Improvement.";

  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-center p-8 animate-fade-in">
      <h1 className="text-6xl md:text-7xl font-serif font-bold text-brand-gold drop-shadow-lg">
        Game Over
      </h1>
      <p className="mt-4 text-2xl text-brand-light">Your historical conquest has ended.</p>
      <div className="mt-8 bg-brand-primary/50 rounded-lg p-8 shadow-2xl">
        <p className="text-xl text-brand-light">Final Score</p>
        <p className="text-7xl font-bold text-brand-gold my-2">{score}</p>
        <p className="text-xl text-brand-light">{performance}</p>
      </div>
      <button
        onClick={onPlayAgain}
        className="mt-12 px-12 py-4 bg-brand-gold text-brand-primary text-2xl font-bold font-serif rounded-lg shadow-lg hover:bg-yellow-300 transform transition-transform duration-200 hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOverScreen;
