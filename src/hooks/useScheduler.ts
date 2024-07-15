import { useRef, useCallback } from "react";
import { MIDI_NOTE_ON, MIDI_NOTE_OFF } from "../constants/audioConstants";

interface MidiEvent {
  type: number;
  noteNumber: number;
  velocity: number;
  time: number;
}

export const useScheduler = (
  audioContext: AudioContext | null,
  playNote: (note: number, velocity: number) => void
) => {
  const schedulerIntervalRef = useRef<number | null>(null);
  const eventsRef = useRef<MidiEvent[]>([]);
  const currentTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const scheduleEvents = useCallback(() => {
    if (!audioContext) return;

    const currentTime = audioContext.currentTime - startTimeRef.current;

    while (
      eventsRef.current.length &&
      eventsRef.current[0].time <= currentTime
    ) {
      const event = eventsRef.current.shift();
      if (event) {
        if (event.type === MIDI_NOTE_ON) {
          playNote(event.noteNumber, event.velocity);
        }
        // Note: MIDI_NOTE_OFF events are not handled in this simple implementation
      }
    }

    currentTimeRef.current = currentTime;

    if (!eventsRef.current.length) {
      stopScheduler();
    }
  }, [audioContext, playNote]);

  const startScheduler = useCallback(
    (events: MidiEvent[]) => {
      if (!audioContext) return;

      eventsRef.current = [...events];
      startTimeRef.current = audioContext.currentTime;
      currentTimeRef.current = 0;

      if (schedulerIntervalRef.current) {
        clearInterval(schedulerIntervalRef.current);
      }

      schedulerIntervalRef.current = window.setInterval(scheduleEvents, 10); // Schedule every 10ms
    },
    [audioContext, scheduleEvents]
  );

  const stopScheduler = useCallback(() => {
    if (schedulerIntervalRef.current) {
      clearInterval(schedulerIntervalRef.current);
      schedulerIntervalRef.current = null;
    }
    eventsRef.current = [];
    currentTimeRef.current = 0;
  }, []);

  return { startScheduler, stopScheduler };
};
