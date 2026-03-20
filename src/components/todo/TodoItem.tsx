'use client'

import { TodoItem as TodoItemType } from '@/types'

interface Props {
  todo: TodoItemType
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <div className="group flex items-center gap-2.5 py-1.5">
      {/* Terminal-style checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-none transition-colors font-mono text-[10px] leading-none"
        style={{
          border: `1px solid ${todo.completed ? '#4a8fd4' : 'var(--border-hover)'}`,
          background: todo.completed ? 'rgba(74,143,212,0.15)' : 'transparent',
          color: todo.completed ? '#4a8fd4' : 'transparent',
          fontFamily: 'var(--font-mono)',
        }}
        title="Toggle"
      >
        ✓
      </button>
      <span
        className="flex-1 text-sm transition-colors"
        style={{
          color: todo.completed ? 'var(--text-dim)' : 'var(--text)',
          textDecoration: todo.completed ? 'line-through' : 'none',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-all"
        style={{ color: 'var(--text-dim)' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c0392b' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)' }}
        title="Delete"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
