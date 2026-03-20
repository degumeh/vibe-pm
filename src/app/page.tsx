import { KanbanBoard } from '@/components/kanban/KanbanBoard'
import { TodoPanel } from '@/components/todo/TodoPanel'
import { NotesPanel } from '@/components/notes/NotesPanel'

export default function Home() {
  return (
    <main className="grid grid-cols-[1fr_340px] h-screen gap-3 p-4 overflow-hidden">
      <KanbanBoard />
      <aside className="flex flex-col gap-3 min-h-0">
        <TodoPanel />
        <NotesPanel />
      </aside>
    </main>
  )
}
