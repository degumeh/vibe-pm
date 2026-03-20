'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanTask } from '@/types'
import { KanbanCard } from './KanbanCard'

const COLUMN_META: Record<
  KanbanTask['column'],
  { label: string; ordinal: string; accentColor: string; glowVar: string; dotColor: string }
> = {
  todo: {
    label: 'To Do',
    ordinal: '01',
    accentColor: 'var(--blue)',
    glowVar: 'var(--blue-glow)',
    dotColor: '#4a8fd4',
  },
  inprogress: {
    label: 'In Progress',
    ordinal: '02',
    accentColor: 'var(--amber)',
    glowVar: 'var(--amber-glow)',
    dotColor: '#d4903a',
  },
  complete: {
    label: 'Complete',
    ordinal: '03',
    accentColor: 'var(--green)',
    glowVar: 'var(--green-glow)',
    dotColor: '#3aad6e',
  },
}

interface Props {
  column: KanbanTask['column']
  tasks: KanbanTask[]
  onEdit: (task: KanbanTask) => void
  onDelete: (id: string) => void
  onAddTask: (column: KanbanTask['column']) => void
}

export function KanbanColumn({ column, tasks, onEdit, onDelete, onAddTask }: Props) {
  const meta = COLUMN_META[column]
  const { setNodeRef } = useDroppable({ id: column })

  return (
    <div
      className="flex flex-col min-h-0 overflow-hidden rounded-sm"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderTop: `2px solid ${meta.accentColor}`,
      }}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between px-3 py-3 overflow-hidden"
           style={{ borderBottom: '1px solid var(--border)' }}>
        {/* Ghost ordinal */}
        <span
          className="absolute right-2 top-0 font-mono font-bold leading-none select-none pointer-events-none"
          style={{
            fontSize: '3.5rem',
            color: 'var(--border)',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1,
          }}
        >
          {meta.ordinal}
        </span>

        <div className="relative flex items-center gap-2.5 z-10">
          {/* Accent dot */}
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: meta.accentColor, boxShadow: `0 0 6px ${meta.accentColor}` }}
          />
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.15em]"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            {meta.label}
          </span>
          <span
            className="text-[10px] font-bold tabular-nums"
            style={{ color: meta.accentColor, fontFamily: 'var(--font-mono)' }}
          >
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(column)}
          className="relative z-10 flex items-center justify-center w-5 h-5 rounded transition-all"
          style={{ color: 'var(--text-dim)' }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.color = meta.accentColor
            ;(e.currentTarget as HTMLButtonElement).style.background = meta.glowVar
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)'
            ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
          }}
          title="Add task"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Cards */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 min-h-[80px]"
        >
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}
