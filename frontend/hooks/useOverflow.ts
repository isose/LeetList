import { useCallback, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const useOverflow = () => {
  const ref = useRef<any>(null);

  const checkOverflow = useDebouncedCallback(() => {
    if (ref.current) {
      setOverflowed(ref.current.offsetWidth < ref.current.scrollWidth);
    }
  }, 500);

  const setRef = useCallback(
    (node: any) => {
      if (ref.current) {
        window.removeEventListener('resize', checkOverflow);
      }

      ref.current = node;

      if (ref.current) {
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
      }
    },
    [checkOverflow],
  );

  const [overflowed, setOverflowed] = useState(false);

  return [overflowed, setRef] as const;
};

export default useOverflow;
