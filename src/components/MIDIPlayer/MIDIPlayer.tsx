import React, { useEffect, useRef } from "react";
import { useMIDIFile } from "./useMIDIFile";
import { useTempoAnalysis } from "./useTempoAnalysis";

interface MIDIPlayerProps {
  audioContext: AudioContext | null;
  isPlaying: boolean;
  midiData: ArrayBuffer | null;
  onPlaybackComplete: () => void;
}

export const MIDIPlayer: React.FC<MIDIPlayerProps> = ({
  audioContext,
  isPlaying,
  midiData,
  onPlaybackComplete,
}) => {
  const { parsedMidiData } = useMIDIFile(midiData);
  const { tempo, timeSignature } = useTempoAnalysis(parsedMidiData);
  const schedulerIntervalRef = useRef<number | null>(null);
  const currentTimeRef = useRef<number>(0);
  const currentEventIndexRef = useRef<number>(0);

  useEffect(() => {
    if (isPlaying && audioContext && parsedMidiData) {
      startPlayback();
    } else {
      stopPlayback();
    }

    return () => {
      stopPlayback();
    };
  }, [isPlaying, audioContext, parsedMidiData]);

  const startPlayback = () => {
    if (!audioContext || !parsedMidiData) return;

    const scheduler = () => {
      while (
        currentEventIndexRef.current < parsedMidiData.tracks[0].length &&
        parsedMidiData.tracks[0][currentEventIndexRef.current].time <=
          currentTimeRef.current
      ) {
        const event = parsedMidiData.tracks[0][currentEventIndexRef.current];
        if (event.type === "noteOn") {
          playNote(event.noteNumber, event.velocity);
        }
        currentEventIndexRef.current++;
      }

      if (currentEventIndexRef.current >= parsedMidiData.tracks[0].length) {
        stopPlayback();
        onPlaybackComplete();
      } else {
        currentTimeRef.current += 0.01; // Increment time by 10ms
      }
    };

    schedulerIntervalRef.current = window.setInterval(scheduler, 10);
  };

  const stopPlayback = () => {
    if (schedulerIntervalRef.current) {
      clearInterval(schedulerIntervalRef.current);
      schedulerIntervalRef.current = null;
    }
    currentTimeRef.current = 0;
    currentEventIndexRef.current = 0;
  };

  const playNote = (noteNumber: number, velocity: number) => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      midiNoteToFrequency(noteNumber),
      audioContext.currentTime
    );

    gainNode.gain.setValueAtTime(velocity / 127, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.00001,
      audioContext.currentTime + 0.5
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const midiNoteToFrequency = (note: number): number => {
    return 440 * Math.pow(2, (note - 69) / 12);
  };

  return (
    <div>
      <p>Tempo: {tempo} BPM</p>
      <p>
        Time Signature: {timeSignature.numerator}/{timeSignature.denominator}
      </p>
    </div>
  );
};

export default MIDIPlayer;
