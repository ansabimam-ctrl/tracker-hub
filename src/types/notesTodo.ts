export type NoteItem = {
  id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
};

export type TodoItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  deadline: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EntryType = "note" | "todo";
