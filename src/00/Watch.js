import './Watch.scss';
import React from 'react';
import { createMachine, actions } from 'xstate';
import { useMachine } from '@xstate/react';
import { HStack, VStack, ZStack, Spacer } from '../Stacks/Stacks';
import { useKeyDown, useKeyUp } from './extras';
import cn from 'classnames';

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
        initial: 'regular',
        states: {
          regular: {
            initial: 'time',
            states: {
              time: {
                id: 'time',
                on: {
                  C_PRESSED: {
                    target: '#wait',
                  },
                  D_PRESSED: {
                    target: 'date',
                  },
                },
              },
              date: {
                after: {
                  IDLENESS_DELAY: {
                    target: 'time',
                  },
                },
                on: {
                  D_PRESSED: {
                    target: 'time',
                  },
                },
              },
              update: {
                initial: 'sec',
                states: {
                  sec: {
                    id: 'sec',
                    on: {
                      C_PRESSED: {
                        target: '1min',
                      },
                    },
                  },
                  '1min': {
                    on: {
                      C_PRESSED: {
                        target: '10min',
                      },
                    },
                  },
                  '10min': {
                    on: {
                      C_PRESSED: {
                        target: 'hr',
                      },
                    },
                  },
                  hr: {
                    on: {
                      C_PRESSED: {
                        target: 'mon',
                      },
                    },
                  },
                  mon: {
                    on: {
                      C_PRESSED: {
                        target: 'date',
                      },
                    },
                  },
                  date: {
                    on: {
                      C_PRESSED: {
                        target: 'day',
                      },
                    },
                  },
                  day: {
                    on: {
                      C_PRESSED: {
                        target: 'year',
                      },
                    },
                  },
                  year: {
                    on: {
                      C_PRESSED: {
                        target: 'mode',
                      },
                    },
                  },
                  mode: {
                    on: {
                      C_PRESSED: {
                        target: '#time',
                      },
                    },
                  },
                },
                on: {
                  B_PRESSED: {
                    target: 'time',
                  },
                },
                after: {
                  IDLENESS_DELAY: {
                    target: 'time',
                  },
                },
              },
            },
          },
          wait: {
            id: 'wait',
            after: {
              WAIT_DELAY: {
                target: '#sec',
              },
            },
            on: {
              C_RELEASED: {
                target: '#time',
              },
            },
          },
        },
        on: {
          REMOVE_BATTERY: {
            target: 'dead',
          },
        },
      },
    },
  },
  {
    delays: {
      IDLENESS_DELAY: 120000,
      WAIT_DELAY: 2000,
    },
    actions: {},
  }
);

const faceStyle = {
  // width: '200px',
  // height: '170px',
};

const watchNameStyle = {
  padding: '8px 0',
  fontSize: '17px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
};

const displayStyle = {
  width: '180px',
  height: '110px',
  backgroundColor: 'white',
  border: '3px solid black',
};

const smallDisplayAreaStyle = {
  // border: '3px solid black',
};

const smallDisplayAreaDividerStyle = {
  width: '3px',
  height: '24px',
  backgroundColor: 'black',
};

const WatchButton = function WatchButton({ children: name, send }) {
  const nameUpper = name.toUpperCase();
  return (
    <button
      onMouseDown={() => send(`${nameUpper}_PRESSED`)}
      onMouseUp={() => send(`${nameUpper}_RELEASED`)}
      className="WatchButton"
    >
      {name}
    </button>
  );
};

const SmallDisplayAreas = function SmallDisplayAreas() {
  return (
    <HStack style={{ borderBottom: '3px solid black' }}>
      <HStack style={smallDisplayAreaStyle}>{/* a1 */}</HStack>
      <div style={smallDisplayAreaDividerStyle}></div>
      <HStack style={smallDisplayAreaStyle}>{/* a1 */}</HStack>
      <div style={smallDisplayAreaDividerStyle}></div>

      <HStack style={smallDisplayAreaStyle}>{/* a1 */}</HStack>
      <div style={smallDisplayAreaDividerStyle}></div>
      <HStack style={smallDisplayAreaStyle}>{/* a1 */}</HStack>
    </HStack>
  );
};

export const Watch = function Watch() {
  const [state, send] = useMachine(watchMachine, {
    devTools: true,
  });
  useKeyDown(send);
  useKeyUp(send);

  const mainDisplay = (function renderMainDisplay() {
    if (state.matches('dead')) {
      return '';
    } else if (state.matches('alive')) {
      if (['alive.regular.time', 'alive.wait'].some(state.matches)) {
        return '10:27 AM';
      } else if (state.matches('alive.regular.date')) {
        return 'Wed, Jan 27';
      }
    }
  })();

  return (
    <div className="WatchContainer">
      <VStack className="Watch" spacing="8">
        <div className="Watch__state-label">
          State: {state.toStrings().join(' ')}
        </div>
        <HStack>
          <WatchButton send={send}>a</WatchButton>
          <VStack className="Watch__face" padding="16">
            <div style={watchNameStyle}>Citizen</div>
            <VStack style={displayStyle}>{mainDisplay}</VStack>
          </VStack>
          <VStack alignment="leading" spacing="8">
            <WatchButton send={send}>b</WatchButton>
            <WatchButton send={send}>c</WatchButton>
            <WatchButton send={send}>d</WatchButton>
          </VStack>
        </HStack>
        <button onClick={() => send('INSERT_BATTERY')}>Insert battery</button>
        <button onClick={() => send('REMOVE_BATTERY')}>Remove battery</button>
      </VStack>
    </div>
  );
};
