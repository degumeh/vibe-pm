import { KanbanTask, TodoItem, Note } from '@/types'

export const STORAGE_KEYS = {
  KANBAN: 'pm-kanban-tasks',
  TODOS: 'pm-todos',
  NOTES: 'pm-notes',
} as const

export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = window.localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage quota exceeded or other error — silently ignore
  }
}

export const defaultTasks: KanbanTask[] = [
  { id: '1', title: 'Set up repo', description: 'Init git, configure CI', column: 'complete', order: 0, priority: 'high' },
  { id: '2', title: 'Design system tokens', description: 'Colors, spacing, typography', column: 'inprogress', order: 0, priority: 'medium' },
  { id: '3', title: 'Build auth flow', column: 'todo', order: 0, priority: 'critical' },
  { id: '4', title: 'Write unit tests', column: 'todo', order: 1, priority: 'low' },
]

export const defaultTodos: TodoItem[] = [
  { id: '1', text: 'Review PRs', completed: false },
  { id: '2', text: 'Update changelog', completed: true },
]

export const defaultNotes: Note[] = [
  { id: '1', content: 'Welcome\nThis is your scratch pad. Each note saves automatically.', updatedAt: 0 },
]
