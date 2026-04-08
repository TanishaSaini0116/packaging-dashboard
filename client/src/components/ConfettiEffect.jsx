import { useEffect } from 'react';
import confetti from 'canvas-confetti';

const ConfettiEffect = ({ trigger }) => {
  useEffect(() => {
    if (trigger) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#ffffff'],
      });
    }
  }, [trigger]);

  return null;
};

export default ConfettiEffect;