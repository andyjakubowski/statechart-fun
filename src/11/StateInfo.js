import React from 'react';
import cn from './classNames';

const StateInfo = function StateInfo({ state }) {
  return (
    <div className={cn('state-info')}>
      <div>{`Context:\n${JSON.stringify(state.context)}\n`}</div>
      <div>
        Watch State:
        <br />
        {state.toStrings().map((string, i) => (
          <div key={i}>
            {string}
            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StateInfo;
