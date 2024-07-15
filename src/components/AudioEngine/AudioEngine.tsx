import React, { useEffect, useRef, useState } from "react";
import { useAudioContext } from "./useAudioContext";

interface AudioEngineProps {
  children?: React.ReactNode;
}

export const AudioEngine: React.FC<AudioEngineProps> = ({ children }) => {
  const { audioContext, initAudioContext } = useAudioContext();
  const [isReady, setIsReady] = useState(false);
  const masterGainNode = useRef<GainNode | null>(null);

  useEffect(() => {
    const setupAudioEngine = async () => {
      if (!audioContext) {
        await initAudioContext();
      }

      if (audioContext && !masterGainNode.current) {
        masterGainNode.current = audioContext.createGain();
        masterGainNode.current.connect(audioContext.destination);
        setIsReady(true);
      }
    };

    setupAudioEngine();
  }, [audioContext, initAudioContext]);

  const connectNode = (node: AudioNode) => {
    if (masterGainNode.current) {
      node.connect(masterGainNode.current);
    }
  };

  const disconnectNode = (node: AudioNode) => {
    if (masterGainNode.current) {
      node.disconnect(masterGainNode.current);
    }
  };

  const setMasterVolume = (volume: number) => {
    if (masterGainNode.current) {
      masterGainNode.current.gain.setValueAtTime(
        volume,
        audioContext?.currentTime || 0
      );
    }
  };

  if (!isReady) {
    return <div>Initializing Audio Engine...</div>;
  }

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              audioContext,
              connectNode,
              disconnectNode,
              setMasterVolume,
            })
          : child
      )}
    </div>
  );
};

export default AudioEngine;
