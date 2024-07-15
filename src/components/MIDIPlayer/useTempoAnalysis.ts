import { useState, useEffect } from "react";

interface TimeSignature {
  numerator: number;
  denominator: number;
}

interface ParsedMidiData {
  tracks: any[];
  duration: number;
}

export const useTempoAnalysis = (parsedMidiData: ParsedMidiData | null) => {
  const [tempo, setTempo] = useState<number>(120);
  const [timeSignature, setTimeSignature] = useState<TimeSignature>({
    numerator: 4,
    denominator: 4,
  });

  useEffect(() => {
    if (parsedMidiData) {
      // Analyze tempo
      const tempoEvents = parsedMidiData.tracks.flatMap((track) =>
        track.filter((event: any) => event.type === "setTempo")
      );

      if (tempoEvents.length > 0) {
        // Use the first tempo event (you might want to handle multiple tempo changes)
        const firstTempoEvent = tempoEvents[0];
        const newTempo = 60000000 / firstTempoEvent.microsecondsPerBeat;
        setTempo(Math.round(newTempo));
      }

      // Analyze time signature
      const timeSignatureEvents = parsedMidiData.tracks.flatMap((track) =>
        track.filter((event: any) => event.type === "timeSignature")
      );

      if (timeSignatureEvents.length > 0) {
        // Use the first time signature event
        const firstTimeSignatureEvent = timeSignatureEvents[0];
        setTimeSignature({
          numerator: firstTimeSignatureEvent.numerator,
          denominator: firstTimeSignatureEvent.denominator,
        });
      }
    }
  }, [parsedMidiData]);

  return { tempo, timeSignature };
};
