import React from 'react';
import { createMachine, actions } from 'xstate';
import { useMachine } from '@xstate/react';
const { choose, log, assign, send, pure } = actions;

const tickerMachine = createMachine({
  id: 'ticker',
  initial: 'alive',
  context: {
    T: 0,
    T1: 4000,
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
          on: {
            T_HITS_T1: [
              {
                target: 'beeping.bothBeep',
                cond: (ctx) => {
                  return ctx.T1 === ctx.T2;
                },
              },
              {
                target: 'beeping.alarm1Beeps',
              },
            ],
            T_HITS_T2: {
              target: 'beeping.alarm2Beeps',
              cond: () => true,
            },
          },
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
            pure((ctx) => {
              let actions = [];
              if (ctx.T === ctx.T1) {
                actions.push(send('T_HITS_T1'));
              } else if (ctx.T === ctx.T2) {
                actions.push(send('T_HITS_T2'));
              }
              return actions;
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
