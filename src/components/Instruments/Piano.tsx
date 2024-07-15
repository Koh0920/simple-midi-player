import React from "react";
import "../../styles/components/Piano.css";

interface PianoProps {
  audioContext: AudioContext | null;
  playNote: (midiNote: number, velocity?: number) => void;
  ensureAudioContext: () => void;
}

interface PianoKey {
  note: string;
  midiNote: number;
  isBlack: boolean;
}

const PIANO_KEYS: PianoKey[] = [
  { note: "C", midiNote: 60, isBlack: false },
  { note: "C#", midiNote: 61, isBlack: true },
  { note: "D", midiNote: 62, isBlack: false },
  { note: "D#", midiNote: 63, isBlack: true },
  { note: "E", midiNote: 64, isBlack: false },
  { note: "F", midiNote: 65, isBlack: false },
  { note: "F#", midiNote: 66, isBlack: true },
  { note: "G", midiNote: 67, isBlack: false },
  { note: "G#", midiNote: 68, isBlack: true },
  { note: "A", midiNote: 69, isBlack: false },
  { note: "A#", midiNote: 70, isBlack: true },
  { note: "B", midiNote: 71, isBlack: false },
];

export const Piano: React.FC<PianoProps> = ({
  audioContext,
  playNote,
  ensureAudioContext,
}) => {
  const handleNotePress = (midiNote: number) => {
    ensureAudioContext();
    if (audioContext) {
      playNote(midiNote, 1); // velocity 1 for maximum volume
    }
  };

  return (
    <div className="piano">
      {PIANO_KEYS.map((key) => (
        <button
          key={key.midiNote}
          className={`piano-key ${key.isBlack ? "black" : "white"}`}
          onMouseDown={() => handleNotePress(key.midiNote)}
          onTouchStart={() => handleNotePress(key.midiNote)}
        >
          {key.note}
        </button>
      ))}
    </div>
  );
};

export default Piano;
