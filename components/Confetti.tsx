
import React from 'react';

// Simple CSS confetti. No external libraries needed.
const Confetti: React.FC = () => {
  const confettiCount = 100;
  const colors = ['#ffd700', '#e94560', '#f0f0f0', '#0f3460'];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-50">
      {Array.from({ length: confettiCount }).map((_, i) => {
        const style: React.CSSProperties = {
          left: `${Math.random() * 100}%`,
          animation: `fall ${Math.random() * 3 + 2}s linear ${Math.random() * 2}s infinite`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          width: `${Math.random() * 8 + 4}px`,
          height: `${Math.random() * 15 + 5}px`,
          opacity: Math.random() + 0.5,
        };
        return (
          <div
            key={i}
            className="absolute top-[-20px] rounded-sm"
            style={style}
          ></div>
        );
      })}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(${Math.random() * 360}deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Confetti;
