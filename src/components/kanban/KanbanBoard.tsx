'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import { KanbanTask, Priority } from '@/types'
import { useKanban } from '@/hooks/useKanban'
import { KanbanColumn } from './KanbanColumn'
import { KanbanCard } from './KanbanCard'
import { KanbanCardModal } from './KanbanCardModal'

const COLUMNS: KanbanTask['column'][] = ['todo', 'inprogress', 'complete']

export function KanbanBoard() {
  const {
    activeTask,
    getColumnTasks,
    addTask,
    updateTask,
    deleteTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useKanban()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null)
  const [defaultColumn, setDefaultColumn] = useState<KanbanTask['column']>('todo')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const openAddModal = (column: KanbanTask['column']) => {
    setEditingTask(null)
    setDefaultColumn(column)
    setModalOpen(true)
  }

  const openEditModal = (task: KanbanTask) => {
    setEditingTask(task)
    setDefaultColumn(task.column)
    setModalOpen(true)
  }

  const handleSave = (
    title: string,
    description: string | undefined,
    column: KanbanTask['column'],
    priority: Priority,
    dueDate?: string,
  ) => {
    if (editingTask) {
      updateTask(editingTask.id, { title, description, priority, dueDate })
    } else {
      addTask(title, description, column, priority, dueDate)
    }
  }

  const onDragStart = (event: DragStartEvent) => {
    handleDragStart(event.active.id as string)
  }

  const onDragOver = (event: DragOverEvent) => {
    handleDragOver(event)
  }

  const onDragEnd = (event: DragEndEvent) => {
    handleDragEnd(event)
  }

  return (
    <div className="flex flex-col min-h-0 h-full gap-2.5">
      {/* Board header */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
          >
            Board
          </span>
          <span style={{ color: 'var(--border)', fontSize: '10px' }}>—</span>
          <span
            className="text-[10px]"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            vibe-pm
          </span>
        </div>
        <button
          onClick={() => openAddModal('todo')}
          className="flex items-center gap-1.5 px-2 py-1 rounded-sm text-[11px] transition-all"
          style={{
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.color = 'var(--text)'
            el.style.borderColor = 'var(--border-hover)'
            el.style.background = 'var(--surface)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.color = 'var(--text-muted)'
            el.style.borderColor = 'var(--border)'
            el.style.background = 'transparent'
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          new task
        </button>
      </div>

      {/* Columns */}
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="grid grid-cols-3 gap-2.5 flex-1 min-h-0">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col}
              column={col}
              tasks={getColumnTasks(col)}
              onEdit={openEditModal}
              onDelete={deleteTask}
              onAddTask={openAddModal}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask ? (
            <div style={{ transform: 'rotate(1.5deg) scale(1.03)', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.6))' }}>
              <div
                className="rounded-sm p-2.5 cursor-grabbing"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border-hover)',
                  borderLeft: `3px solid ${{ todo: '#4a8fd4', inprogress: '#d4903a', complete: '#3aad6e' }[activeTask.column]}`,
                }}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
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
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{activeTask.title}</p>
                    {activeTask.description && (
                      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{activeTask.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <KanbanCardModal
        isOpen={modalOpen}
        editTask={editingTask}
        defaultColumn={defaultColumn}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
