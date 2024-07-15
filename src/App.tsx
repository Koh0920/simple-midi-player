import React, { useState, useCallback } from "react";
import { AudioEngine } from "./components/AudioEngine/AudioEngine";
import { MIDIPlayer } from "./components/MIDIPlayer/MIDIPlayer";
import { Piano } from "./components/Instruments/Piano";
import { Transport } from "./components/Transport/Transport";
import { FileUploader } from "./components/FileUploader/FileUploader";
import { useAudioContext } from "./components/AudioEngine/useAudioContext";
import { useNotePlayer } from "./hooks/useNotePlayer";
import { useScheduler } from "./hooks/useScheduler";
// import { createAudioContext } from "./utils/audioUtils";
import "./App.css";

const App: React.FC = () => {
  const [midiFile, setMidiFile] = useState<ArrayBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const { audioContext, initAudioContext, ensureAudioContext } =
    useAudioContext();
  const { playNote } = useNotePlayer(audioContext);
  const { startScheduler, stopScheduler } = useScheduler(
    audioContext,
    playNote
  );

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result instanceof ArrayBuffer) {
        setMidiFile(e.target.result);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleTogglePlayback = useCallback(() => {
    if (!audioContext) {
      initAudioContext();
    }
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      startScheduler([]); // You would pass actual MIDI events here
    } else {
      stopScheduler();
    }
  }, [
    isPlaying,
    audioContext,
    initAudioContext,
    startScheduler,
    stopScheduler,
  ]);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    stopScheduler();
    setCurrentTime(0);
  }, [stopScheduler]);

  const handleRewind = useCallback(() => {
    setCurrentTime(Math.max(0, currentTime - 5));
  }, [currentTime]);

  const handleForward = useCallback(() => {
    setCurrentTime(Math.min(duration, currentTime + 5));
  }, [currentTime, duration]);

  return (
    <div className="App">
      <h1>React Vite DAW</h1>
      <AudioEngine>
        <FileUploader onFileUpload={handleFileUpload} />
        <Transport
          isPlaying={isPlaying}
          onTogglePlayback={handleTogglePlayback}
          onStop={handleStop}
          onRewind={handleRewind}
          onForward={handleForward}
          currentTime={currentTime}
          duration={duration}
          disabled={!midiFile}
        />
        <MIDIPlayer
          audioContext={audioContext}
          isPlaying={isPlaying}
          midiData={midiFile}
          onPlaybackComplete={() => setIsPlaying(false)}
        />
        <Piano
          audioContext={audioContext}
          playNote={playNote}
          ensureAudioContext={ensureAudioContext}
        />
      </AudioEngine>
    </div>
  );
};

export default App;
