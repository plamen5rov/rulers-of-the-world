
import React from 'react';
import { TOTAL_ROUNDS } from '../constants';

interface ScoreboardProps {
  score: number;
  round: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score, round }) => {
  return (
    <div className="w-full p-4 bg-brand-primary/30 backdrop-blur-sm rounded-b-xl shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-brand-light">
        <div className="text-center">
          <p className="text-sm font-sans uppercase tracking-widest text-brand-gold">Score</p>
          <p className="text-3xl font-bold font-serif">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-sans uppercase tracking-widest text-brand-gold">Round</p>
          <p className="text-3xl font-bold font-serif">{Math.min(round, TOTAL_ROUNDS)} / {TOTAL_ROUNDS}</p>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
