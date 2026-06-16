import {
  CalendarDays,
  Check,
  Clock,
  FileText,
  ImagePlus,
  ListChecks,
  Pencil,
  Plus,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import { notesTodoStorage } from "../services/notesTodoStorage";
import type { EntryType, NoteItem, TodoItem } from "../types/notesTodo";

type FormState = {
  id?: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  time: string;
  deadline: string;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  image: "",
  date: "",
  time: "",
  deadline: "",
};

function createId() {
  return `trackhub-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDateTime(date: string, time: string) {
  if (!date && !time) {
    return "No date set";
  }

  return [date, time].filter(Boolean).join(" at ");
}

function getImageData(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function NotesTodoPage() {
  const [notes, setNotes] = useState<NoteItem[]>(() => notesTodoStorage.getNotes());
  const [todos, setTodos] = useState<TodoItem[]>(() => notesTodoStorage.getTodos());
  const [createOpen, setCreateOpen] = useState(false);
  const [formType, setFormType] = useState<EntryType | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    notesTodoStorage.saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    notesTodoStorage.saveTodos(todos);
  }, [todos]);

  const editing = Boolean(form.id);
  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  );

  function openForm(type: EntryType, item?: NoteItem | TodoItem) {
    setCreateOpen(false);
    setFormType(type);

    if (!item) {
      setForm(emptyForm);
      return;
    }

    setForm({
      id: item.id,
      title: item.title,
      description: item.description,
      image: "image" in item ? item.image ?? "" : "",
      date: "date" in item ? item.date : "",
      time: "time" in item ? item.time : "",
      deadline: "deadline" in item ? item.deadline : "",
    });
  }

  function closeForm() {
    setFormType(null);
    setForm(emptyForm);
  }

  async function handleImage(file?: File) {
    if (!file) {
      return;
    }

    const image = await getImageData(file);
    setForm((current) => ({ ...current, image }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = form.title.trim();
    const description = form.description.trim();
    const now = new Date().toISOString();

    if (!title || !description || !formType) {
      return;
    }

    if (formType === "note") {
      if (editing) {
        setNotes((current) =>
          current.map((note) =>
            note.id === form.id
              ? { ...note, title, description, image: form.image, updatedAt: now }
              : note,
          ),
        );
      } else {
        setNotes((current) => [
          {
            id: createId(),
            title,
            description,
            image: form.image,
            createdAt: now,
            updatedAt: now,
          },
          ...current,
        ]);
      }
    }

    if (formType === "todo") {
      if (editing) {
        setTodos((current) =>
          current.map((todo) =>
            todo.id === form.id
              ? {
                  ...todo,
                  title,
                  description,
                  date: form.date,
                  time: form.time,
                  deadline: form.deadline,
                  updatedAt: now,
                }
              : todo,
          ),
        );
      } else {
        setTodos((current) => [
          {
            id: createId(),
            title,
            description,
            date: form.date,
            time: form.time,
            deadline: form.deadline,
            completed: false,
            createdAt: now,
            updatedAt: now,
          },
          ...current,
        ]);
      }
    }

    closeForm();
  }

  function deleteNote(id: string) {
    setNotes((current) => current.filter((note) => note.id !== id));
  }

  function deleteTodo(id: string) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  function completeTodo(id: string) {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id
          ? { ...todo, completed: true, updatedAt: new Date().toISOString() }
          : todo,
      ),
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          eyebrow="Module"
          title="Notes & To-Do"
          description="Keep notes, reminders, and action items connected to the workflow."
        />
        <div className="relative shrink-0">
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
            onClick={() => setCreateOpen((current) => !current)}
            type="button"
          >
            <Plus size={18} />
            Create
          </button>
          {createOpen && (
            <Card className="absolute right-0 top-12 z-20 w-44 overflow-hidden p-2">
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-ink transition hover:bg-brand-50 hover:text-brand-700"
                onClick={() => openForm("note")}
                type="button"
              >
                <FileText size={16} />
                Note
              </button>
              <button
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-ink transition hover:bg-brand-50 hover:text-brand-700"
                onClick={() => openForm("todo")}
                type="button"
              >
                <ListChecks size={16} />
                To-Do
              </button>
            </Card>
          )}
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm font-semibold text-muted">Notes</p>
          <p className="mt-2 text-3xl font-bold text-ink">{notes.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-muted">To-Dos</p>
          <p className="mt-2 text-3xl font-bold text-ink">{todos.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-muted">Completed</p>
          <p className="mt-2 text-3xl font-bold text-ink">{completedCount}</p>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
              <FileText size={19} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">Notes</h2>
              <p className="text-sm font-medium text-muted">Simple cards for quick details</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {notes.length === 0 ? (
              <EmptyState message="No notes added yet" />
            ) : (
              notes.map((note) => (
                <article className="rounded-lg border border-slate-200 p-4" key={note.id}>
                  {note.image && (
                    <img
                      alt=""
                      className="mb-4 h-40 w-full rounded-lg object-cover"
                      src={note.image}
                    />
                  )}
                  <h3 className="text-lg font-bold text-ink">{note.title}</h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">
                    {note.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <ActionButton icon={Pencil} label="Edit" onClick={() => openForm("note", note)} />
                    <ActionButton
                      icon={Trash2}
                      label="Delete"
                      onClick={() => deleteNote(note.id)}
                      tone="danger"
                    />
                  </div>
                </article>
              ))
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-mint-50 text-mint-600">
              <ListChecks size={19} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-ink">To-Dos</h2>
              <p className="text-sm font-medium text-muted">Track simple action items</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {todos.length === 0 ? (
              <EmptyState message="No to-dos added yet" />
            ) : (
              todos.map((todo) => (
                <article
                  className={`rounded-lg border p-4 ${
                    todo.completed ? "border-mint-100 bg-mint-50/50" : "border-slate-200"
                  }`}
                  key={todo.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-ink">{todo.title}</h3>
                        {todo.completed && (
                          <span className="rounded-full bg-mint-500 px-2.5 py-1 text-xs font-bold text-white">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted">
                        {todo.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm font-semibold text-muted sm:grid-cols-3">
                    <MetaItem icon={CalendarDays} label={formatDateTime(todo.date, todo.time)} />
                    <MetaItem icon={Clock} label={todo.deadline || "No deadline"} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {!todo.completed && (
                      <ActionButton
                        icon={Check}
                        label="Complete"
                        onClick={() => completeTodo(todo.id)}
                        tone="success"
                      />
                    )}
                    <ActionButton icon={Pencil} label="Edit" onClick={() => openForm("todo", todo)} />
                    <ActionButton
                      icon={Trash2}
                      label="Delete"
                      onClick={() => deleteTodo(todo.id)}
                      tone="danger"
                    />
                  </div>
                </article>
              ))
            )}
          </div>
        </Card>
      </section>

      {formType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4">
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
                  {editing ? "Edit" : "Create"}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-ink">
                  {editing ? "Update" : "New"} {formType === "note" ? "Note" : "To-Do"}
                </h2>
              </div>
              <button
                aria-label="Close form"
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-muted transition hover:bg-slate-50 hover:text-ink"
                onClick={closeForm}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <Field label="Title">
                <input
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  required
                  value={form.title}
                />
              </Field>

              <Field label={formType === "note" ? "Description / Details" : "Description"}>
                <textarea
                  className="min-h-28 w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm font-medium text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  required
                  value={form.description}
                />
              </Field>

              {formType === "note" ? (
                <Field label="Optional image upload">
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-surface px-4 py-6 text-center transition hover:border-brand-500 hover:bg-brand-50">
                    <ImagePlus className="h-6 w-6 text-brand-600" />
                    <span className="mt-2 text-sm font-bold text-ink">
                      {form.image ? "Replace image" : "Upload image"}
                    </span>
                    <input
                      accept="image/*"
                      className="sr-only"
                      onChange={(event) => void handleImage(event.target.files?.[0])}
                      type="file"
                    />
                  </label>
                  {form.image && (
                    <img alt="" className="mt-3 h-36 w-full rounded-lg object-cover" src={form.image} />
                  )}
                </Field>
              ) : (
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Date">
                    <input
                      className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                      onChange={(event) =>
                        setForm((current) => ({ ...current, date: event.target.value }))
                      }
                      required
                      type="date"
                      value={form.date}
                    />
                  </Field>
                  <Field label="Time">
                    <input
                      className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                      onChange={(event) =>
                        setForm((current) => ({ ...current, time: event.target.value }))
                      }
                      required
                      type="time"
                      value={form.time}
                    />
                  </Field>
                  <Field label="Deadline">
                    <input
                      className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                      onChange={(event) =>
                        setForm((current) => ({ ...current, deadline: event.target.value }))
                      }
                      required
                      type="date"
                      value={form.deadline}
                    />
                  </Field>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  className="h-11 rounded-lg border border-slate-200 px-4 text-sm font-bold text-muted transition hover:bg-slate-50 hover:text-ink"
                  onClick={closeForm}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="h-11 rounded-lg bg-brand-600 px-4 text-sm font-bold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
                  type="submit"
                >
                  {editing ? "Save changes" : `Add ${formType === "note" ? "note" : "to-do"}`}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}

type FieldProps = {
  label: string;
  children: ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ink">{label}</span>
      {children}
    </label>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-surface px-4 py-10 text-center">
      <p className="text-sm font-bold text-muted">{message}</p>
    </div>
  );
}

type ActionButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  tone?: "default" | "danger" | "success";
};

const actionTones: Record<NonNullable<ActionButtonProps["tone"]>, string> = {
  default: "border-slate-200 text-muted hover:bg-slate-50 hover:text-ink",
  danger: "border-rose-100 text-rose-600 hover:bg-rose-50",
  success: "border-mint-100 text-mint-600 hover:bg-mint-50",
};

function ActionButton({
  icon: Icon,
  label,
  onClick,
  tone = "default",
}: ActionButtonProps) {
  return (
    <button
      className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-bold transition ${actionTones[tone]}`}
      onClick={onClick}
      type="button"
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

type MetaItemProps = {
  icon: LucideIcon;
  label: string;
};

function MetaItem({ icon: Icon, label }: MetaItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg bg-surface px-3 py-2">
      <Icon className="h-4 w-4 shrink-0 text-brand-600" />
      <span className="truncate">{label}</span>
    </div>
  );
}
