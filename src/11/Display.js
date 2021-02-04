import React from 'react';
import cn from './classNames';

const Regular = function Regular({ state }) {
  const states = {
    time: 'alive.main.displays.regularAndBeep.regular.time',
    date: 'alive.main.displays.regular.date',
    update: 'alive.main.displays.stopwatch',
  };
  const { sec, oneMin, tenMin, hr } = state.context.T;

  return (
    <div className={cn('display')}>
      {hr}:{tenMin}
      {oneMin}
      <span className={cn('display-seconds')}>{sec}</span>
    </div>
  );
};

const Out = function Out() {
  return <div>out</div>;
};

const Stopwatch = function Stopwatch() {
  return <div>stopwatch</div>;
};

const Displays = {
  Regular,
  Out,
  Stopwatch,
};

const Display = function Display({ state }) {
  const states = {
    regular: 'alive.main.displays.regularAndBeep.regular',
    wait: 'alive.main.displays.wait',
    out: 'alive.main.displays.out',
    stopwatch: 'alive.main.displays.stopwatch',
  };

  const currentState = Object.keys(states).find((key) =>
    state.matches(states[key])
  );

  const displays = {
    regular: <Displays.Regular state={state} />,
    wait: <Displays.Regular state={state} />,
    out: <Displays.Out state={state} />,
    stopwatch: <Displays.Stopwatch state={state} />,
  };

  return displays[currentState];
};

export default Display;
