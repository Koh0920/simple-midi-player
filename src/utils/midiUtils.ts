import { NOTES } from "../constants/audioConstants";

export const midiNoteToNoteName = (midiNote: number): string => {
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = NOTES[midiNote % 12];
  return `${noteName}${octave}`;
};

export const noteNameToMidiNote = (noteName: string): number => {
  const note = noteName.slice(0, -1);
  const octave = parseInt(noteName.slice(-1));
  return NOTES.indexOf(note) + (octave + 1) * 12;
};

export const midiVelocityToGain = (velocity: number): number => {
  return (velocity / 127) ** 2;
};

export const parseMidiMessage = (
  message: number[]
): { command: number; channel: number; note: number; velocity: number } => {
  const [status, data1, data2] = message;
  const command = status >> 4;
  const channel = status & 0xf;

  return {
    command,
    channel,
    note: data1,
    velocity: data2,
  };
};

export const createMidiMessage = (
  command: number,
  channel: number,
  note: number,
  velocity: number
): number[] => {
  return [(command << 4) | channel, note, velocity];
};
