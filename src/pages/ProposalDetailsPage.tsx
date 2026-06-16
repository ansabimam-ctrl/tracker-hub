import {
  ArrowLeft,
  ArrowRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Plus,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Card } from "../components/Card";
import { PageHeader } from "../components/PageHeader";
import {
  proposalDetailsStorage,
  UNIQUE_ID_COLUMN_ID,
} from "../services/proposalDetailsStorage";
import type {
  ProposalColumn,
  ProposalColumnType,
  ProposalDetailsState,
  ProposalRow,
} from "../types/proposalDetails";

const PAGE_SIZE = 100;
const ACTIONS_WIDTH = 180;

const columnTypeLabels: Record<ProposalColumnType, string> = {
  text: "Free Text",
  date: "Date",
  number: "Number",
  link: "Link",
  dropdown: "Dropdown",
};

function formatId(idNumber: number) {
  return `UP${String(idNumber).padStart(3, "0")}`;
}

function getIdNumber(id: string) {
  return Number(id.replace("UP", "")) || 0;
}

function createColumn(name = "New Column"): ProposalColumn {
  return {
    id: `column-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    type: "text",
    width: 180,
  };
}

export function ProposalDetailsPage() {
  const [state, setState] = useState<ProposalDetailsState>(() =>
    proposalDetailsStorage.getState(),
  );
  const [page, setPage] = useState(1);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    proposalDetailsStorage.saveState(state);
  }, [state]);

  const sortedRows = useMemo(
    () => [...state.rows].sort((a, b) => getIdNumber(b.id) - getIdNumber(a.id)),
    [state.rows],
  );
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleRows = sortedRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const activeColumn = state.columns.find((column) => column.id === activeColumnId);

  function updateState(updater: (current: ProposalDetailsState) => ProposalDetailsState) {
    setState((current) => updater(current));
  }

  function addRow() {
    updateState((current) => {
      const id = formatId(current.nextIdNumber);
      const now = new Date().toISOString();
      const cells = Object.fromEntries(current.columns.map((column) => [column.id, ""]));

      return {
        ...current,
        nextIdNumber: current.nextIdNumber + 1,
        rows: [{ id, cells, createdAt: now, updatedAt: now }, ...current.rows],
      };
    });
    setPage(1);
  }

  function duplicateRow(row: ProposalRow) {
    updateState((current) => {
      const id = formatId(current.nextIdNumber);
      const now = new Date().toISOString();
      return {
        ...current,
        nextIdNumber: current.nextIdNumber + 1,
        rows: [
          { id, cells: { ...row.cells }, createdAt: now, updatedAt: now },
          ...current.rows,
        ],
      };
    });
    setPage(1);
  }

  function deleteRow(id: string) {
    updateState((current) => ({
      ...current,
      rows: current.rows.filter((row) => row.id !== id),
    }));
  }

  function addColumn() {
    const column = createColumn();
    updateState((current) => ({
      ...current,
      columns: [...current.columns, column],
      rows: current.rows.map((row) => ({
        ...row,
        cells: { ...row.cells, [column.id]: "" },
      })),
    }));
    setActiveColumnId(column.id);
  }

  function updateCell(rowId: string, columnId: string, value: string) {
    if (columnId === UNIQUE_ID_COLUMN_ID) {
      return;
    }

    updateState((current) => ({
      ...current,
      rows: current.rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              cells: { ...row.cells, [columnId]: value },
              updatedAt: new Date().toISOString(),
            }
          : row,
      ),
    }));
  }

  function updateColumn(columnId: string, changes: Partial<ProposalColumn>) {
    if (columnId === UNIQUE_ID_COLUMN_ID) {
      return;
    }

    updateState((current) => ({
      ...current,
      columns: current.columns.map((column) =>
        column.id === columnId ? { ...column, ...changes } : column,
      ),
    }));
  }

  function deleteColumn(columnId: string) {
    if (columnId === UNIQUE_ID_COLUMN_ID) {
      return;
    }

    updateState((current) => ({
      ...current,
      columns: current.columns.filter((column) => column.id !== columnId),
      rows: current.rows.map((row) => {
        const { [columnId]: _removed, ...cells } = row.cells;
        return { ...row, cells };
      }),
    }));
    setActiveColumnId(null);
  }

  function moveColumn(columnId: string, direction: "left" | "right") {
    if (columnId === UNIQUE_ID_COLUMN_ID) {
      return;
    }

    updateState((current) => {
      const columns = [...current.columns];
      const index = columns.findIndex((column) => column.id === columnId);
      const nextIndex = direction === "left" ? index - 1 : index + 1;

      if (index <= 0 || nextIndex <= 0 || nextIndex >= columns.length) {
        return current;
      }

      [columns[index], columns[nextIndex]] = [columns[nextIndex], columns[index]];
      return { ...current, columns };
    });
  }

  function addDropdownOption(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeColumn || activeColumn.type !== "dropdown" || !newOption.trim()) {
      return;
    }

    updateColumn(activeColumn.id, {
      options: [...(activeColumn.options ?? []), newOption.trim()],
    });
    setNewOption("");
  }

  function updateDropdownOption(index: number, value: string) {
    if (!activeColumn || activeColumn.type !== "dropdown") {
      return;
    }

    const options = [...(activeColumn.options ?? [])];
    options[index] = value;
    updateColumn(activeColumn.id, { options });
  }

  function deleteDropdownOption(index: number) {
    if (!activeColumn || activeColumn.type !== "dropdown") {
      return;
    }

    updateColumn(activeColumn.id, {
      options: (activeColumn.options ?? []).filter((_, optionIndex) => optionIndex !== index),
    });
  }

  return (
    <>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <PageHeader
          eyebrow="Module"
          title="Proposal Details"
          description="Manage proposal and lead records in a simple editable grid."
        />
        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
            onClick={addRow}
            type="button"
          >
            <Plus size={18} />
            Add Row
          </button>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-ink shadow-sm transition hover:bg-brand-50 hover:text-brand-700"
            onClick={addColumn}
            type="button"
          >
            <Plus size={18} />
            Add Column
          </button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-ink">{state.rows.length} records</p>
            <p className="mt-1 text-sm font-medium text-muted">
              Showing up to {PAGE_SIZE} rows per page, sorted by newest Unique ID.
            </p>
          </div>
          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-surface">
                {state.columns.map((column, index) => (
                  <th
                    className={`sticky top-0 border-b border-r border-slate-200 px-3 py-3 text-xs font-bold uppercase tracking-[0.08em] text-muted ${
                      column.id === UNIQUE_ID_COLUMN_ID ? "left-0 z-20 bg-surface" : "z-10"
                    }`}
                    key={column.id}
                    style={{ width: column.width, minWidth: column.width }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{column.name}</span>
                      {column.id !== UNIQUE_ID_COLUMN_ID && (
                        <button
                          aria-label={`Edit ${column.name} column`}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted transition hover:bg-white hover:text-brand-700"
                          onClick={() => setActiveColumnId(column.id)}
                          type="button"
                        >
                          <Settings2 size={15} />
                        </button>
                      )}
                    </div>
                    <span className="mt-1 block text-[11px] normal-case tracking-normal text-slate-400">
                      {column.id === UNIQUE_ID_COLUMN_ID
                        ? "Locked"
                        : `${columnTypeLabels[column.type]} - ${index}`}
                    </span>
                  </th>
                ))}
                <th
                  className="sticky right-0 top-0 z-20 border-b border-slate-200 bg-surface px-3 py-3 text-xs font-bold uppercase tracking-[0.08em] text-muted"
                  style={{ width: ACTIONS_WIDTH, minWidth: ACTIONS_WIDTH }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-12 text-center text-sm font-bold text-muted"
                    colSpan={state.columns.length + 1}
                  >
                    No proposal records added yet
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => (
                  <tr className="group" key={row.id}>
                    {state.columns.map((column) => (
                      <td
                        className={`border-b border-r border-slate-100 bg-white px-2 py-2 align-top transition group-hover:bg-slate-50 ${
                          column.id === UNIQUE_ID_COLUMN_ID
                            ? "sticky left-0 z-10 font-bold text-brand-700"
                            : ""
                        }`}
                        key={column.id}
                        style={{ width: column.width, minWidth: column.width }}
                      >
                        {column.id === UNIQUE_ID_COLUMN_ID ? (
                          <span className="block rounded-md bg-brand-50 px-2 py-2 text-sm">
                            {row.id}
                          </span>
                        ) : (
                          <CellInput
                            column={column}
                            value={row.cells[column.id] ?? ""}
                            onChange={(value) => updateCell(row.id, column.id, value)}
                          />
                        )}
                      </td>
                    ))}
                    <td
                      className="sticky right-0 z-10 border-b border-slate-100 bg-white px-3 py-2 align-top shadow-[-8px_0_16px_rgba(20,32,51,0.04)] group-hover:bg-slate-50"
                      style={{ width: ACTIONS_WIDTH, minWidth: ACTIONS_WIDTH }}
                    >
                      <div className="flex flex-wrap gap-2">
                        <GridButton icon={Copy} label="Duplicate" onClick={() => duplicateRow(row)} />
                        <GridButton
                          icon={Trash2}
                          label="Delete"
                          onClick={() => deleteRow(row.id)}
                          tone="danger"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 p-4">
          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>

      {activeColumn && activeColumn.id !== UNIQUE_ID_COLUMN_ID && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4">
          <Card className="max-h-[90vh] w-full max-w-xl overflow-y-auto p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
                  Column
                </p>
                <h2 className="mt-1 text-2xl font-bold text-ink">Edit Column</h2>
              </div>
              <button
                aria-label="Close column editor"
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-muted transition hover:bg-slate-50 hover:text-ink"
                onClick={() => setActiveColumnId(null)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <Field label="Column name">
                <input
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  onChange={(event) =>
                    updateColumn(activeColumn.id, { name: event.target.value })
                  }
                  value={activeColumn.name}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Column type">
                  <select
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    onChange={(event) =>
                      updateColumn(activeColumn.id, {
                        type: event.target.value as ProposalColumnType,
                        options:
                          event.target.value === "dropdown"
                            ? activeColumn.options ?? []
                            : undefined,
                      })
                    }
                    value={activeColumn.type}
                  >
                    {Object.entries(columnTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Column width">
                  <input
                    className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                    max={520}
                    min={100}
                    onChange={(event) =>
                      updateColumn(activeColumn.id, {
                        width: Math.max(100, Number(event.target.value) || 100),
                      })
                    }
                    type="number"
                    value={activeColumn.width}
                  />
                </Field>
              </div>

              <div className="flex flex-wrap gap-2">
                <GridButton
                  icon={ArrowLeft}
                  label="Move Left"
                  onClick={() => moveColumn(activeColumn.id, "left")}
                />
                <GridButton
                  icon={ArrowRight}
                  label="Move Right"
                  onClick={() => moveColumn(activeColumn.id, "right")}
                />
                <GridButton
                  icon={Trash2}
                  label="Delete Column"
                  onClick={() => deleteColumn(activeColumn.id)}
                  tone="danger"
                />
              </div>

              {activeColumn.type === "dropdown" && (
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-sm font-bold text-ink">Dropdown options</p>
                  <div className="mt-3 space-y-2">
                    {(activeColumn.options ?? []).map((option, index) => (
                      <div className="flex gap-2" key={`${option}-${index}`}>
                        <input
                          className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                          onChange={(event) => updateDropdownOption(index, event.target.value)}
                          value={option}
                        />
                        <button
                          aria-label={`Delete ${option}`}
                          className="grid h-10 w-10 place-items-center rounded-lg border border-rose-100 text-rose-600 transition hover:bg-rose-50"
                          onClick={() => deleteDropdownOption(index)}
                          type="button"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <form className="mt-3 flex gap-2" onSubmit={addDropdownOption}>
                    <input
                      className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                      onChange={(event) => setNewOption(event.target.value)}
                      placeholder="Add option"
                      value={newOption}
                    />
                    <button
                      className="h-10 rounded-lg bg-brand-600 px-3 text-sm font-bold text-white transition hover:bg-brand-700"
                      type="submit"
                    >
                      Add
                    </button>
                  </form>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

type CellInputProps = {
  column: ProposalColumn;
  value: string;
  onChange: (value: string) => void;
};

function CellInput({ column, value, onChange }: CellInputProps) {
  const className =
    "h-10 w-full rounded-md border border-transparent bg-transparent px-2 text-sm font-medium text-ink outline-none transition hover:border-slate-200 hover:bg-white focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100";

  if (column.type === "dropdown") {
    return (
      <select className={className} onChange={(event) => onChange(event.target.value)} value={value}>
        <option value="">Select</option>
        {(column.options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (column.type === "link") {
    return (
      <input
        className={className}
        onChange={(event) => onChange(event.target.value)}
        placeholder="https://"
        type="url"
        value={value}
      />
    );
  }

  return (
    <input
      className={className}
      onChange={(event) => onChange(event.target.value)}
      type={column.type === "number" || column.type === "date" ? column.type : "text"}
      value={value}
    />
  );
}

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <IconButton
        disabled={page === 1}
        icon={ChevronsLeft}
        label="First page"
        onClick={() => onPageChange(1)}
      />
      <IconButton
        disabled={page === 1}
        icon={ArrowLeft}
        label="Previous page"
        onClick={() => onPageChange(Math.max(1, page - 1))}
      />
      <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-ink">
        Page {page} of {totalPages}
      </span>
      <IconButton
        disabled={page === totalPages}
        icon={ArrowRight}
        label="Next page"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      />
      <IconButton
        disabled={page === totalPages}
        icon={ChevronsRight}
        label="Last page"
        onClick={() => onPageChange(totalPages)}
      />
    </div>
  );
}

type ButtonIcon = typeof Plus;

type GridButtonProps = {
  icon: ButtonIcon;
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
};

function GridButton({ icon: Icon, label, onClick, tone = "default" }: GridButtonProps) {
  return (
    <button
      className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-bold transition ${
        tone === "danger"
          ? "border-rose-100 text-rose-600 hover:bg-rose-50"
          : "border-slate-200 text-muted hover:bg-slate-50 hover:text-ink"
      }`}
      onClick={onClick}
      type="button"
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

type IconButtonProps = {
  disabled: boolean;
  icon: ButtonIcon;
  label: string;
  onClick: () => void;
};

function IconButton({ disabled, icon: Icon, label, onClick }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-muted transition hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <Icon size={17} />
    </button>
  );
}

type FieldProps = {
  label: string;
  children: React.ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ink">{label}</span>
      {children}
    </label>
  );
}
