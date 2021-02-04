const BeepLabel = function BeepLabel({ state }) {
  const beepStates = [
    'alive.main.displays.regularAndBeep.beep-test.beep',
    'alive.main.alarms-beep',
    'alive.chime-status.enabled.beep',
  ];

  const isBeeping = beepStates.some(state.matches);

  return isBeeping ? 'BEEP' : '';
};

export default BeepLabel;
