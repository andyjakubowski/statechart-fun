import './Watch.scss';
import React from 'react';
import { useMachine, useActor } from '@xstate/react';
import { useKeyDown, useKeyUp } from './extras';
import { watchCaseMachine } from './watchCaseMachine';

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

const makeBemClassNamer = function makeBemClassNamer(blockName) {
  return function bemClassNamer(element, modifier = null) {
    const elPart = !element ? '' : `__${element}`;
    const modPart = !modifier ? '' : `_${modifier}`;

    return `${blockName}${elPart}${modPart}`;
  };
};

const cn = makeBemClassNamer('Watch');

const Watch = function Watch({ watchRef }) {
  const [state, send] = useActor(watchRef);
  useKeyDown(send);
  useKeyUp(send);

  return <MetaInfo state={state} />;
};
