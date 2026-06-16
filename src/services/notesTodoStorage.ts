import type { NoteItem, TodoItem } from "../types/notesTodo";

const NOTES_KEY = "trackhub.notes";
const TODOS_KEY = "trackhub.todos";

function readItems<T>(key: string): T[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T[]) : [];
  } catch {
    return [];
  }
}

function writeItems<T>(key: string, items: T[]) {
  window.localStorage.setItem(key, JSON.stringify(items));
}

export const notesTodoStorage = {
  getNotes: () => readItems<NoteItem>(NOTES_KEY),
  saveNotes: (notes: NoteItem[]) => writeItems(NOTES_KEY, notes),
  getTodos: () => readItems<TodoItem>(TODOS_KEY),
  saveTodos: (todos: TodoItem[]) => writeItems(TODOS_KEY, todos),
};
