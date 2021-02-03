import './Watch.scss';
import React from 'react';
import { useMachine, useActor } from '@xstate/react';
import { useKeyDown, useKeyUp } from './extras';
import { watchCaseMachine } from './watchCaseMachine';

const makeBemClassNamer = function makeBemClassNamer(blockName) {
  return function bemClassNamer(element, modifier = null) {
    const elPart = !element ? '' : `__${element}`;
    const modPart = !modifier ? '' : `_${modifier}`;

    return `${blockName}${elPart}${modPart}`;
  };
};

const cn = makeBemClassNamer('Watch');

export const WatchCase = function WatchCase() {
  const [state, send] = useMachine(watchCaseMachine);
  const watchRef = state?.children?.watch;
  const watchEl = watchRef ? <Watch watchRef={watchRef} /> : null;

  return (
    <div>
      {watchEl}
      <button onClick={() => send('INSERT_BATTERY')}>Insert battery</button>
      <button onClick={() => send('REMOVE_BATTERY')}>Remove battery</button>
    </div>
  );
};

const MetaInfo = function MetaInfo({ state }) {
  return (
    <div>
      <div className={cn('meta')}>
        {`Context:\n${JSON.stringify(state.context)}\n`}
      </div>
      <div className={cn('meta')}>
        Watch State:
        <br />
        {state.toStrings().map((string, i) => (
          <div key={i}>
            {string}
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

const BeepLabel = function BeepLabel({ state }) {
  const beepStates = [
    'alive.main.displays.regularAndBeep.beep-test.beep',
    'alive.main.alarms-beep',
    'alive.chime-status.enabled.beep',
  ];

  const isBeeping = beepStates.some(state.matches);

  return isBeeping ? 'BEEP' : '';
};

const AlarmStatus = function AlarmStatus({ state, alarmNumber }) {
  const states = {
    disabled: `alive.alarm-${alarmNumber}-status.disabled`,
    enabled: `alive.alarm-${alarmNumber}-status.enabled`,
    beeping: [
      'alive.main.alarms-beep.both-beep',
      `alive.main.alarms-beep.alarm-${alarmNumber}-beeps`,
    ],
  };

  if (states.beeping.some(state.matches)) {
    return 'BEEP';
  } else if (state.matches(states.enabled)) {
    return `AL${alarmNumber}ON`;
  } else if (state.matches(states.disabled)) {
    return `AL${alarmNumber}OFF`;
  } else {
    return '';
  }
};

const Alarm1Status = function Alarm1Status({ state }) {
  return <AlarmStatus alarmNumber="1" state={state} />;
};

const Alarm2Status = function Alarm2Status({ state }) {
  return <AlarmStatus alarmNumber="2" state={state} />;
};

const ChimeStatus = function ChimeStatus({ state }) {
  const states = {
    disabled: 'alive.chime-status.disabled',
    enabled: 'alive.chime-status.enabled.quiet',
    beeping: 'alive.chime-status.enabled.beep',
  };

  if (state.matches(states.beeping)) {
    return 'BEEP';
  } else if (state.matches(states.enabled)) {
    return `CHIME-ON`;
  } else if (state.matches(states.disabled)) {
    return `CHIME-OFF`;
  } else {
    return '';
  }
};

const StopwatchStatus = function StopwatchStatus({ context }) {
  const { start, elapsedTotal, elapsedSinceStart } = context.stopwatch;
  let status;

  if (!start) {
    status = 'off';
  } else if (elapsedTotal === elapsedSinceStart) {
    status = 'onPaused';
  } else {
    status = 'onRunning';
  }

  switch (status) {
    case 'onPaused':
      return 'StopWPaused';
    case 'onRunning':
      return 'StopWRunning';
    case 'off':
    default:
      return '';
  }
};

const Face = function Face({ state }) {
  return (
    <div>
      <Alarm1Status state={state} />
      <Alarm2Status state={state} />
      <ChimeStatus state={state} />
      <StopwatchStatus context={state.context} />
    </div>
  );
};

const Watch = function Watch({ watchRef }) {
  const [state, send] = useActor(watchRef);
  useKeyDown(send);
  useKeyUp(send);

  return (
    <div>
      <MetaInfo state={state} />
      <BeepLabel state={state} />
      <Face state={state} />
    </div>
  );
};
