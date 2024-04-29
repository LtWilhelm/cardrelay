import {
  useReducer,
  useCallback,
  FormEventHandler,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";
import { clamp } from "../util/clamp";

export interface IInputBinder<T> {
  value: T;
  onInput: FormEventHandler<HTMLInputElement | HTMLSelectElement>;
}

type useInputHook<T> = [
  T,
  IInputBinder<T>,
  () => void,
  (value: T | ((prevValue: T) => T)) => void
];

type Action<T> =
  | { type: "set"; value: T | ((prevValue: T) => T) }
  | { type: "reset" };
const inputReducer = <T>(state: T, action: Action<T>): T => {
  switch (action.type) {
    case "set":
      return typeof action.value === "function"
        ? (action.value as (prevValue: T) => T)(state)
        : action.value;
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

  const setValue: (value: T | ((prevValue: T) => T)) => void = (value) => {
    dispatch({ type: "set", value });
  };
  const bind: IInputBinder<T> = {
    value,
    onInput: (e) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      const newValue =
        target.type === "number"
          ? clamp(
              Number(target.value),
              Number((target as HTMLInputElement).min) || -Infinity,
              Number((target as HTMLInputElement).max) || Infinity
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

export interface ICheckboxBinder {
  checked: boolean;
  onChange: (e: ChangeEvent) => void;
}

type useCheckboxHook = [
  boolean,
  ICheckboxBinder,
  () => void, // reset function
  (value: boolean | ((prevValue: boolean) => boolean)) => void // setValue function
];

type CheckboxAction =
  | { type: "set"; value: boolean | ((prevValue: boolean) => boolean) }
  | { type: "reset" };

const checkboxReducer = (state: boolean, action: CheckboxAction): boolean => {
  switch (action.type) {
    case "set":
      return typeof action.value === "function"
        ? (action.value as (prevValue: boolean) => boolean)(state)
        : action.value;
    case "reset":
      return state;
    default:
      throw new Error("Unhandled action type");
  }
};

export const useCheckbox = (initial: boolean): useCheckboxHook => {
  const [checked, dispatch] = useReducer(checkboxReducer, initial);

  const setValue: (
    value: boolean | ((prevValue: boolean) => boolean)
  ) => void = (value) => {
    dispatch({ type: "set", value });
  };

  const bind: ICheckboxBinder = {
    checked,
    onChange: (e: ChangeEvent) => {
      const target = e.target as HTMLInputElement;
      setValue(target.checked);
    },
  };

  const reset = useCallback(() => {
    dispatch({ type: "reset" });
  }, []);

  return [checked, bind, reset, setValue];
};
