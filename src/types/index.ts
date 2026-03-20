export type Priority = 'low' | 'medium' | 'high' | 'critical'

export interface KanbanTask {
  id: string
  title: string
  description?: string
  column: 'todo' | 'inprogress' | 'complete'
  order: number
  priority: Priority
  dueDate?: string  // YYYY-MM-DD
}

export interface TodoItem {
  id: string
  text: string
  completed: boolean
}

export interface Note {
  id: string
  content: string
  updatedAt: number
}
