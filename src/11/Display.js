import React from 'react';
import cn from './classNames';

const TimeDisplay = function TimeDisplay({ state }) {
  const { sec, oneMin, tenMin, hr } = state.context.T;

  return (
    <div className={cn('display')}>
      {hr}:{tenMin}
      {oneMin}
      <span className={cn('display-seconds')}>{sec}</span>
    </div>
  );
};

const DateDisplay = function DateDisplay({ state }) {
  const { mon, date, day, year, mode } = state.context.T;
  const dateString = `${mon} ${date} ${day} ${year}`;

  return <div className={cn('display')}>{dateString}</div>;
};

const UpdateDisplay = function UpdateDisplay({ state }) {
  return 'UpdateDisplay';
};

const Regular = function Regular({ state }) {
  const states = {
    time: 'alive.main.displays.regularAndBeep.regular.time',
    date: 'alive.main.displays.regularAndBeep.regular.date',
    update: 'alive.main.displays.regularAndBeep.regular.update',
  };

  const currentState = Object.keys(states).find((key) =>
    state.matches(states[key])
  );

  const displays = {
    time: <TimeDisplay state={state} />,
    date: <DateDisplay state={state} />,
    update: <UpdateDisplay state={state} />,
  };

  return displays[currentState] || displays.time;
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
    out: <Displays.Out state={state} />,
    stopwatch: <Displays.Stopwatch state={state} />,
  };

  return displays[currentState] || displays.regular;
};

export default Display;
