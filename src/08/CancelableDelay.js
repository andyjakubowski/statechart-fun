import React from 'react';
import { createMachine, actions } from 'xstate';
import { useMachine } from '@xstate/react';
const { assign, send, cancel } = actions;

const IDLENESS_DELAY = 3000;
const TICK_INTERVAL = 1000;

const cancelableDelayMachine = createMachine(
  {
    id: 'cancelableDelayMachine',
    initial: 'time',
    context: {
      idlenessCountdown: IDLENESS_DELAY,
      TICK_INTERVAL,
    },
    states: {
      time: {
        on: {
          CLICK: {
            target: 'update',
          },
        },
      },
      update: {
        invoke: {
          id: 'ticker',
          src: 'ticker',
        },
        entry: 'startIdlenessTimer',
        on: {
          CLICK: {
            target: 'time',
          },
          GO_BACK: {
            target: 'time',
            actions: ['resetIdlenessCountdown'],
          },
          CANCEL: {
            actions: [
              'cancelIdlenessTimer',
              'startIdlenessTimer',
              'resetIdlenessCountdown',
              'resetTicker',
            ],
          },
          TICK: {
            actions: 'decrementIdlenessCountdown',
          },
        },
      },
    },
  },
  {
    delays: {
      IDLENESS_DELAY,
    },
    actions: {
      startIdlenessTimer: send('GO_BACK', {
        delay: 'IDLENESS_DELAY',
        id: 'idlenessTimer',
      }),
      cancelIdlenessTimer: cancel('idlenessTimer'),
      decrementIdlenessCountdown: assign({
        idlenessCountdown: (ctx) => ctx.idlenessCountdown - 1000,
      }),
      resetIdlenessCountdown: assign({
        idlenessCountdown: IDLENESS_DELAY,
      }),
      resetTicker: send('RESET_TICKER', { to: 'ticker' }),
    },
    services: {
      ticker: (context) => (callback, onReceive) => {
        const startTimer = function startTimer() {
          return setInterval(() => callback('TICK'), context.TICK_INTERVAL);
        };
        let id = startTimer();

        onReceive((e) => {
          if (e.type === 'RESET_TICKER') {
            clearInterval(id);
            id = startTimer();
            console.log('ticker received RESET_TICKER');
          }
        });

        return () => clearInterval(id);
      },
    },
  }
);

export const CancelableDelay = () => {
  const [state, send] = useMachine(cancelableDelayMachine, {
    devTools: true,
  });

  return (
    <div style={{ padding: '32px' }}>
      <pre>{`State:\n${state.toStrings().join(' ')}`}</pre>
      <pre>{`Context:\n${JSON.stringify(state.context)}`}</pre>
      <button onClick={() => send('CLICK')}>CLICK</button>
      <button onClick={() => send('CANCEL')}>CANCEL TIMER</button>
    </div>
  );
};
