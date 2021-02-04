import React from 'react';
import cn from './classNames';

const MetaInfo = function MetaInfo({ state }) {
  return (
    <div>
      <div className={cn('meta')}>
        {`Context:\n${JSON.stringify(state.context)}\n`}
      </div>
      <div className={cn('meta')}>
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

export default MetaInfo;
