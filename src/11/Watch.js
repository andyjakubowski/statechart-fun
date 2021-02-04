import './Watch.scss';
import React from 'react';
import { useMachine, useActor } from '@xstate/react';
import { useKeyDown, useKeyUp } from './extras';
import { watchCaseMachine } from './watchCaseMachine';
import StatusIcons from './StatusIcons';
import cn from './classNames';
import MetaInfo from './MetaInfo';
import BeepLabel from './BeepLabel';

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

const Face = function Face({ state }) {
  return (
    <div>
      <StatusIcons state={state} />
      <Display state={state} />
    </div>
  );
};

const Displays = {
  Regular: function Regular({ state }) {
    const { sec, oneMin, tenMin, hr } = state.context.T;

    return (
      <div className={cn('display')}>
        {hr}:{tenMin}
        {oneMin}
        <span className={cn('display-seconds')}>{sec}</span>
      </div>
    );
  },
  Out: function Out() {
    return <div>out</div>;
  },
  Stopwatch: function Stopwatch() {
    return <div>stopwatch</div>;
  },
};

const Display = function Display({ state }) {
  const states = {
    regular: 'alive.main.displays.regularAndBeep.regular',
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

  return displays[currentState];
};
