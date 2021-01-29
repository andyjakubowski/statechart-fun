import React from 'react';
import { createMachine, actions } from 'xstate';
import { useMachine } from '@xstate/react';
const { choose, log, assign, send, pure } = actions;

// const states = {
//   0: {
//     on: {
//       D_PRESSED: {
//         target: '1',
//       },
//     },
//   },
//   1: {
//     on: {
//       D_PRESSED: {
//         target: '0',
//       },
//     },
//   },
// };

const generatedStates = (function generateState() {
  let result = {};
  for (let i = 0; i <= 9; i += 1) {
    const transitionedToState = (i + 1) % 10;
    result[i] = {
      on: {
        D_PRESSED: {
          target: String(transitionedToState),
          actions: [
            (ctx, event, actionMeta) => console.log(event, actionMeta),
            assign({
              T1: (ctx, event, actionMeta) => console.log(event, actionMeta),
            }),
          ],
          // actions: ,
        },
      },
    };
  }
  return result;
})();

const updaterMachine = createMachine(
  {
    id: 'updater',
    initial: '0',
    context: {
      T1: {
        '1min': 0,
      },
    },
    states: { ...generatedStates },
  },
  {
    actions: {
      increment1min: assign({
        T1: (ctx, _, actionMeta) => {
          console.log(actionMeta.state?.value);
          return {
            ...ctx.T1,
            '1min': ctx.T1['1min'],
          };
        },
      }),
    },
  }
);

// const updaterMachine = createMachine({
//   id: 'action',
//   initial: 'a',
//   states: {
//     a: {
//       on: {
//         D_PRESSED: {
//           target: 'b',
//           actions: (ctx, _, actionMeta) => console.log(actionMeta),
//         },
//       },
//     },
//     b: {
//       on: {
//         D_PRESSED: {
//           target: 'a',
//           actions: (ctx, _, actionMeta) => console.log(actionMeta),
//         },
//       },
//     },
//   },
// });

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
      <button onClick={() => send('D_PRESSED')}>PRESS D</button>
      {/* <button onClick={() => send('CLEAR_HISTORY')}>CLEAR HISTORY</button> */}
      {/* <button onClick={() => send('INSERT_BATTERY')}>INSERT BATTERY</button> */}
      {/* <button onClick={() => send('REMOVE_BATTERY')}>REMOVE BATTERY</button> */}
    </div>
  );
};
