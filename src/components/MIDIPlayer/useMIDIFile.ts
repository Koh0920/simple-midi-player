import { useState, useEffect } from "react";
import { Midi } from "@tonejs/midi";

interface ParsedMidiData {
  tracks: any[];
  duration: number;
}

export const useMIDIFile = (midiData: ArrayBuffer | null) => {
  const [parsedMidiData, setParsedMidiData] = useState<ParsedMidiData | null>(
    null
  );

  useEffect(() => {
    if (midiData) {
      const parseMidi = async () => {
        try {
          const midi = new Midi(midiData);
          const parsed: ParsedMidiData = {
            tracks: midi.tracks.map((track) => track.notes),
            duration: midi.duration,
          };
          setParsedMidiData(parsed);
        } catch (error) {
          console.error("Error parsing MIDI file:", error);
          setParsedMidiData(null);
        }
      };

      parseMidi();
    } else {
      setParsedMidiData(null);
    }
  }, [midiData]);

  return { parsedMidiData };
};
