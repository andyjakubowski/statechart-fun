import './Watch.scss';
import React from 'react';
import { useMachine, useActor } from '@xstate/react';
import { useKeyDown, useKeyUp } from './extras';
import { watchCaseMachine } from './watchCaseMachine';
import { ReactComponent as AlarmStatusEnabled } from './assets/alarm_enabled.svg';
import { ReactComponent as AlarmStatusBeeping } from './assets/alarm_beeping.svg';
import { ReactComponent as ChimeStatusEnabled } from './assets/chime_enabled.svg';
import { ReactComponent as StopwatchStatusOn } from './assets/stopwatch_on.svg';

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

const AlarmStatus = function AlarmStatus({ state, alarmNumber, ...props }) {
  const states = {
    disabled: `alive.alarm-${alarmNumber}-status.disabled`,
    enabled: `alive.alarm-${alarmNumber}-status.enabled`,
    beeping: [
      'alive.main.alarms-beep.both-beep',
      `alive.main.alarms-beep.alarm-${alarmNumber}-beeps`,
    ],
  };

  if (states.beeping.some(state.matches)) {
    return <AlarmStatusBeeping className={props.className} />;
  } else if (state.matches(states.enabled)) {
    return <AlarmStatusEnabled className={props.className} />;
  } else if (state.matches(states.disabled)) {
    return '';
  } else {
    return '';
  }
};

const Alarm1Status = function Alarm1Status({ state, ...props }) {
  return <AlarmStatus alarmNumber="1" state={state} {...props} />;
};

const Alarm2Status = function Alarm2Status({ state, ...props }) {
  return <AlarmStatus alarmNumber="2" state={state} {...props} />;
};

const ChimeStatus = function ChimeStatus({ state, ...props }) {
  const states = {
    disabled: 'alive.chime-status.disabled',
    enabled: 'alive.chime-status.enabled.quiet',
    beeping: 'alive.chime-status.enabled.beep',
  };

  if (state.matches(states.beeping)) {
    return 'BEEP';
  } else if (state.matches(states.enabled)) {
    return <ChimeStatusEnabled className={props.className} />;
  } else if (state.matches(states.disabled)) {
    return `CHIME-OFF`;
  } else {
    return '';
  }
};

const StopwatchStatus = function StopwatchStatus({ context, ...props }) {
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
      return <StopwatchStatusOn className={props.className} />;
    case 'onRunning':
      return <StopwatchStatusOn className={props.className} />;
    case 'off':
    default:
      return '';
  }
};

const Face = function Face({ state }) {
  return (
    <div>
      <Alarm1Status state={state} className={cn('status-icon')} />
      <Alarm2Status state={state} className={cn('status-icon')} />
      <ChimeStatus state={state} className={cn('status-icon')} />
      <StopwatchStatus context={state.context} className={cn('status-icon')} />
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
