import './Watch.scss';
import React from 'react';
import { useMachine, useActor } from '@xstate/react';
import { useKeyDown, useKeyUp } from './extras';
import { watchCaseMachine } from './watchCaseMachine';
import StatusIcons from './StatusIcons';
import cn from './classNames';
import MetaInfo from './MetaInfo';
import BeepLabel from './BeepLabel';
import Display from './Display';
import { ReactComponent as FaceBackground } from './assets/face.svg';

export const WatchCase = function WatchCase() {
  const [state, send] = useMachine(watchCaseMachine);
  const watchRef = state?.children?.watch;
  const watchEl = watchRef ? <Watch watchRef={watchRef} /> : <DeadWatch />;

  return (
    <div>
      {watchEl}
      <button onClick={() => send('INSERT_BATTERY')}>Insert battery</button>
      <button onClick={() => send('REMOVE_BATTERY')}>Remove battery</button>
    </div>
  );
};

const DeadWatch = function DeadWatch() {
  return <Face />;
};

const Watch = function Watch({ watchRef }) {
  const [state, send] = useActor(watchRef);
  useKeyDown(send);
  useKeyUp(send);

  return (
    <>
      {/* <MetaInfo state={state} /> */}
      <BeepLabel state={state} />
      <div className={cn('face-and-buttons')}>
        <Face state={state} />
        <WatchButton type="a" send={send}>
          a
        </WatchButton>
        <WatchButton type="b" send={send}>
          b
        </WatchButton>
        <WatchButton type="c" send={send}>
          c
        </WatchButton>
        <WatchButton type="d" send={send}>
          d
        </WatchButton>
      </div>
    </>
  );
};

const WatchButton = (function makeWatchButton() {
  const types = ['a', 'b', 'c', 'd'];
  const events = types.reduce((result, type) => {
    result[type] = {
      mouseDown: `${type.toUpperCase()}_PRESSED`,
      mouseUp: `${type.toUpperCase()}_RELEASED`,
    };
    return result;
  }, {});

  return function WatchButton({ type, send, children: label }) {
    return (
      <button
        onMouseDown={() => send(events[type].mouseDown)}
        onMouseUp={() => send(events[type].mouseUp)}
        className={cn(`button-${type}`)}
      >
        {label}
      </button>
    );
  };
})();

const Face = function Face({ state }) {
  const isAlive = !!state && state.matches('alive');
  let lightState;
  let elStatusIcons;
  let elDisplay;
  if (isAlive) {
    lightState = state.value.alive.light;
    elStatusIcons = <StatusIcons state={state} />;
    elDisplay = <Display state={state} />;
  }

  return (
    <div className={cn('face')}>
      <FaceBackground
        data-state-light={lightState}
        className={cn('face-background')}
      />
      <div className={cn('displays')}>
        {elStatusIcons}
        {elDisplay}
      </div>
    </div>
  );
};
