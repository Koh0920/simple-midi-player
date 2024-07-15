export const SAMPLE_RATE = 44100;
export const BUFFER_SIZE = 1024;

export const MIN_FREQUENCY = 20;
export const MAX_FREQUENCY = 20000;

export const MIDI_NOTE_ON = 0x90;
export const MIDI_NOTE_OFF = 0x80;

export const NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export const midiNoteToFrequency = (note: number): number => {
  return 440 * Math.pow(2, (note - 69) / 12);
};

export const frequencyToMidiNote = (frequency: number): number => {
  return Math.round(12 * Math.log2(frequency / 440) + 69);
};
