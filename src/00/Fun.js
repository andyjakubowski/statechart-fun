import React from 'react';
import { createMachine, actions } from 'xstate';
import { useMachine } from '@xstate/react';
import { HStack, VStack, ZStack, Spacer } from '../Stacks/Stacks';
import { useKeyDown, useKeyUp } from './extras';

const { log } = actions;
const watchMachine = createMachine(
  {
    id: 'watch',
    initial: 'dead',
    states: {
      dead: {
        on: {
          INSERT_BATTERY: {
            target: 'alive',
          },
        },
      },
      alive: {
        initial: 'time',
        states: {
          time: {
            on: {
              D_PRESSED: {
                target: 'date',
              },
            },
          },
          date: {
            on: {
              D_PRESSED: {
                target: 'time',
              },
            },
          },
        },
        on: {
          REMOVE_BATTERY: {
            target: 'dead',
          },
          A_PRESSED: {
            actions: 'log',
          },
          B_PRESSED: {
            actions: 'log',
          },
          C_PRESSED: {
            actions: 'log',
          },
          D_PRESSED: {
            actions: 'log',
          },
          A_RELEASED: {
            actions: 'log',
          },
          B_RELEASED: {
            actions: 'log',
          },
          C_RELEASED: {
            actions: 'log',
          },
          D_RELEASED: {
            actions: 'log',
          },
        },
      },
    },
  },
  {
    actions: {
      log: log((context, event) => event.type),
    },
  }
);

const buttonStyle = {
  backgroundColor: 'black',
  color: 'white',
  fontWeight: 'bold',
  border: 'none',
  padding: '4px',
};

const faceStyle = {
  backgroundColor: 'white',
  border: '4px solid black',
};

export const Fun = function Fun() {
  const [state, send] = useMachine(watchMachine, {
    devTools: true,
  });
  useKeyDown(send);
  useKeyUp(send);

  return (
    <VStack
      style={{
        width: '400px',
        height: '400px',
        backgroundColor: 'burlywood',
      }}
    >
      <div>{state.toStrings().join(' ')}</div>
      <HStack>
        <button
          onMouseDown={() => send('A_PRESSED')}
          onMouseUp={() => send('A_RELEASED')}
          style={buttonStyle}
        >
          a
        </button>
        <div style={faceStyle}>
          {state.matches('alive') ? '10:27 AM' : 'dead'}
        </div>
        <VStack>
          <button
            onMouseDown={() => send('B_PRESSED')}
            onMouseUp={() => send('B_RELEASED')}
            style={buttonStyle}
          >
            b
          </button>
          <button
            onMouseDown={() => send('C_PRESSED')}
            onMouseUp={() => send('C_RELEASED')}
            style={buttonStyle}
          >
            c
          </button>
          <button
            onMouseDown={() => send('D_PRESSED')}
            onMouseUp={() => send('D_RELEASED')}
            style={buttonStyle}
          >
            d
          </button>
        </VStack>
      </HStack>
      <button onClick={() => send('INSERT_BATTERY')}>Insert battery</button>
      <button onClick={() => send('REMOVE_BATTERY')}>Remove battery</button>
    </VStack>
  );
};
