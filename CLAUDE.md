# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Always use Node 20 — prefix commands with the nvm activation:
```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 20
```

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build (use this to verify changes compile cleanly)
npm run lint     # ESLint
```

There are no tests. Run `npm run build` after every non-trivial change to catch TypeScript and lint errors.

## Git workflow

After completing any meaningful change:

1. Stage relevant files and commit with a clean message — imperative mood, under 72 chars (e.g. `Add priority levels to kanban cards`, `Fix hydration mismatch in useLocalStorage`). No `Co-Authored-By` trailers.
2. Immediately push: `git push`

Do this after each logical unit of work without waiting to be asked.

## Architecture

**All state lives in localStorage — no backend, no API routes.**

The app is a single-page Next.js 14 App Router app (`src/app/page.tsx`) with a two-column layout: a kanban board on the left and a sidebar (todo list + notes) on the right.

### Data flow

```
localStorage ←→ useLocalStorage (SSR-safe hook)
                    ↑
          useKanban / useTodos / useNotes
                    ↑
            KanbanBoard / TodoPanel / NotesPanel
```

`useLocalStorage` (`src/hooks/useLocalStorage.ts`) is the SSR hydration boundary — it always renders with the `initialValue` on the server/first render, then reads localStorage in a `useEffect` and flips a `hydrated` flag before writing back. **Never call `localStorage` directly outside this hook.**

### Key patterns

**Drag and drop**: Single `DndContext` in `KanbanBoard`. Each `KanbanColumn` is both a `useDroppable` target (for empty-column drops) and a `SortableContext`. `handleDragOver` in `useKanban` moves a card to a new column in real time; `handleDragEnd` handles same-column reordering via `arrayMove`. The entire card div carries `{...listeners} {...attributes}` — edit/delete buttons use `e.stopPropagation()` to avoid triggering drags. Activation constraint is `distance: 8` to prevent accidental drags on click.

**`'use client'`** is required on every file that imports from `@dnd-kit/*` or uses `useState`/`useEffect`.

### Types

```typescript
// src/types/index.ts
KanbanTask  — id, title, description?, column, order, priority, dueDate?
TodoItem    — id, text, completed
Note        — id, content, updatedAt
Priority    — 'low' | 'medium' | 'high' | 'critical'
```

localStorage keys are constants in `src/lib/localStorage.ts` (`pm-kanban-tasks`, `pm-todos`, `pm-notes`). Default seed data lives there too.

### Design system

CSS variables are defined in `src/app/globals.css` under `:root` — always use these instead of raw hex values:
`--bg`, `--surface`, `--card`, `--modal`, `--border`, `--border-hover`, `--text`, `--text-muted`, `--text-dim`, `--blue`, `--amber`, `--green`.

Two fonts via `next/font/google`, exposed as CSS variables: `--font-mono` (JetBrains Mono — labels, counts, headers) and `--font-sans` (DM Sans — card titles, body). Use `fontFamily: 'var(--font-mono)'` inline or the `font-mono` / `font-sans` Tailwind classes.
