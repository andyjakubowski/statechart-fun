import React from 'react';
import cn from './classNames';
import { ReactComponent as AlarmStatusEnabled } from './assets/alarm_enabled.svg';
import { ReactComponent as AlarmStatusBeeping } from './assets/alarm_beeping.svg';
import { ReactComponent as ChimeStatusEnabled } from './assets/chime_enabled.svg';
import { ReactComponent as StopwatchStatusOn } from './assets/stopwatch_on.svg';

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
    return <AlarmStatusBeeping data-state="beeping" {...props} />;
  } else if (state.matches(states.enabled)) {
    return <AlarmStatusEnabled data-state="enabled" {...props} />;
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
    return <ChimeStatusEnabled data-state="beeping" {...props} />;
  } else if (state.matches(states.enabled)) {
    return <ChimeStatusEnabled data-state="enabled" {...props} />;
  } else if (state.matches(states.disabled)) {
    return `CHIME-OFF`;
  } else {
    return '';
  }
};

const StopwatchStatus = function StopwatchStatus({ context, ...props }) {
  const { start, elapsedTotal, elapsedSinceStart } = context.stopwatch;
  let state;

  if (!start) {
    state = 'off';
  } else if (elapsedTotal === elapsedSinceStart) {
    state = 'onPaused';
  } else {
    state = 'onRunning';
  }

  switch (state) {
    case 'onPaused':
      return <StopwatchStatusOn data-state={state} {...props} />;
    case 'onRunning':
      return <StopwatchStatusOn data-state={state} {...props} />;
    case 'off':
    default:
      return '';
  }
};

const StatusIcons = function StatusIcons({ state }) {
  const className = cn('status-icon');

  return (
    <>
      <Alarm1Status state={state} className={className} />
      <Alarm2Status state={state} className={className} />
      <ChimeStatus state={state} className={className} />
      <StopwatchStatus context={state.context} className={className} />
    </>
  );
};

export default StatusIcons;
