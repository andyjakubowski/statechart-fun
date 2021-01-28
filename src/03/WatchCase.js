import React from 'react';
import { createMachine, forwardTo } from 'xstate';
import { useMachine, useActor } from '@xstate/react';

const watchMachine = createMachine({
  id: 'Watch',
  initial: 'a',
  states: {
    a: {
      on: {
        A_PRESSED: {
          target: 'b',
          actions: () => {
            console.log('A_PRESSED in Watch');
          },
        },
      },
    },
    b: {
      on: {
        A_PRESSED: 'c',
      },
    },
    c: {
      type: 'final',
    },
  },
});

const watchCaseMachine = createMachine(
  {
    id: 'WatchCase',
    initial: 'dead',
    states: {
      dead: {
        on: {
          INSERT_BATTERY: 'alive',
        },
      },
      alive: {
        invoke: {
          id: 'watch',
          src: 'watchMachine',
          onDone: {
            target: 'dead',
          },
          autoForward: true,
        },
        on: {
          REMOVE_BATTERY: 'dead',
        },
      },
    },
  },
  {
    actions: {
      forwardEventToWatch: () => {
        console.log('forwardEventToWatch');
        forwardTo('watch');
      },
    },
    services: {
      watchMachine,
    },
  }
);

const Watch = function Watch({ watchRef }) {
  const [state, send] = useActor(watchRef);

  return (
    <div>
      <h3>Hello, Watch here! 👋</h3>
      <p>
        Watch state: <span>{state.toStrings().join(' ')}</span>
      </p>
    </div>
  );
};

export const WatchCase = () => {
  const [state, send] = useMachine(watchCaseMachine, {
    devTools: true,
  });

  const watchRef = state?.children?.watch;
  const watchEl = watchRef ? <Watch watchRef={watchRef} /> : null;

  return (
    <div style={{ padding: '32px' }}>
      <p>
        WatchCase state: <span>{state.toStrings().join(' ')}</span>
      </p>
      {watchEl}
      <button onClick={() => send('A_PRESSED')}>PRESS A</button>
      {/* <button onClick={() => send('D_PRESSED')}>PRESS D</button> */}
      {/* <button onClick={() => send('CLEAR_HISTORY')}>CLEAR HISTORY</button> */}
      <button onClick={() => send('INSERT_BATTERY')}>INSERT BATTERY</button>
      <button onClick={() => send('REMOVE_BATTERY')}>REMOVE BATTERY</button>
    </div>
  );
};
