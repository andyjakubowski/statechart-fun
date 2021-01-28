import './Watch.scss';
import React from 'react';
import { createMachine, actions } from 'xstate';
import { useMachine } from '@xstate/react';
import { HStack, VStack, ZStack, Spacer } from '../Stacks/Stacks';
import { useKeyDown, useKeyUp } from './extras';
import cn from 'classnames';

const { log } = actions;
const seconds = function seconds(num) {
  return num * 1000;
};
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
        initial: 'regularAndBeep',
        states: {
          regularAndBeep: {
            type: 'parallel',
            states: {
              regular: {
                initial: 'time',
                states: {
                  time: {
                    id: 'time',
                    on: {
                      A_PRESSED: {
                        target: '#alarm-1',
                      },
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
              'beep-test': {
                initial: '00',
                states: {
                  '00': {
                    on: {
                      B_PRESSED: {
                        target: '10',
                      },
                      D_PRESSED: {
                        target: '01',
                      },
                    },
                  },
                  10: {
                    on: {
                      B_RELEASED: {
                        target: '00',
                      },
                      D_PRESSED: {
                        target: 'beep',
                      },
                    },
                  },
                  '01': {
                    on: {
                      D_RELEASED: {
                        target: '00',
                      },
                      B_PRESSED: {
                        target: 'beep',
                      },
                    },
                  },
                  beep: {
                    on: {
                      B_RELEASED: {
                        target: '01',
                      },
                      D_RELEASED: {
                        target: '10',
                      },
                    },
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
          out: {
            initial: 'alarm-1',
            states: {
              'alarm-1': {
                id: 'alarm-1',
                initial: 'hist',
                states: {
                  hist: {
                    type: 'history',
                    target: 'off',
                  },
                  off: {
                    on: {
                      D_PRESSED: {
                        target: 'on',
                      },
                    },
                  },
                  on: {
                    on: {
                      D_PRESSED: {
                        target: 'off',
                      },
                    },
                  },
                },
                on: {
                  A_PRESSED: {
                    target: 'alarm-2',
                  },
                  C_PRESSED: {
                    target: 'update-1.hr',
                  },
                },
              },
              'update-1': {
                states: {
                  hr: {
                    on: {
                      C_PRESSED: {
                        target: '10min',
                      },
                    },
                  },
                  '10min': {
                    on: {
                      C_PRESSED: {
                        target: '1min',
                      },
                    },
                  },
                  '1min': {
                    on: {
                      C_PRESSED: {
                        target: '#alarm-1',
                      },
                    },
                  },
                },
                on: {
                  B_PRESSED: {
                    target: 'alarm-1',
                  },
                },
              },
              'update-2': {
                states: {
                  hr: {
                    on: {
                      C_PRESSED: {
                        target: '10min',
                      },
                    },
                  },
                  '10min': {
                    on: {
                      C_PRESSED: {
                        target: '1min',
                      },
                    },
                  },
                  '1min': {
                    on: {
                      C_PRESSED: {
                        target: '#alarm-2',
                      },
                    },
                  },
                },
                on: {
                  B_PRESSED: {
                    target: 'alarm-2',
                  },
                },
              },
              'alarm-2': {
                id: 'alarm-2',
                initial: 'hist',
                states: {
                  hist: {
                    type: 'history',
                    target: 'off',
                  },
                  off: {
                    on: {
                      D_PRESSED: {
                        target: 'on',
                      },
                    },
                  },
                  on: {
                    on: {
                      D_PRESSED: {
                        target: 'off',
                      },
                    },
                  },
                },
                on: {
                  A_PRESSED: {
                    target: 'chime.hist',
                  },
                  C_PRESSED: {
                    target: 'update-2.hr',
                  },
                },
              },
              chime: {
                initial: 'off',
                states: {
                  hist: {
                    type: 'history',
                  },
                  off: {
                    on: {
                      D_PRESSED: {
                        target: 'on',
                      },
                    },
                  },
                  on: {
                    on: {
                      D_PRESSED: {
                        target: 'off',
                      },
                    },
                  },
                },
                on: {
                  A_PRESSED: {
                    target: '#stopwatch.hist',
                  },
                },
              },
            },
            after: {
              IDLENESS_DELAY: {
                target: 'regularAndBeep',
              },
            },
          },
          stopwatch: {
            id: 'stopwatch',
            initial: 'zero',
            states: {
              hist: {
                type: 'history',
                history: 'deep',
              },
              zero: {
                id: 'zero',
                on: {
                  B_PRESSED: {
                    target: [
                      'displayAndRun.display.regular',
                      'displayAndRun.run.on',
                    ],
                  },
                },
              },
              displayAndRun: {
                type: 'parallel',
                states: {
                  display: {
                    states: {
                      regular: {
                        on: {
                          D_PRESSED: [
                            {
                              target: 'lap',
                              in: '#watch.alive.stopwatch.displayAndRun.run.on',
                            },
                            {
                              target: '#zero',
                              in:
                                '#watch.alive.stopwatch.displayAndRun.run.off',
                            },
                          ],
                        },
                      },
                      lap: {
                        on: {
                          D_PRESSED: {
                            target: 'regular',
                          },
                        },
                      },
                    },
                  },
                  run: {
                    id: 'run',
                    states: {
                      on: {
                        on: {
                          B_PRESSED: {
                            target: 'off',
                          },
                        },
                      },
                      off: {
                        on: {
                          B_PRESSED: {
                            target: 'on',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            on: {
              A_PRESSED: {
                target: 'regularAndBeep',
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
      IDLENESS_DELAY: seconds(30),
      WAIT_DELAY: seconds(2),
    },
    actions: {},
    guards: {},
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

  const isBeepTestBeeping = state.matches(
    'alive.regularAndBeep.beep-test.beep'
  );
  const watchName = isBeepTestBeeping ? 'BEEP!' : 'Citizen';
  const mainDisplay = (function renderMainDisplay() {
    if (state.matches('dead')) {
      return '';
    } else if (state.matches('alive')) {
      if (
        ['alive.regularAndBeep.regular.time', 'alive.wait'].some(state.matches)
      ) {
        return '10:27 AM';
      } else if (state.matches('alive.regularAndBeep.regular.date')) {
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
            <div style={watchNameStyle}>{watchName}</div>
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
