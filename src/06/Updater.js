import React from 'react';
import { createMachine, actions } from 'xstate';
import { useMachine } from '@xstate/react';
const { choose, log, assign, send, pure } = actions;

const incrementSec = function incrementSec(sec) {
  return (sec + 1) % 60;
};
const incrementOneMin = function incrementOneMin(min) {
  return (min + 1) % 10;
};
const incrementTenMin = function incrementTenMin(min) {
  return (min + 1) % 6;
};
const incrementHr = function incrementHr(hr, hourMode24 = true) {
  if (hourMode24) {
    return (hr + 1) % 24;
  }
};

const getTickTimeIncrementActions = function getTickTimeIncrementActions(ctx) {
  let actions = ['incrementSec'];
  let newSec = incrementSec(ctx.sec);
  let newOneMin;
  let newTenMin;

  const crossedBorderline = function crossedBorderline(time) {
    return time === 0;
  };

  if (!crossedBorderline(newSec)) {
    return actions;
  }

  newOneMin = incrementOneMin(ctx.oneMin);
  actions.push('incrementOneMin');

  if (!crossedBorderline(newOneMin)) {
    return actions;
  }

  newTenMin = incrementTenMin(ctx.tenMin);
  actions.push('incrementTenMin');

  if (!crossedBorderline(newTenMin)) {
    return actions;
  }

  actions.push('incrementHr');
  return actions;
};

const updaterMachine = createMachine(
  {
    id: 'updater',
    initial: 'sec',
    context: {
      sec: 50,
      oneMin: 0,
      tenMin: 0,
      hr: 0,
      TICK_INTERVAL: 1000,
    },
    invoke: {
      src: 'ticker',
    },
    on: {
      TICK: {
        actions: [
          log('TICK!'),
          pure((ctx) => getTickTimeIncrementActions(ctx)),
        ],
      },
    },
    states: {
      sec: {
        on: {
          C_PRESSED: {
            target: 'oneMin',
          },
          D_PRESSED: {
            actions: 'incrementSec',
          },
        },
      },
      oneMin: {
        on: {
          C_PRESSED: {
            target: 'tenMin',
          },
          D_PRESSED: {
            actions: 'incrementOneMin',
          },
        },
      },
      tenMin: {
        on: {
          C_PRESSED: {
            target: 'hr',
          },
          D_PRESSED: {
            actions: 'incrementTenMin',
          },
        },
      },
      hr: {
        on: {
          C_PRESSED: {
            target: 'sec',
          },
          D_PRESSED: {
            actions: 'incrementHr',
          },
        },
      },
    },
  },
  {
    services: {
      ticker: (context) => (callback) => {
        const id = setInterval(() => callback('TICK'), context.TICK_INTERVAL);

        return () => clearInterval(id);
      },
    },
    actions: {
      incrementSec: assign({
        sec: (ctx) => incrementSec(ctx.sec),
      }),
      incrementOneMin: assign({
        oneMin: (ctx) => incrementOneMin(ctx.oneMin),
      }),
      incrementTenMin: assign({
        tenMin: (ctx) => incrementTenMin(ctx.tenMin),
      }),
      incrementHr: assign({
        hr: (ctx) => incrementHr(ctx.hr),
      }),
    },
  }
);

export const Updater = () => {
  const [state, send] = useMachine(updaterMachine, {
    devTools: true,
  });

  return (
    <div style={{ padding: '32px' }}>
      <pre>{`State:\n${state.toStrings().join(' ')}`}</pre>
      <pre>{`Context:\n${JSON.stringify(state.context)}`}</pre>
      <div>HELLO!</div>
      {/* <button onClick={() => send('A_PRESSED')}>PRESS A</button> */}
      <button onClick={() => send('C_PRESSED')}>PRESS C</button>
      <button onClick={() => send('D_PRESSED')}>PRESS D</button>
      {/* <button onClick={() => send('CLEAR_HISTORY')}>CLEAR HISTORY</button> */}
      {/* <button onClick={() => send('INSERT_BATTERY')}>INSERT BATTERY</button> */}
      {/* <button onClick={() => send('REMOVE_BATTERY')}>REMOVE BATTERY</button> */}
    </div>
  );
};
