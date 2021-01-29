import React from 'react';
import { createMachine, assign, send } from 'xstate';
import { useMachine } from '@xstate/react';

const tickerMachine = createMachine({
  id: 'ticker',
  initial: 'alive',
  context: {
    T: 0,
    T1: 6000,
    T2: 2000,
    TICK_INTERVAL: 1000,
  },
  states: {
    alive: {
      initial: 'regular',
      invoke: {
        src: (context) => (callback) => {
          const id = setInterval(() => callback('TICK'), context.TICK_INTERVAL);

          return () => clearInterval(id);
        },
      },
      states: {
        regular: {
          always: [
            {
              target: 'beeping.bothBeep',
              cond: (ctx) => ctx.T === ctx.T1 && ctx.T === ctx.T2,
            },
            {
              target: 'beeping.alarm1Beeps',
              cond: (ctx) => ctx.T === ctx.T1 && ctx.T1 !== ctx.T2,
            },
            {
              target: 'beeping.alarm2Beeps',
              cond: (ctx) => ctx.T === ctx.T2 && ctx.T1 !== ctx.T2,
            },
          ],
        },
        beeping: {
          states: {
            alarm1Beeps: {},
            alarm2Beeps: {},
            bothBeep: {},
          },
          after: {
            10000: 'regular',
          },
        },
      },
      on: {
        REMOVE_BATTERY: {
          target: 'dead',
        },
        TICK: {
          actions: [
            assign({
              T: (context) => context.T + context.TICK_INTERVAL,
            }),
          ],
        },
      },
    },
    dead: {
      on: {
        INSERT_BATTERY: 'alive',
      },
    },
  },
});

export const Ticker = () => {
  const [state, send] = useMachine(tickerMachine, {
    devTools: true,
  });

  console.log(state.context);

  return (
    <div style={{ padding: '32px' }}>
      <pre>{`State:\n${state.toStrings().join(' ')}`}</pre>
      <pre>{`Context:\n${JSON.stringify(state.context)}`}</pre>
      <div>HELLO!</div>
      {/* <button onClick={() => send('A_PRESSED')}>PRESS A</button> */}
      {/* <button onClick={() => send('D_PRESSED')}>PRESS D</button> */}
      {/* <button onClick={() => send('CLEAR_HISTORY')}>CLEAR HISTORY</button> */}
      <button onClick={() => send('INSERT_BATTERY')}>INSERT BATTERY</button>
      <button onClick={() => send('REMOVE_BATTERY')}>REMOVE BATTERY</button>
    </div>
  );
};
