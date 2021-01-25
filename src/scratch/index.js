import React from 'react';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'off',
  states: {
    off: {
      on: {
        click: 'on',
      },
    },
    on: {
      on: {
        click: 'off',
      },
    },
  },
});

export const ScratchApp = () => {
  const [state, send] = useMachine(toggleMachine, { devTools: true });
  return (
    <div>
      <p>
        Machine state: <span>{state.value}</span>
      </p>
      <button onClick={() => send('click')}>Toggle</button>
    </div>
  );
};
