import React from 'react';
import { createMachine, actions } from 'xstate';
import { useMachine } from '@xstate/react';
const { assign } = actions;

const actionMetaMachine = createMachine(
  {
    id: 'actionMetaMachine',
    initial: 'a',
    context: {
      actionMetaInAssign: null,
    },
    states: {
      a: {
        on: {
          CLICK: {
            target: 'b',
            actions: ['logActionMeta', 'assignActionMeta'],
          },
        },
      },
      b: {
        on: {
          CLICK: {
            target: 'a',
            actions: ['logActionMeta', 'assignActionMeta'],
          },
        },
      },
    },
  },
  {
    actions: {
      logActionMeta: (ctx, _, actionMeta) =>
        console.log(
          `actionMeta in an inline action function: ${actionMeta.state.value}`
        ),
      assignActionMeta: assign({
        actionMetaInAssign: (ctx, _, actionMeta) => {
          console.log(`actionMeta inside assign: ${actionMeta.state.value}`);
          return actionMeta.state.value;
        },
      }),
    },
  }
);

export const ActionMeta = () => {
  const [state, send] = useMachine(actionMetaMachine, {
    devTools: true,
  });

  return (
    <div style={{ padding: '32px' }}>
      <pre>{`State:\n${state.toStrings().join(' ')}`}</pre>
      <pre>{`Context:\n${JSON.stringify(state.context)}`}</pre>
      <button onClick={() => send('CLICK')}>CLICK</button>
    </div>
  );
};
