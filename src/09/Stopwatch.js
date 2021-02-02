import React, { useState, useEffect } from 'react';

export const Stopwatch = () => {
  const [startMs, setStartMs] = useState(null);
  const [ms, setMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      console.log('useEffect, isRunning');
      setStartMs(Date.now());
      intervalId = setInterval(() => {
        setMs(Date.now() - startMs);
      }, 25);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, startMs]);

  return (
    <div style={{ padding: '32px' }}>
      HELLO STOPWATCH!
      <div>ms: {ms}</div>
      <div>isRunning: {String(isRunning)}</div>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
};
