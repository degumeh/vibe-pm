'use client'

import { useState, useRef, useCallback } from 'react'
import { Note } from '@/types'
import { useLocalStorage } from './useLocalStorage'
import { STORAGE_KEYS, defaultNotes } from '@/lib/localStorage'

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEYS.NOTES, defaultNotes)
  const [selectedId, setSelectedId] = useState<string | null>(() => defaultNotes[0]?.id ?? null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null

  const addNote = useCallback(() => {
    const note: Note = { id: crypto.randomUUID(), content: '', updatedAt: Date.now() }
    setNotes((prev) => [note, ...prev])
    setSelectedId(note.id)
  }, [setNotes])

  const updateNote = useCallback(
    (id: string, content: string) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, content, updatedAt: Date.now() } : n))
      )
    },
    [setNotes]
  )

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const next = prev.filter((n) => n.id !== id)
        if (selectedId === id) {
          setSelectedId(next[0]?.id ?? null)
        }
        return next
      })
    },
    [setNotes, selectedId]
  )

  // Debounced update for the textarea
  const debouncedUpdate = useCallback(
    (id: string, content: string) => {
      // Update state immediately for responsive typing
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, content, updatedAt: Date.now() } : n))
      )
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        // useLocalStorage syncs on state change so nothing extra needed
      }, 500)
    },
    [setNotes]
  )

  return {
    notes,
    selectedId,
    selectedNote,
    setSelectedId,
    addNote,
    updateNote: debouncedUpdate,
    deleteNote,
  }
}
