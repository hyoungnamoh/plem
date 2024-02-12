import { useCallback, useRef } from 'react';

export const useThrottle = () => {
  const isWaiting = useRef(false);

  return useCallback(
    <T extends (...args: any[]) => void>(callback: T, delay: number) =>
      (...args: Parameters<T>) => {
        if (!isWaiting.current) {
          callback(...args);
          isWaiting.current = true;
          setTimeout(() => {
            isWaiting.current = false;
          }, delay);
        }
      },
    []
  );
};
