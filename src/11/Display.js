import React from 'react';
import cn from './classNames';
import colon from './assets/colon.svg';
import period from './assets/period.svg';
import prime from './assets/prime.svg';
import doublePrime from './assets/double_prime.svg';
import am from './assets/am.svg';
import pm from './assets/pm.svg';

const Colon = function Colon() {
  return <img className={cn('colon-icon')} src={colon} alt="Colon" />;
};

const Primes = function Primes() {
  return (
    <>
      <img className={cn('prime-icon')} src={prime} alt="Prime" />
      <img
        className={cn('double-prime-icon')}
        src={doublePrime}
        alt="Double prime"
      />
    </>
  );
};

const Period = function Period() {
  return <img className={cn('period-icon')} src={period} alt="Period" />;
};

const AM = function AM() {
  return <img className={cn('am-icon')} src={am} alt="AM symbol" />;
};

const PM = function PM() {
  return <img className={cn('pm-icon')} src={pm} alt="PM symbol" />;
};

const Digits1 = function Digits1({ children }) {
  return <div className={cn('digits1')}>{children}</div>;
};

const Digits2 = function Digits2({ children }) {
  return <div className={cn('digits2')}>{children}</div>;
};

const Digits3 = function Digits3({ children }) {
  return <div className={cn('digits3')}>{children}</div>;
};

const LCD = function LCD({ children }) {
  return <div className={cn('display')}>{children}</div>;
};

const TimeDisplay = function TimeDisplay({ state }) {
  const { sec, oneMin, tenMin, hr } = state.context.T;

  return (
    <LCD>
      <Digits1>{hr}</Digits1>
      <Colon />
      <Digits2>
        {tenMin}
        {oneMin}
      </Digits2>
      <Digits3>{sec}</Digits3>
    </LCD>
  );
};

const DateDisplay = function DateDisplay({ state }) {
  const { mon, date, day } = state.context.T;
  const days = ['Mo', 'Tu', 'We', 'Th', 'fr', 'sa', 'su'];

  return (
    <LCD>
      <Digits1>{mon + 1}</Digits1>
      <Period />
      <Digits2>{date + 1}</Digits2>
      <Digits3>{days[day]}</Digits3>
    </LCD>
  );
};

const TimeUpdateDisplay = function TimeUpdateDisplay({ state, updateState }) {
  const { sec, oneMin, tenMin, hr } = state.context.T;
  const classNames = ['sec', '1min', '10min', 'hr'].reduce((result, el) => {
    result[el] = el === updateState ? cn(null, 'blinking') : undefined;
    return result;
  }, {});
  return (
    <LCD>
      <Digits1>
        <span className={classNames.hr}>{hr}</span>
      </Digits1>
      <Colon />
      <Digits2>
        <span className={classNames['10min']}>{tenMin}</span>
        <span className={classNames['1min']}>{oneMin}</span>
      </Digits2>
      <Digits3>
        <span className={classNames['sec']}>{sec}</span>
      </Digits3>
    </LCD>
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
    <LCD>
      <Digits1>
        <span className={classNames.mon}>{mon + 1}</span>
      </Digits1>
      <Period />
      <Digits2>
        <span className={classNames.date}>{date + 1}</span>
      </Digits2>
      <Digits3>
        <span className={classNames.day}>{days[day]}</span>
      </Digits3>
    </LCD>
  );
};
const YearUpdateDisplay = function YearUpdateDisplay({ state, updateState }) {
  const yearString = String(state.context.T.year);
  const firstTwoDigits = yearString.slice(0, 2);
  const lastTwoDigits = yearString.slice(2);
  return (
    <LCD>
      <Digits2>
        <span className={cn(null, 'blinking')}>{firstTwoDigits}</span>
      </Digits2>
      <Digits3>
        <span className={cn(null, 'blinking')}>{lastTwoDigits}</span>
      </Digits3>
    </LCD>
  );
};
const ModeUpdateDisplay = function ModeUpdateDisplay({ state, updateState }) {
  const { mode } = state.context.T;
  const modeDigits = mode === '12h' ? '12' : '24';

  return (
    <LCD>
      <Digits1>
        <span className={cn(null, 'blinking')}>{modeDigits}</span>
      </Digits1>
      <Digits2>h</Digits2>
    </LCD>
  );
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

const AlarmDisplay = function AlarmDisplay({ state, alarmNumber }) {
  const { oneMin, tenMin, hr } = state.context[`T${alarmNumber}`];
  const states = {
    '1min': `alive.main.displays.out.update-${alarmNumber}.1min`,
    '10min': `alive.main.displays.out.update-${alarmNumber}.10min`,
    hr: `alive.main.displays.out.update-${alarmNumber}.hr`,
    on: `alive.main.displays.out.alarm-${alarmNumber}.on`,
    off: `alive.main.displays.out.alarm-${alarmNumber}.off`,
  };
  const currentState = Object.keys(states).find((key) =>
    state.matches(states[key])
  );
  const statusLabel = currentState === 'on' ? 'on' : 'of';
  const classNames = Object.keys(states).reduce((result, el) => {
    result[el] = el === currentState ? cn(null, 'blinking') : undefined;
    return result;
  }, {});

  return (
    <LCD>
      <Digits1>
        <span className={classNames.hr}>{hr}</span>
      </Digits1>
      <Colon />
      <Digits2>
        <span className={classNames['10min']}>{tenMin}</span>
        <span className={classNames['1min']}>{oneMin}</span>
      </Digits2>
      <Digits3>
        <span className={classNames['on'] || classNames['off']}>
          {statusLabel}
        </span>
      </Digits3>
    </LCD>
  );
};

const Alarm1Display = function Alarm1Display({ alarmNumber, ...props }) {
  return <AlarmDisplay alarmNumber={1} {...props} />;
};

const Alarm2Display = function Alarm2Display({ alarmNumber, ...props }) {
  return <AlarmDisplay alarmNumber={2} {...props} />;
};

const ChimeDisplay = function ChimeDisplay({ state }) {
  const states = {
    off: 'alive.main.displays.out.chime.off',
    on: 'alive.main.displays.out.chime.on',
  };
  const currentState = Object.keys(states).find((key) =>
    state.matches(states[key])
  );
  const statusLabel = currentState === 'on' ? 'on' : 'of';

  return (
    <LCD>
      <Colon />
      <Digits2>00</Digits2>
      <Digits3>
        <span className={cn(null, 'blinking')}>{statusLabel}</span>
      </Digits3>
    </LCD>
  );
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
    update1: <Alarm1Display state={state} />,
    alarm2: <Alarm2Display state={state} />,
    update2: <Alarm2Display state={state} />,
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
