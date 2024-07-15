import { MIN_FREQUENCY, MAX_FREQUENCY } from "../constants/audioConstants";

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const linearToDecibels = (linear: number): number => {
  return 20 * Math.log10(linear);
};

export const decibelsToLinear = (decibels: number): number => {
  return Math.pow(10, decibels / 20);
};

export const frequencyToMidi = (frequency: number): number => {
  return (
    69 + 12 * Math.log2(clamp(frequency, MIN_FREQUENCY, MAX_FREQUENCY) / 440)
  );
};

export const midiToFrequency = (midi: number): number => {
  return 440 * Math.pow(2, (midi - 69) / 12);
};

export const createAudioContext = (): AudioContext => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

export const connectNodes = (...nodes: AudioNode[]): void => {
  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].connect(nodes[i + 1]);
  }
};
