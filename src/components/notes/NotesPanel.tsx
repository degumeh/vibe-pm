'use client'

import { useNotes } from '@/hooks/useNotes'

function noteTitle(content: string): string {
  const first = content.split('\n')[0].trim()
  return first || 'Untitled'
}

function notePreview(content: string): string {
  const lines = content.split('\n').filter((l) => l.trim())
  return lines[1] ?? ''
}

export function NotesPanel() {
  const { notes, selectedId, selectedNote, setSelectedId, addNote, updateNote, deleteNote } = useNotes()

  return (
    <div
      className="flex-[3] flex flex-col overflow-hidden min-h-0 rounded-sm"
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
          Notes
        </span>
        <div className="flex items-center gap-2">
          {notes.length > 0 && (
            <span
              className="text-[10px] tabular-nums"
              style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
            >
              {notes.length}
            </span>
          )}
          <button
            onClick={addNote}
            className="transition-colors"
            style={{ color: 'var(--text-dim)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)' }}
            title="New note"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Note list */}
      <div
        className="flex-shrink-0 overflow-y-auto"
        style={{ maxHeight: '38%', borderBottom: '1px solid var(--border)' }}
      >
        {notes.length === 0 ? (
          <p
            className="px-3 py-3 text-xs text-center"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            no notes yet
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelectedId(note.id)}
              className="group flex items-start gap-2 px-3 py-2 cursor-pointer transition-colors"
              style={{
                background: note.id === selectedId ? 'var(--card)' : 'transparent',
                borderBottom: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                if (note.id !== selectedId) {
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'
                }
              }}
              onMouseLeave={(e) => {
                if (note.id !== selectedId) {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent'
                }
              }}
            >
              {/* Active indicator */}
              <span
                className="flex-shrink-0 mt-1 w-1 h-1 rounded-full"
                style={{
                  background: note.id === selectedId ? 'var(--blue)' : 'transparent',
                  minWidth: 4,
                }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-medium truncate"
                  style={{
                    color: note.id === selectedId ? 'var(--text)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {noteTitle(note.content)}
                </p>
                {notePreview(note.content) && (
                  <p
                    className="text-xs truncate mt-0.5"
                    style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-sans)' }}
                  >
                    {notePreview(note.content)}
                  </p>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteNote(note.id) }}
                className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-all"
                style={{ color: 'var(--text-dim)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#c0392b' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-dim)' }}
                title="Delete note"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Editor */}
      {selectedNote ? (
        <textarea
          key={selectedNote.id}
          defaultValue={selectedNote.content}
          onChange={(e) => updateNote(selectedNote.id, e.target.value)}
          placeholder="Start writing..."
          className="flex-1 w-full bg-transparent px-3 py-2.5 text-sm focus:outline-none resize-none notes-textarea"
          style={{
            color: 'var(--text)',
            fontFamily: 'var(--font-sans)',
            lineHeight: '1.6rem',
          }}
          spellCheck={false}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p
            className="text-xs"
            style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}
          >
            select a note or create one
          </p>
        </div>
      )}
    </div>
  )
}
