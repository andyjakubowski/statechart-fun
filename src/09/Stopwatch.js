import React, { useState, useEffect } from 'react';

export const Stopwatch = () => {
  const [ms, setMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      console.log('useEffect, isRunning');
      intervalId = setInterval(() => {
        setMs((ms) => ms + 10);
        console.log('tick');
      }, 10);
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

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
