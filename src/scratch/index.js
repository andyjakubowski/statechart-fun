import React, { useEffect } from 'react';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

const myMachine = createMachine(
  {
    type: 'parallel',
    states: {
      A: {
        initial: 'B',
        states: {
          B: {
            on: {
              alpha: 'C',
            },
          },
          C: {
            on: {
              beta: {
                target: 'B',
                cond: 'inG',
              },
            },
          },
        },
      },
      D: {
        initial: 'F',
        states: {
          F: {
            on: {
              mu: 'E',
              alpha: 'G',
            },
          },
          G: {
            on: {
              delta: 'F',
            },
          },
          E: {
            on: {
              gamma: 'G',
            },
          },
        },
      },
    },
  },
  {
    guards: {
      inG: (context, event, condMeta) => condMeta.state.matches({ D: 'G' }),
    },
  }
);

// const persistedState = JSON.parse(
//   localStorage.getItem('scratch') || toggleMachine.initialState
// );

export const ScratchApp = () => {
  const [state, send] = useMachine(myMachine, {
    devTools: true,
  });

  return (
    <div style={{ padding: '32px' }}>
      <p>
        Hello! <span>{state.toStrings().join(' ')}</span>
      </p>
    </div>
  );
};
