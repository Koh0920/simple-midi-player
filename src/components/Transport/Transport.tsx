import React from "react";
import "../../styles/components/Transport.css";

interface TransportProps {
  isPlaying: boolean;
  onTogglePlayback: () => void;
  onStop: () => void;
  onRewind: () => void;
  onForward: () => void;
  currentTime: number;
  duration: number;
  disabled: boolean;
}

export const Transport: React.FC<TransportProps> = ({
  isPlaying,
  onTogglePlayback,
  onStop,
  onRewind,
  onForward,
  currentTime,
  duration,
  disabled,
}) => {
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="transport">
      <button onClick={onRewind} disabled={disabled}>
        ⏪
      </button>
      <button onClick={onTogglePlayback} disabled={disabled}>
        {isPlaying ? "⏸" : "▶"}
      </button>
      <button onClick={onStop} disabled={disabled}>
        ⏹
      </button>
      <button onClick={onForward} disabled={disabled}>
        ⏩
      </button>
      <div className="time-display">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

export default Transport;
