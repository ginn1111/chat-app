import React from 'react';
import { commonStyle } from '../../pages/Message';

const PseudoChat = () => {
  return (
    <div
      className={`basis-1/2 ${commonStyle} bg-transparent relative mt-[-6px] items-center flex justify-center`}
    >
      <span className="font-[800] text-white drop-shadow-md text-3xl">
        Connect to every one!
      </span>
    </div>
  );
};

export default PseudoChat;