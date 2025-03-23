import * as React from 'react'

export type UseDebounceProps<T> = {
  delay?: number
  onFinish?: (value: T) => void
  onChange?: (value: T) => void
  defaultValue?: T
}

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
  }, [value, delay, onFinish])

  const handleChangeValue = React.useCallback(
    (newValue: T) => {
      setValue(newValue)
      onChange?.(newValue)
    },
    [onChange]
  )

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
