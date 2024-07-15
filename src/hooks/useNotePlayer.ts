import { useCallback } from "react";
import { midiNoteToFrequency } from "../constants/audioConstants";

interface NotePlayerOptions {
  type?: OscillatorType;
  duration?: number;
}

export const useNotePlayer = (audioContext: AudioContext | null) => {
  const playNote = useCallback(
    (
      midiNote: number,
      velocity: number = 1,
      options: NotePlayerOptions = {}
    ) => {
      if (!audioContext) return;

      const { type = "sine", duration = 0.5 } = options;
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(
        midiNoteToFrequency(midiNote),
        audioContext.currentTime
      );

      gainNode.gain.setValueAtTime(velocity, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    },
    [audioContext]
  );

  return { playNote };
};
