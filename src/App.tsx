import { useState, useEffect, useRef } from "react";
import MidiParser from "midi-parser-js";
import "./App.css";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [midiData, setMidiData] = useState(null);
  const [audioContextStarted, setAudioContextStarted] = useState(false);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const playbackIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, []);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    setAudioContextStarted(true);
  };

  const playNote = (frequency) => {
    if (!audioContextStarted) {
      initAudioContext();
    }

    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      frequency,
      audioContextRef.current.currentTime
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.start();
    gainNode.gain.setValueAtTime(0.5, audioContextRef.current.currentTime);

    oscillatorRef.current = oscillator;
    setCurrentNote(frequency);
  };

  const stopNote = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
      setCurrentNote(null);
    }
  };

  const togglePlayback = () => {
    if (!audioContextStarted) {
      initAudioContext();
    }
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
    setIsPlaying(!isPlaying);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const midiFile = new Uint8Array(e.target.result);
        const midiObject = MidiParser.parse(midiFile);
        setMidiData(midiObject);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const startPlayback = () => {
    if (!midiData) return;

    let noteIndex = 0;
    const track = midiData.track[0].event;

    playbackIntervalRef.current = setInterval(() => {
      if (noteIndex >= track.length) {
        stopPlayback();
        return;
      }

      const event = track[noteIndex];
      if (event.type === 9) {
        // Note on event
        const frequency = midiNoteToFrequency(event.data[0]);
        playNote(frequency);
      } else if (event.type === 8) {
        // Note off event
        stopNote();
      }

      noteIndex++;
    }, 100); // Adjust this value to change playback speed
  };

  const stopPlayback = () => {
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    stopNote();
    setIsPlaying(false);
  };

  const midiNoteToFrequency = (note) => {
    return 440 * Math.pow(2, (note - 69) / 12);
  };

  return (
    <div className="App">
      <h1>React + Vite Simple DAW with MIDI</h1>
      <input type="file" accept=".mid,.midi" onChange={handleFileUpload} />
      <button onClick={togglePlayback} disabled={!midiData}>
        {isPlaying ? "Stop" : "Play MIDI"}
      </button>
      <div>
        <p>
          Current Note: {currentNote ? `${currentNote.toFixed(2)} Hz` : "None"}
        </p>
      </div>
      <div className="piano">
        {[261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88].map(
          (freq, index) => (
            <button
              key={index}
              onMouseDown={() => playNote(freq)}
              onMouseUp={stopNote}
              onMouseLeave={stopNote}
            >
              {["C", "D", "E", "F", "G", "A", "B"][index]}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default App;
