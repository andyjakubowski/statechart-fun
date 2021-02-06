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
  const lightState = state.value.alive.light;
  return (
    <div className={cn('face')}>
      <FaceBackground
        data-state-light={lightState}
        className={cn('face-background')}
      />
      <div className={cn('displays')}>
        <StatusIcons state={state} />
        <Display state={state} />
      </div>
    </div>
  );
};
