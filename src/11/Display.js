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

const Alarm1Display = function Alarm1Display({ state }) {
  const { oneMin, tenMin, hr } = state.context.T1;

  return (
    <div className={cn('display')}>
      {hr}:{tenMin}
      {oneMin}
    </div>
  );
};

const Alarm2Display = function Alarm2Display({ state }) {
  const { oneMin, tenMin, hr } = state.context.T2;

  return (
    <div className={cn('display')}>
      {hr}:{tenMin}
      {oneMin}
    </div>
  );
};

const Update1Display = function Update1Display({ state }) {
  const { oneMin, tenMin, hr } = state.context.T1;

  return (
    <div className={cn('display')}>
      "update:"
      {hr}:{tenMin}
      {oneMin}
    </div>
  );
};

const Update2Display = function Update2Display({ state }) {
  const { oneMin, tenMin, hr } = state.context.T2;

  return (
    <div className={cn('display')}>
      "update:"
      {hr}:{tenMin}
      {oneMin}
    </div>
  );
};

const ChimeDisplay = function Alarm1Display({ state }) {
  const states = {
    disabled: 'alive.chime-status.disabled',
    enabled: 'alive.chime-status.enabled',
  };

  const currentState = Object.keys(states).find((key) =>
    state.matches(states[key])
  );

  const displays = {
    disabled: 'Chime OFF',
    enabled: 'Chime ON',
  };

  return displays[currentState] || 'Weird chime';
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

const Out = function Out({ state }) {
  const states = {
    alarm1: 'alive.main.displays.out.alarm-1',
    update1: 'alive.main.displays.out.update-1',
    alarm2: 'alive.main.displays.out.alarm-2',
    update2: 'alive.main.displays.out.update-2',
    chime: 'alive.main.displays.out.chime',
  };

  const currentState = Object.keys(states).find((key) =>
    state.matches(states[key])
  );

  const displays = {
    alarm1: <Alarm1Display state={state} />,
    update1: <Update1Display state={state} />,
    alarm2: <Alarm2Display state={state} />,
    update2: <Update2Display state={state} />,
    chime: <ChimeDisplay state={state} />,
  };

  return displays[currentState] || displays.time;
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
