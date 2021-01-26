import { useEffect } from 'react';

export const useKeyDown = function useKeyDown(send) {
  useEffect(() => {
    console.log('useKeyDown - useEffect');
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'a':
          send('A_PRESSED');
          break;
        case 'b':
          send('B_PRESSED');
          break;
        case 'c':
          send('C_PRESSED');
          break;
        case 'd':
          send('D_PRESSED');
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [send]);
};

export const useKeyUp = function useKeyUp(send) {
  useEffect(() => {
    const handleKeyUp = (e) => {
      switch (e.key) {
        case 'a':
          send('A_RELEASED');
          break;
        case 'b':
          send('B_RELEASED');
          break;
        case 'c':
          send('C_RELEASED');
          break;
        case 'd':
          send('D_RELEASED');
          break;
      }
    };
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [send]);
};
