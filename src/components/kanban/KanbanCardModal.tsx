'use client'

import { useState, useEffect, useRef } from 'react'
import { KanbanTask, Priority } from '@/types'

interface Props {
  isOpen: boolean
  editTask?: KanbanTask | null
  defaultColumn?: KanbanTask['column']
  onSave: (
    title: string,
    description: string | undefined,
    column: KanbanTask['column'],
    priority: Priority,
    dueDate?: string,
  ) => void
  onClose: () => void
}

const COLUMNS: { value: KanbanTask['column']; label: string; color: string }[] = [
  { value: 'todo',       label: 'To Do',      color: '#4a8fd4' },
  { value: 'inprogress', label: 'In Progress', color: '#d4903a' },
  { value: 'complete',   label: 'Complete',    color: '#3aad6e' },
]

const PRIORITIES: { value: Priority; label: string; color: string; bg: string }[] = [
  { value: 'low',      label: 'Low',      color: '#7e7a75', bg: 'rgba(126,122,117,0.12)' },
  { value: 'medium',   label: 'Medium',   color: '#4a8fd4', bg: 'rgba(74,143,212,0.12)'  },
  { value: 'high',     label: 'High',     color: '#d4903a', bg: 'rgba(212,144,58,0.12)'  },
  { value: 'critical', label: 'Critical', color: '#c0392b', bg: 'rgba(192,57,43,0.12)'   },
]

export function KanbanCardModal({ isOpen, editTask, defaultColumn = 'todo', onSave, onClose }: Props) {
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [column, setColumn]         = useState<KanbanTask['column']>(defaultColumn)
  const [priority, setPriority]     = useState<Priority>('medium')
  const [dueDate, setDueDate]       = useState('')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTitle(editTask?.title ?? '')
      setDescription(editTask?.description ?? '')
      setColumn(editTask?.column ?? defaultColumn)
      setPriority(editTask?.priority ?? 'medium')
      setDueDate(editTask?.dueDate ?? '')
      setTimeout(() => titleRef.current?.focus(), 50)
    }
  }, [isOpen, editTask, defaultColumn])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave(title.trim(), description.trim() || undefined, column, priority, dueDate || undefined)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }

  if (!isOpen) return null

  const activeColumn = COLUMNS.find((c) => c.value === column)!
  const activePriority = PRIORITIES.find((p) => p.value === priority)!

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
    >
      <div
        className="w-full max-w-md mx-4 rounded-sm shadow-2xl overflow-hidden"
        style={{
          background: 'var(--modal)',
          border: '1px solid var(--border-hover)',
          borderTop: `2px solid ${activePriority.color}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2
            className="text-[11px] font-semibold uppercase tracking-[0.15em]"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            {editTask ? 'edit task' : 'new task'}
          </h2>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: 'var(--text-dim)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          {/* Title */}
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full px-3 py-2.5 text-sm rounded-sm focus:outline-none transition-colors"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontFamily: 'var(--font-sans)',
            }}
            onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = activeColumn.color }}
            onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--border)' }}
          />

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-3 py-2.5 text-sm rounded-sm focus:outline-none resize-none transition-colors"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontFamily: 'var(--font-sans)',
            }}
            onFocus={(e) => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = activeColumn.color }}
            onBlur={(e) => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = 'var(--border)' }}
          />

          {/* Priority */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.12em] mb-1.5" style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              Priority
            </p>
            <div className="flex gap-1.5">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className="flex-1 py-1.5 text-[11px] rounded-sm transition-all"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    border: `1px solid ${priority === p.value ? p.color : 'var(--border)'}`,
                    color: priority === p.value ? p.color : 'var(--text-muted)',
                    background: priority === p.value ? p.bg : 'transparent',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Column + Due date row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.12em] mb-1.5" style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                Column
              </p>
              <div className="flex flex-col gap-1">
                {COLUMNS.map((col) => (
                  <button
                    key={col.value}
                    type="button"
                    onClick={() => setColumn(col.value)}
                    className="py-1.5 text-[11px] rounded-sm transition-all text-left px-2"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      border: `1px solid ${column === col.value ? col.color : 'var(--border)'}`,
                      color: column === col.value ? col.color : 'var(--text-muted)',
                      background: column === col.value ? `${col.color}18` : 'transparent',
                    }}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-[0.12em] mb-1.5" style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                Due date
              </p>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2 py-1.5 text-xs rounded-sm focus:outline-none transition-colors"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  color: dueDate ? 'var(--text)' : 'var(--text-dim)',
                  fontFamily: 'var(--font-mono)',
                  colorScheme: 'dark',
                }}
                onFocus={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = activeColumn.color }}
                onBlur={(e) => { (e.currentTarget as HTMLInputElement).style.borderColor = 'var(--border)' }}
              />
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate('')}
                  className="mt-1 text-[10px] transition-colors"
                  style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c0392b' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)' }}
                >
                  clear date
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-sm transition-colors"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)' }}
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-1.5 rounded-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: activePriority.color,
                color: '#0d0d0c',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              {editTask ? 'save' : 'add task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
