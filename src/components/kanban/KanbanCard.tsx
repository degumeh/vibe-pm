'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { KanbanTask, Priority } from '@/types'

const COLUMN_ACCENT: Record<KanbanTask['column'], string> = {
  todo:       '#4a8fd4',
  inprogress: '#d4903a',
  complete:   '#3aad6e',
}

const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string }> = {
  low:      { label: 'Low',      color: '#7e7a75', bg: 'rgba(126,122,117,0.1)' },
  medium:   { label: 'Med',      color: '#4a8fd4', bg: 'rgba(74,143,212,0.1)'  },
  high:     { label: 'High',     color: '#d4903a', bg: 'rgba(212,144,58,0.1)'  },
  critical: { label: 'Crit',     color: '#c0392b', bg: 'rgba(192,57,43,0.1)'   },
}

function formatDueDate(dateStr: string): { text: string; overdue: boolean } {
  const due = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000)
  const overdue = diff < 0

  if (diff === 0) return { text: 'Due today', overdue: false }
  if (diff === 1) return { text: 'Due tomorrow', overdue: false }
  if (diff === -1) return { text: 'Yesterday', overdue: true }
  if (overdue) return { text: `${Math.abs(diff)}d overdue`, overdue: true }
  if (diff <= 7) return { text: `${diff}d left`, overdue: false }

  return {
    text: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    overdue: false,
  }
}

interface Props {
  task: KanbanTask
  onEdit: (task: KanbanTask) => void
  onDelete: (id: string) => void
  isDragging?: boolean
}

export function KanbanCard({ task, onEdit, onDelete, isDragging }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.35 : 1,
  }

  const accent = COLUMN_ACCENT[task.column]
  const pMeta = PRIORITY_META[task.priority ?? 'medium']
  const due = task.dueDate ? formatDueDate(task.dueDate) : null

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${accent}`,
        cursor: isSortableDragging ? 'grabbing' : 'grab',
      }}
      {...attributes}
      {...listeners}
      className="group rounded-sm p-2.5 transition-colors"
      onMouseEnter={(e) => {
        if (!isSortableDragging) {
          ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-hover)'
          ;(e.currentTarget as HTMLDivElement).style.borderLeftColor = accent
        }
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLDivElement).style.borderLeftColor = accent
      }}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle (visual only) */}
        <div className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-dim)' }}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor">
            <circle cx="2" cy="2" r="1.2" />
            <circle cx="6" cy="2" r="1.2" />
            <circle cx="2" cy="7" r="1.2" />
            <circle cx="6" cy="7" r="1.2" />
            <circle cx="2" cy="12" r="1.2" />
            <circle cx="6" cy="12" r="1.2" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium leading-snug break-words"
            style={{ color: 'var(--text)', fontFamily: 'var(--font-sans)' }}
          >
            {task.title}
          </p>
          {task.description && (
            <p
              className="mt-1 text-xs leading-relaxed break-words"
              style={{ color: 'var(--text-muted)' }}
            >
              {task.description}
            </p>
          )}

          {/* Footer: priority badge + due date */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {/* Priority badge */}
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-sm"
              style={{
                color: pMeta.color,
                background: pMeta.bg,
                fontFamily: 'var(--font-mono)',
                border: `1px solid ${pMeta.color}33`,
              }}
            >
              {pMeta.label}
            </span>

            {/* Due date */}
            {due && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-sm"
                style={{
                  color: due.overdue ? '#c0392b' : 'var(--text-dim)',
                  background: due.overdue ? 'rgba(192,57,43,0.1)' : 'transparent',
                  fontFamily: 'var(--font-mono)',
                  border: `1px solid ${due.overdue ? 'rgba(192,57,43,0.3)' : 'var(--border)'}`,
                }}
              >
                {due.overdue && '⚠ '}{due.text}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(task) }}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--text-dim)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)' }}
            title="Edit"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(task.id) }}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--text-dim)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c0392b' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)' }}
            title="Delete"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
