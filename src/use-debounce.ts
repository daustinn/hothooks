import * as React from 'react'

/**
 * Hook for debouncing a value update. It delays the execution of the provided callback
 * until after a specified time has elapsed since the last value change.
 *
 * @template T - The type of the value being debounced.
 */
export type UseDebounceProps<T> = {
  /**
   * The delay in milliseconds before triggering the `onFinish` callback.
   * @default 500
   */
  delay?: number

  /**
   * Callback executed when the debounce delay finish.
   * @param value - The debounced value.
   */
  onFinish?: (value: T) => void

  /**
   * Callback executed whenever the value changes.
   * @param value - The new value.
   */
  onChange?: (value: T) => void

  /**
   * The initial value of the debounced state.
   */
  defaultValue?: T
}

/**
 * A custom hook that provides debounced state management.
 *
 * @template T - The type of the value being debounced.
 * @param props - Configuration options for the debounce behavior.
 * @returns An object containing the debounced value and methods for updating it.
 */
const useDebounce = <T = string>(props?: UseDebounceProps<T>) => {
  const { delay = 500, onFinish, onChange, defaultValue } = props || {}

  const [value, setValue] = React.useState<T | undefined>()

  const [debouncedValue, setDebouncedValue] = React.useState<T | undefined>(
    defaultValue
  )

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const didMount = React.useRef(false)

  React.useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (value !== undefined) {
      timeoutRef.current = setTimeout(() => {
        onFinish?.(value)
        setDebouncedValue(value)
      }, delay)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [value, delay])

  /**
   * Updates the debounced value and triggers the `onChange` callback.
   *
   * @param newValue - The new value to be set.
   */
  const handleChangeValue = React.useCallback(
    (newValue: T) => {
      setValue(newValue)
      onChange?.(newValue)
    },
    [onChange]
  )

  /**
   * Handles input change events and updates the debounced value accordingly.
   *
   * @param e - The input change event.
   */
  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value as T
      setValue(newValue)
      onChange?.(newValue)
    },
    [onChange]
  )

  return {
    value,
    debouncedValue,
    setValue: handleChangeValue,
    onChange: handleInputChange
  }
}

export { useDebounce }
