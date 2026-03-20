'use client'

import { useCallback } from 'react'
import { TodoItem } from '@/types'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS, defaultTodos } from '@/lib/localStorage'

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>(STORAGE_KEYS.TODOS, defaultTodos)

  const addTodo = useCallback(
    (text: string) => {
      if (!text.trim()) return
      setTodos((prev) => [
        ...prev,
        { id: crypto.randomUUID(), text: text.trim(), completed: false },
      ])
    },
    [setTodos]
  )

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      )
    },
    [setTodos]
  )

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((t) => t.id !== id))
    },
    [setTodos]
  )

  return { todos, addTodo, toggleTodo, deleteTodo }
}
