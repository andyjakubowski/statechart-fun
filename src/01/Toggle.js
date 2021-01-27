import React from 'react';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

const toggleMachine = createMachine(
  {
    id: 'toggle',
    initial: 'off',
    states: {
      off: {
        entry: ['persistState'],
        on: {
          click: {
            target: 'on',
          },
        },
      },
      on: {
        entry: ['persistState'],
        on: {
          click: {
            target: 'off',
          },
        },
      },
    },
  },
  {
    actions: {
      persistState: (context, event) => {
        console.log('persistState');
      },
    },
  }
);

const persistedState = JSON.parse(
  localStorage.getItem('scratch') || toggleMachine.initialState
);

export const Toggle = () => {
  const [state, send] = useMachine(toggleMachine, {
    devTools: true,
    state: persistedState,
    actions: {
      persistState: (context, event) => {
        console.log('YAS');
      },
    },
  });

  return (
    <div style={{ padding: '32px' }}>
      <p>
        Machine state: <span>{state.value}</span>
      </p>
      <button onClick={() => send('click')}>Toggle</button>
    </div>
  );
};
