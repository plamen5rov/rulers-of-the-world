import { useCallback, useEffect, useRef } from 'react';

// Using new sound files to ensure cross-browser compatibility and fix playback errors.
// The previous victory sound was still causing issues, so it's being replaced with a more reliable one.
const victorySoundUrl = 'https://cdn.pixabay.com/audio/2022/10/13/audio_a14bce3a56.mp3'; // Success chime sound
const wrongSoundUrl = 'https://cdn.pixabay.com/audio/2022/03/14/audio_7fe2f07062.mp3'; // Negative Beeps sound

export const useSounds = () => {
  const victoryAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload audio files
    victoryAudioRef.current = new Audio(victorySoundUrl);
    victoryAudioRef.current.preload = 'auto';
    wrongAudioRef.current = new Audio(wrongSoundUrl);
    wrongAudioRef.current.preload = 'auto';
  }, []);

  const playVictorySound = useCallback(() => {
    if (victoryAudioRef.current) {
      victoryAudioRef.current.currentTime = 0;
      victoryAudioRef.current.play().catch(e => console.error("Error playing victory sound:", e));
    }
  }, []);

  const playWrongSound = useCallback(() => {
    if (wrongAudioRef.current) {
      wrongAudioRef.current.currentTime = 0;
      wrongAudioRef.current.play().catch(e => console.error("Error playing wrong sound:", e));
    }
  }, []);

  return { playVictorySound, playWrongSound };
};
