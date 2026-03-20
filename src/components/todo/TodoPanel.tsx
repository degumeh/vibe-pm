'use client'

import { useState, KeyboardEvent } from 'react'
import { useTodos } from '@/hooks/useTodos'
import { TodoItem } from './TodoItem'

export function TodoPanel() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos()
  const [input, setInput] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo(input)
      setInput('')
    }
  }

  const remaining = todos.filter((t) => !t.completed).length
  const done = todos.filter((t) => t.completed).length

  return (
    <div
      className="flex-[2] flex flex-col overflow-hidden min-h-0 rounded-sm"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderTop: '2px solid var(--border-hover)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.15em]"
          style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
        >
          Checklist
        </span>
        {todos.length > 0 && (
          <span
            className="text-[10px] tabular-nums"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            {done}/{todos.length}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {todos.length > 0 && (
        <div className="h-px flex-shrink-0" style={{ background: 'var(--border)' }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${(done / todos.length) * 100}%`,
              background: 'var(--blue)',
            }}
          />
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 py-1 min-h-0">
        {todos.length === 0 ? (
          <p
            className="py-4 text-xs text-center"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            empty — add below
          </p>
        ) : (
          <div style={{ borderBottom: 'none' }}>
            {todos.map((todo) => (
              <div key={todo.id} style={{ borderBottom: '1px solid var(--border)' }} className="last:border-b-0">
                <TodoItem todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="px-3 py-2 flex-shrink-0 flex items-center gap-2"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>›</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="add item, press enter"
          className="flex-1 bg-transparent text-sm focus:outline-none"
          style={{
            color: 'var(--text)',
            fontFamily: 'var(--font-sans)',
          }}
        />
      </div>
    </div>
  )
}
