import React, { useState, useEffect } from 'react';
import { createMachine, actions } from 'xstate';
import { useMachine } from '@xstate/react';

const { assign, send, pure, log } = actions;

const TICK_INTERVAL = 10;

const stopwatchMachine = createMachine(
  {
    id: 'stopwatchMachine',
    initial: 'paused',
    context: {
      ms: 0,
    },
    states: {
      paused: {
        on: {
          TOGGLE: {
            target: 'running',
          },
        },
      },
      running: {
        invoke: {
          src: 'stopwatch',
        },
        on: {
          TOGGLE: {
            target: 'paused',
          },
          TICK: {
            actions: 'tickAction',
          },
        },
      },
    },
  },
  {
    actions: {
      tickAction: assign({
        ms: (ctx) => ctx.ms + TICK_INTERVAL,
      }),
    },
    services: {
      stopwatch: () => (callback) => {
        const id = setInterval(() => callback('TICK'), TICK_INTERVAL);
        return () => clearInterval(id);
      },
    },
  }
);

export const StopwatchMachine = () => {
  const [state, send] = useMachine(stopwatchMachine);
  const { ms } = state.context;

  return (
    <div style={{ padding: '32px' }}>
      HELLO STOPWATCH!
      <div>State: {state.value}</div>
      <div>ms: {ms}</div>
      <button onClick={() => send('TOGGLE')}>
        {state.matches('running') ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};
