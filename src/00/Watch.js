import './Watch.scss';
import React from 'react';
import { createMachine, actions } from 'xstate';
import { useMachine, useActor } from '@xstate/react';
import { HStack, VStack } from '../Stacks/Stacks';
import { useKeyDown, useKeyUp } from './extras';

const { assign, send, pure, log } = actions;
const seconds = function seconds(num) {
  return num * 1000;
};
const IDLENESS_DELAY = seconds(120);
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

const getTimeAfterTick = function getTimeAfterTick({
  sec,
  oneMin,
  tenMin,
  hr,
}) {
  const crossedBorderline = function crossedBorderline(time) {
    return time === 0;
  };

  const newSec = incrementSec(sec);
  let newOneMin = crossedBorderline(newSec) ? incrementOneMin(oneMin) : oneMin;
  let newTenMin = crossedBorderline(newOneMin)
    ? incrementOneMin(tenMin)
    : tenMin;
  let newHr = crossedBorderline(newTenMin) ? incrementOneMin(hr) : hr;

  return {
    sec: newSec,
    oneMin: newOneMin,
    tenMin: newTenMin,
    hr: newHr,
  };
};

const areTimesEqual = function areTimesEqual(a, b) {
  return (
    a.sec === b.sec &&
    a.oneMin === b.oneMin &&
    a.tenMin === b.tenMin &&
    a.hr === b.hr
  );
};

const watchMachine = createMachine(
  {
    id: 'watch',
    initial: 'alive',
    context: {
      T: {
        sec: 55,
        oneMin: 5,
        tenMin: 1,
        hr: 11,
      },
      T1: {
        sec: 0,
        oneMin: 6,
        tenMin: 1,
        hr: 11,
      },
      T2: {
        sec: 0,
        oneMin: 6,
        tenMin: 1,
        hr: 11,
      },
      TICK_INTERVAL: 1000,
    },
    states: {
      dead: {
        id: 'dead',
        type: 'final',
      },
      alive: {
        type: 'parallel',
        invoke: {
          src: 'ticker',
        },
        states: {
          'alarm-1-status': {
            initial: 'disabled',
            states: {
              disabled: {
                on: {
                  D_PRESSED: {
                    target: 'enabled',
                    in: '#watch.alive.main.displays.out.alarm-1.off',
                  },
                },
              },
              enabled: {
                on: {
                  D_PRESSED: {
                    target: 'disabled',
                    in: '#watch.alive.main.displays.out.alarm-1.on',
                  },
                },
              },
            },
          },
          'alarm-2-status': {
            initial: 'disabled',
            states: {
              disabled: {
                on: {
                  D_PRESSED: {
                    target: 'enabled',
                    in: '#watch.alive.main.displays.out.alarm-2.off',
                  },
                },
              },
              enabled: {
                on: {
                  D_PRESSED: {
                    target: 'disabled',
                    in: '#watch.alive.main.displays.out.alarm-2.on',
                  },
                },
              },
            },
          },
          'chime-status': {
            initial: 'disabled',
            states: {
              disabled: {
                on: {
                  D_PRESSED: {
                    target: 'enabled.quiet',
                    in: '#watch.alive.main.displays.out.chime.off',
                  },
                },
              },
              enabled: {
                states: {
                  quiet: {
                    on: {
                      T_IS_WHOLE_HOUR: {
                        target: 'beep',
                      },
                    },
                  },
                  beep: {
                    after: {
                      CHIME_BEEP_DURATION: {
                        target: 'quiet',
                      },
                    },
                  },
                },
                on: {
                  D_PRESSED: {
                    target: 'disabled',
                    in: '#watch.alive.main.displays.out.chime.on',
                  },
                },
              },
            },
          },
          light: {
            initial: 'off',
            states: {
              off: {
                on: {
                  B_PRESSED: {
                    target: 'on',
                  },
                },
              },
              on: {
                on: {
                  B_RELEASED: {
                    target: 'off',
                  },
                },
              },
            },
          },
          power: {
            initial: 'ok',
            states: {
              ok: {
                on: {
                  BATTERY_WEAKENS: {
                    target: 'blink',
                  },
                },
              },
              blink: {
                on: {
                  WEAK_BATTERY_DIES: {
                    target: '#dead',
                  },
                },
              },
            },
          },
          main: {
            initial: 'displays',
            states: {
              displays: {
                initial: 'regularAndBeep',
                states: {
                  hist: {
                    type: 'history',
                    history: 'deep',
                  },
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
                                target: '#alarm-1.hist',
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
                            invoke: {
                              id: 'idlenessTimer',
                              src: 'idlenessTimer',
                            },
                            states: {
                              sec: {
                                id: 'sec',
                                on: {
                                  C_PRESSED: {
                                    target: '1min',
                                    actions: ['resetIdlenessTimer'],
                                  },
                                  D_PRESSED: {
                                    actions: [
                                      'incrementSec',
                                      'resetIdlenessTimer',
                                    ],
                                  },
                                },
                              },
                              '1min': {
                                on: {
                                  C_PRESSED: {
                                    target: '10min',
                                    actions: ['resetIdlenessTimer'],
                                  },
                                  D_PRESSED: {
                                    actions: [
                                      'incrementOneMin',
                                      'resetIdlenessTimer',
                                    ],
                                  },
                                },
                              },
                              '10min': {
                                on: {
                                  C_PRESSED: {
                                    target: 'hr',
                                    actions: ['resetIdlenessTimer'],
                                  },
                                  D_PRESSED: {
                                    actions: [
                                      'incrementTenMin',
                                      'resetIdlenessTimer',
                                    ],
                                  },
                                },
                              },
                              hr: {
                                on: {
                                  C_PRESSED: {
                                    target: 'mon',
                                    actions: ['resetIdlenessTimer'],
                                  },
                                  D_PRESSED: {
                                    actions: [
                                      'incrementHr',
                                      'resetIdlenessTimer',
                                    ],
                                  },
                                },
                              },
                              mon: {
                                on: {
                                  C_PRESSED: {
                                    target: 'date',
                                    actions: ['resetIdlenessTimer'],
                                  },
                                },
                              },
                              date: {
                                on: {
                                  C_PRESSED: {
                                    target: 'day',
                                    actions: ['resetIdlenessTimer'],
                                  },
                                },
                              },
                              day: {
                                on: {
                                  C_PRESSED: {
                                    target: 'year',
                                    actions: ['resetIdlenessTimer'],
                                  },
                                },
                              },
                              year: {
                                on: {
                                  C_PRESSED: {
                                    target: 'mode',
                                    actions: ['resetIdlenessTimer'],
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
                              IDLENESS_TIMER_EXPIRED: {
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
                    invoke: {
                      id: 'idlenessTimer',
                      src: 'idlenessTimer',
                    },
                    states: {
                      'alarm-1': {
                        id: 'alarm-1',
                        initial: 'off',
                        states: {
                          hist: {
                            type: 'history',
                          },
                          off: {
                            on: {
                              D_PRESSED: {
                                target: 'on',
                                actions: ['resetIdlenessTimer'],
                              },
                            },
                          },
                          on: {
                            on: {
                              D_PRESSED: {
                                target: 'off',
                                actions: ['resetIdlenessTimer'],
                              },
                            },
                          },
                        },
                        on: {
                          A_PRESSED: {
                            target: 'alarm-2.hist',
                            actions: ['resetIdlenessTimer'],
                          },
                          C_PRESSED: {
                            target: 'update-1.hr',
                            actions: ['resetIdlenessTimer'],
                          },
                        },
                      },
                      'update-1': {
                        states: {
                          hr: {
                            on: {
                              C_PRESSED: {
                                target: '10min',
                                actions: ['resetIdlenessTimer'],
                              },
                            },
                          },
                          '10min': {
                            on: {
                              C_PRESSED: {
                                target: '1min',
                                actions: ['resetIdlenessTimer'],
                              },
                            },
                          },
                          '1min': {
                            on: {
                              C_PRESSED: {
                                target: '#alarm-1',
                                actions: ['resetIdlenessTimer'],
                              },
                            },
                          },
                        },
                        on: {
                          B_PRESSED: {
                            target: 'alarm-1',
                            actions: ['resetIdlenessTimer'],
                          },
                        },
                      },
                      'update-2': {
                        states: {
                          hr: {
                            on: {
                              C_PRESSED: {
                                target: '10min',
                                actions: ['resetIdlenessTimer'],
                              },
                            },
                          },
                          '10min': {
                            on: {
                              C_PRESSED: {
                                target: '1min',
                                actions: ['resetIdlenessTimer'],
                              },
                            },
                          },
                          '1min': {
                            on: {
                              C_PRESSED: {
                                target: '#alarm-2',
                                actions: ['resetIdlenessTimer'],
                              },
                            },
                          },
                        },
                        on: {
                          B_PRESSED: {
                            target: 'alarm-2',
                            actions: ['resetIdlenessTimer'],
                          },
                        },
                      },
                      'alarm-2': {
                        id: 'alarm-2',
                        initial: 'off',
                        states: {
                          hist: {
                            type: 'history',
                          },
                          off: {
                            on: {
                              D_PRESSED: {
                                target: 'on',
                                actions: ['resetIdlenessTimer'],
                              },
                            },
                          },
                          on: {
                            on: {
                              D_PRESSED: {
                                target: 'off',
                                actions: ['resetIdlenessTimer'],
                              },
                            },
                          },
                        },
                        on: {
                          A_PRESSED: {
                            target: 'chime.hist',
                            actions: ['resetIdlenessTimer'],
                          },
                          C_PRESSED: {
                            target: 'update-2.hr',
                            actions: ['resetIdlenessTimer'],
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
                                actions: ['resetIdlenessTimer'],
                              },
                            },
                          },
                          on: {
                            on: {
                              D_PRESSED: {
                                target: 'off',
                                actions: ['resetIdlenessTimer'],
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
                    on: {
                      IDLENESS_TIMER_EXPIRED: {
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
                                      in:
                                        '#watch.alive.main.displays.stopwatch.displayAndRun.run.on',
                                    },
                                    {
                                      target: '#zero',
                                      in:
                                        '#watch.alive.main.displays.stopwatch.displayAndRun.run.off',
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
                  T_HITS_T1: [
                    {
                      target: 'alarms-beep.both-beep',
                      cond: 'P',
                    },
                    {
                      target: 'alarms-beep.alarm-1-beeps',
                      cond: 'P1',
                    },
                  ],
                  T_HITS_T2: {
                    target: 'alarms-beep.alarm-2-beeps',
                    cond: 'P2',
                  },
                },
              },
              'alarms-beep': {
                states: {
                  'alarm-1-beeps': {},
                  'alarm-2-beeps': {},
                  'both-beep': {},
                },
                on: {
                  A_PRESSED: 'displays.hist',
                  B_PRESSED: 'displays.hist',
                  C_PRESSED: 'displays.hist',
                  D_PRESSED: 'displays.hist',
                },
                after: {
                  ALARM_BEEPS_DELAY: 'displays.hist',
                },
              },
            },
          },
        },
        on: {
          TICK: {
            actions: [
              pure((ctx) => {
                let actions = [];

                const newTime = getTimeAfterTick(ctx.T);
                actions.push(
                  assign({
                    T: newTime,
                  })
                );

                if (areTimesEqual(newTime, ctx.T1)) {
                  actions.push(send('T_HITS_T1'));
                }

                if (areTimesEqual(newTime, ctx.T2)) {
                  actions.push(send('T_HITS_T2'));
                }

                return actions;
              }),
            ],
          },
        },
      },
    },
  },
  {
    delays: {
      IDLENESS_DELAY,
      WAIT_DELAY: seconds(2),
      ALARM_BEEPS_DELAY: seconds(30),
      CHIME_BEEP_DURATION: seconds(2),
    },
    actions: {
      resetIdlenessTimer: send('RESET_IDLENESS_TIMER', { to: 'idlenessTimer' }),
      incrementSec: assign({
        T: (ctx) => ({
          ...ctx.T,
          sec: incrementSec(ctx.T.sec),
        }),
      }),
      incrementOneMin: assign({
        T: (ctx) => ({
          ...ctx.T,
          oneMin: incrementOneMin(ctx.T.oneMin),
        }),
      }),
      incrementTenMin: assign({
        T: (ctx) => ({
          ...ctx.T,
          tenMin: incrementTenMin(ctx.T.tenMin),
        }),
      }),
      incrementHr: assign({
        T: (ctx) => ({
          ...ctx.T,
          hr: incrementHr(ctx.T.hr),
        }),
      }),
    },
    guards: {
      P: (ctx, _, condMeta) => {
        return (
          areTimesEqual(ctx.T1, ctx.T2) &&
          condMeta.state.matches('alive.alarm-1-status.enabled') &&
          condMeta.state.matches('alive.alarm-2-status.enabled')
        );
      },
      P1: (ctx, _, condMeta) => {
        return (
          condMeta.state.matches('alive.alarm-1-status.enabled') &&
          (condMeta.state.matches('alive.alarm-2-status.disabled') ||
            !areTimesEqual(ctx.T1, ctx.T2))
        );
      },
      P2: (ctx, _, condMeta) => {
        return (
          condMeta.state.matches('alive.alarm-2-status.enabled') &&
          (condMeta.state.matches('alive.alarm-1-status.disabled') ||
            !areTimesEqual(ctx.T1, ctx.T2))
        );
      },
    },
    services: {
      ticker: (context) => (callback) => {
        const id = setInterval(() => callback('TICK'), context.TICK_INTERVAL);

        return () => clearInterval(id);
      },
      idlenessTimer: () => (callback, onReceive) => {
        const start = function start() {
          return setInterval(
            () => callback('IDLENESS_TIMER_EXPIRED'),
            IDLENESS_DELAY
          );
        };
        let id = start();

        onReceive((e) => {
          if (e.type === 'RESET_IDLENESS_TIMER') {
            clearInterval(id);
            id = start();
          }
        });

        return () => clearInterval(id);
      },
    },
  }
);

const watchCaseMachine = createMachine(
  {
    id: 'WatchCase',
    initial: 'alive',
    states: {
      dead: {
        on: {
          INSERT_BATTERY: 'alive',
        },
      },
      alive: {
        invoke: {
          id: 'watch',
          src: 'watchMachine',
          onDone: {
            target: 'dead',
          },
        },
        on: {
          REMOVE_BATTERY: 'dead',
        },
      },
    },
  },
  {
    services: {
      watchMachine,
    },
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

export const WatchCase = function WatchCase() {
  const [state, send] = useMachine(watchCaseMachine, {
    devTools: true,
  });
  const watchRef = state?.children?.watch;
  const watchEl = watchRef ? <Watch watchRef={watchRef} /> : null;

  return (
    <VStack className="WatchContainer">
      {/* <pre className="Watch__state-label">
        WatchCase State:
        {`\n${state.toStrings().join('\n')}`}
      </pre> */}
      {watchEl}
      <button onClick={() => send('INSERT_BATTERY')}>Insert battery</button>
      <button onClick={() => send('REMOVE_BATTERY')}>Remove battery</button>
    </VStack>
  );
};

const Watch = function Watch({ watchRef }) {
  const [state, send] = useActor(watchRef);
  useKeyDown(send);
  useKeyUp(send);

  const isBeepTestBeeping = state.matches(
    'alive.main.displays.regularAndBeep.beep-test.beep'
  );
  const watchName = isBeepTestBeeping ? 'BEEP!' : 'Citizen';
  const mainDisplay = (function renderMainDisplay() {
    if (state.matches('dead')) {
      return '';
    } else if (state.matches('alive')) {
      if (
        [
          'alive.main.displays.regularAndBeep.regular.time',
          'alive.main.displays.regularAndBeep.wait',
        ].some(state.matches)
      ) {
        return '10:27 AM';
      } else if (
        state.matches('alive.main.displays.regularAndBeep.regular.date')
      ) {
        return 'Wed, Jan 27';
      }
    }
  })();

  return (
    <VStack className="Watch" spacing="8">
      <div className="Watch__state-label">
        {`Context:\n${JSON.stringify(state.context)}\n`}
      </div>
      <div className="Watch__state-label">
        Watch State:
        <br />
        {state.toStrings().map((string, i) => (
          <div key={i}>
            {string}
            <br />
          </div>
        ))}
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
    </VStack>
  );
};
