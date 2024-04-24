import { useReducer, useCallback, FormEventHandler } from "react";
import { clamp } from "../util/clamp";

export interface IInputBinder<T> {
  value: T;
  onInput: FormEventHandler<HTMLInputElement | HTMLSelectElement>;
}

type useInputHook<T> = [T, IInputBinder<T>, () => void, (value: T) => void];

type Action<T> = { type: "set"; value: T } | { type: "reset" };

const inputReducer = <T>(state: T, action: Action<T>): T => {
  switch (action.type) {
    case "set":
      return action.value;
    case "reset":
      return state; // initialState will be defined in the hook scope
    default:
      throw new Error("Unhandled action type");
  }
};

export const useInput = <T extends string | number>(
  initial: T
): useInputHook<T> => {
  const [value, dispatch] = useReducer(inputReducer<T>, initial);

  const setValue = (value: T) => dispatch({ type: "set", value });

  const bind: IInputBinder<T> = {
    value,
    onInput: (e) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      const newValue =
        target.type === "number"
          ? clamp(
              Number(target.value),
              Number((target as HTMLInputElement).max) || Infinity,
              Number((target as HTMLInputElement).min) || -Infinity
            )
          : target.value;
      setValue(newValue as T);
    },
  };

  const reset = useCallback(() => {
    dispatch({ type: "reset" });
  }, []);

  return [value, bind, reset, setValue];
};
