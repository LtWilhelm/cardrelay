import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useDebouncedState hook
 * @param initialValue - The initial value of the state, optional.
 * @param delay - Delay in milliseconds for the debounce.
 * @returns A tuple with the current state and a setter function that debounces state updates.
 */
function useDebouncedState<T>(
  initialValue?: T,
  delay: number = 300
): [
  T | undefined,
  (value: T | ((prevValue: T | undefined) => T | undefined)) => void
] {
  const [value, setValue] = useState<T | undefined>(initialValue);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // Function to set the debounced value
  const setDebouncedValue = useCallback(
    (newValue: T | ((prevValue: T | undefined) => T | undefined)) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => {
        setValue((prevValue) => {
          // Determine if newValue is a function and execute it if true, otherwise return newValue directly
          return typeof newValue === "function"
            ? (newValue as (prevValue: T | undefined) => T | undefined)(
                prevValue
              )
            : newValue;
        });
      }, delay);
    },
    [delay]
  );

  // Clear the timer on unmount
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return [value, setDebouncedValue];
}

export default useDebouncedState;
