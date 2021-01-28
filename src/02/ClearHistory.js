import React from 'react';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

const historyMachine = createMachine(
  {
    id: 'history',
    initial: 'alive',
    states: {
      alive: {
        initial: 'alarm-1',
        states: {
          'alarm-1': {
            initial: 'off',
            states: {
              hist: {
                type: 'history',
              },
              off: {
                on: {
                  D_PRESSED: 'on',
                },
              },
              on: {
                on: {
                  D_PRESSED: 'off',
                },
              },
            },
            on: {
              A_PRESSED: 'alarm-2.hist',
            },
          },
          'alarm-2': {
            initial: 'off',
            states: {
              hist: {
                type: 'history',
              },
              off: {
                on: {
                  D_PRESSED: 'on',
                },
              },
              on: {
                on: {
                  D_PRESSED: 'off',
                },
              },
            },
            on: {
              A_PRESSED: 'alarm-1.hist',
            },
          },
        },
        on: {
          REMOVE_BATTERY: {
            target: 'dead',
            actions: 'clearHistory',
          },
        },
      },
      dead: {
        on: {
          INSERT_BATTERY: {
            target: 'alive.alarm-1.hist',
          },
        },
      },
    },
  },
  {
    actions: {
      clearHistory: (context, event, actionMeta) => {
        actionMeta.state.history = undefined;
        actionMeta.state.historyValue = undefined;
      },
    },
  }
);

export const ClearHistory = () => {
  const [state, send] = useMachine(historyMachine, {
    devTools: true,
  });

  return (
    <div style={{ padding: '32px' }}>
      <p>
        Machine state: <span>{state.toStrings().join(' ')}</span>
      </p>
      <button onClick={() => send('A_PRESSED')}>PRESS A</button>
      <button onClick={() => send('D_PRESSED')}>PRESS D</button>
      {/* <button onClick={() => send('CLEAR_HISTORY')}>CLEAR HISTORY</button> */}
      <button onClick={() => send('INSERT_BATTERY')}>INSERT BATTERY</button>
      <button onClick={() => send('REMOVE_BATTERY')}>REMOVE BATTERY</button>
    </div>
  );
};
