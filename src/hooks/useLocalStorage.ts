'use client'

import { useState, useEffect } from 'react'
import { getItem, setItem } from '@/lib/localStorage'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [hydrated, setHydrated] = useState(false)

  // After first render, load from localStorage and stay in sync
  useEffect(() => {
    setStoredValue(getItem<T>(key, initialValue))
    setHydrated(true)
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (hydrated) {
      setItem(key, storedValue)
    }
  }, [key, storedValue, hydrated])

  return [storedValue, setStoredValue] as const
}
