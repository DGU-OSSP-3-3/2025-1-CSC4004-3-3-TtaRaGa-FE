import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

const useStopwatch = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const startTimeRef = useRef(null); // 타입 제거
  const appState = useRef(AppState.currentState);

  // AppState 감지하여 복귀 시 시간 보정
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (isActive && startTimeRef.current) {
          const now = Date.now();
          const diff = Math.floor((now - startTimeRef.current) / 1000);
          setSeconds(diff);
        }
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [isActive]);

  // 타이머 동작
  useEffect(() => {
    let interval;

    if (isActive) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now() - seconds * 1000;
      }

      interval = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - startTimeRef.current) / 1000);
        setSeconds(diff);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const start = () => {
    startTimeRef.current = Date.now() - seconds * 1000;
    setIsActive(true);
  };

  const pause = () => {
    setIsActive(false);
  };

  const reset = () => {
    setIsActive(false);
    setSeconds(0);
    startTimeRef.current = null;
  };

  const formatTime = (time) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = time % 60;

    const pad = (n) => (n < 10 ? '0' + n : String(n));
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  return {
    seconds,
    formattedTime: formatTime(seconds),
    isActive,
    start,
    pause,
    reset,
  };
};

export default useStopwatch;
