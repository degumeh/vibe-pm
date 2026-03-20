'use client'

import { useState, useCallback } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { KanbanTask, Priority } from '@/types'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS, defaultTasks } from '@/lib/localStorage'

type Column = KanbanTask['column']

export function useKanban() {
  const [tasks, setTasks] = useLocalStorage<KanbanTask[]>(STORAGE_KEYS.KANBAN, defaultTasks)
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null)

  const getColumnTasks = useCallback(
    (column: Column) =>
      tasks
        .filter((t) => t.column === column)
        .sort((a, b) => a.order - b.order),
    [tasks]
  )

  const addTask = useCallback(
    (title: string, description: string | undefined, column: Column, priority: Priority, dueDate?: string) => {
      const colTasks = tasks.filter((t) => t.column === column)
      const newTask: KanbanTask = {
        id: crypto.randomUUID(),
        title,
        description,
        column,
        order: colTasks.length,
        priority,
        dueDate,
      }
      setTasks((prev) => [...prev, newTask])
    },
    [tasks, setTasks]
  )

  const updateTask = useCallback(
    (id: string, updates: Partial<Pick<KanbanTask, 'title' | 'description' | 'priority' | 'dueDate'>>) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      )
    },
    [setTasks]
  )

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    },
    [setTasks]
  )

  const handleDragStart = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id)
      setActiveTask(task ?? null)
    },
    [tasks]
  )

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event
      if (!over) return

      const activeId = active.id as string
      const overId = over.id as string

      const activeTask = tasks.find((t) => t.id === activeId)
      if (!activeTask) return

      // overId is either a column id or a task id
      const columns: Column[] = ['todo', 'inprogress', 'complete']
      const targetColumn = columns.includes(overId as Column)
        ? (overId as Column)
        : tasks.find((t) => t.id === overId)?.column

      if (!targetColumn || activeTask.column === targetColumn) return

      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, column: targetColumn } : t
        )
      )
    },
    [tasks, setTasks]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveTask(null)
      if (!over) return

      const activeId = active.id as string
      const overId = over.id as string

      if (activeId === overId) return

      const activeTask = tasks.find((t) => t.id === activeId)
      const overTask = tasks.find((t) => t.id === overId)

      if (!activeTask || !overTask) return
      if (activeTask.column !== overTask.column) return

      const colTasks = tasks
        .filter((t) => t.column === activeTask.column)
        .sort((a, b) => a.order - b.order)

      const oldIndex = colTasks.findIndex((t) => t.id === activeId)
      const newIndex = colTasks.findIndex((t) => t.id === overId)
      const reordered = arrayMove(colTasks, oldIndex, newIndex)

      setTasks((prev) => {
        const otherTasks = prev.filter((t) => t.column !== activeTask.column)
        const updatedCol = reordered.map((t, i) => ({ ...t, order: i }))
        return [...otherTasks, ...updatedCol]
      })
    },
    [tasks, setTasks]
  )

  const handleDragCancel = useCallback(() => {
    setActiveTask(null)
  }, [])

  return {
    tasks,
    activeTask,
    getColumnTasks,
    addTask,
    updateTask,
    deleteTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  }
}
