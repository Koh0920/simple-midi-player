import { useState, useCallback } from "react";

export const useAudioContext = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContext) {
      const newContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      setAudioContext(newContext);
      return newContext;
    }
    return audioContext;
  }, [audioContext]);

  const ensureAudioContext = useCallback(() => {
    const context = initAudioContext();
    if (context.state === "suspended") {
      context.resume();
    }
  }, [initAudioContext]);

  return { audioContext, initAudioContext, ensureAudioContext };
};
