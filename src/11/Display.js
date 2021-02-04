import React from 'react';
import cn from './classNames';

const TimeDisplay = function TimeDisplay({ state }) {
  const { sec, oneMin, tenMin, hr } = state.context.T;

  return (
    <div className={cn('display')}>
      {hr}:{tenMin}
      {oneMin}
      <span className={cn('display-small')}>{sec}</span>
    </div>
  );
};

const DateDisplay = function DateDisplay({ state }) {
  const { mon, date, day } = state.context.T;
  const days = ['Mo', 'Tu', 'We', 'Th', 'fr', 'sa', 'su'];

  return (
    <div className={cn('display')}>
      {`${mon + 1}.${date + 1}`}
      <span className={cn('display-small')}>{days[day]}</span>
    </div>
  );
};

const TimeUpdateDisplay = function TimeUpdateDisplay({ state, updateState }) {
  const { sec, oneMin, tenMin, hr } = state.context.T;
  const classNames = ['sec', '1min', '10min', 'hr'].reduce((result, el) => {
    result[el] = el === updateState ? cn(null, 'blinking') : undefined;
    return result;
  }, {});
  return (
    <div className={cn('display')}>
      <span className={classNames.hr}>{hr}</span>:
      <span className={classNames['10min']}>{tenMin}</span>
      <span className={classNames['1min']}>{oneMin}</span>
      <span className={[classNames['sec'], cn('display-small')].join(' ')}>
        {sec}
      </span>
    </div>
  );
};
const DateUpdateDisplay = function DateUpdateDisplay({ state, updateState }) {
  const { mon, date, day } = state.context.T;
  const days = ['Mo', 'Tu', 'We', 'Th', 'fr', 'sa', 'su'];
  const classNames = ['mon', 'date', 'day'].reduce((result, el) => {
    result[el] = el === updateState ? cn(null, 'blinking') : undefined;
    return result;
  }, {});
  return (
    <div className={cn('display')}>
      <span className={classNames.mon}>{mon + 1}</span>.
      <span className={classNames.date}>{date + 1}</span>
      <span className={[classNames.day, cn('display-small')].join(' ')}>
        {days[day]}
      </span>
    </div>
  );
};
const YearUpdateDisplay = function YearUpdateDisplay({ state, updateState }) {
  return <div>YearUpdateDisplay: {updateState}</div>;
};
const ModeUpdateDisplay = function ModeUpdateDisplay({ state, updateState }) {
  return <div>ModeUpdateDisplay: {updateState}</div>;
};

const UpdateDisplay = function UpdateDisplay({ state }) {
  const states = [
    'sec',
    '1min',
    '10min',
    'hr',
    'mon',
    'date',
    'day',
    'year',
    'mode',
  ].reduce((result, key) => {
    result[key] = `alive.main.displays.regularAndBeep.regular.update.${key}`;
    return result;
  }, {});
  const updateTypes = {
    time: ['sec', '1min', '10min', 'hr'],
    date: ['mon', 'date', 'day'],
    year: ['year'],
    mode: ['mode'],
  };
  const currentState = Object.keys(states).find((key) =>
    state.matches(states[key])
  );
  const currentUpdateType = Object.keys(updateTypes).find((key) =>
    updateTypes[key].includes(currentState)
  );
  const displays = {
    time: <TimeUpdateDisplay state={state} updateState={currentState} />,
    date: <DateUpdateDisplay state={state} updateState={currentState} />,
    year: <YearUpdateDisplay state={state} updateState={currentState} />,
    mode: <ModeUpdateDisplay state={state} updateState={currentState} />,
  };

  return displays[currentUpdateType];
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
