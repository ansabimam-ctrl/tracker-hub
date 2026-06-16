import type {
  ProposalColumn,
  ProposalDetailsState,
  ProposalRow,
} from "../types/proposalDetails";

const STORAGE_KEY = "trackhub.proposalDetails";

export const UNIQUE_ID_COLUMN_ID = "uniqueId";

export const defaultProposalColumns: ProposalColumn[] = [
  { id: UNIQUE_ID_COLUMN_ID, name: "Unique ID", type: "text", width: 120, locked: true },
  { id: "date", name: "Date", type: "date", width: 150 },
  { id: "sdrName", name: "SDR Name", type: "dropdown", width: 160, options: ["Ansab", "Maha"] },
  {
    id: "profileName",
    name: "Profile Name",
    type: "dropdown",
    width: 170,
    options: ["Kashif", "Babar", "Wajhi"],
  },
  { id: "jobTitle", name: "Job Title", type: "text", width: 240 },
  { id: "jobLink", name: "Job Link", type: "link", width: 240 },
  {
    id: "proposalStatus",
    name: "Proposal Status",
    type: "dropdown",
    width: 180,
    options: ["Submitted", "Viewed", "Contacted", "Interviewed", "Hired"],
  },
  {
    id: "accountType",
    name: "Account Type",
    type: "dropdown",
    width: 160,
    options: ["Agency", "Freelancer"],
  },
  {
    id: "projectType",
    name: "Project Type",
    type: "dropdown",
    width: 160,
    options: ["Hourly", "Fixed", "NA"],
  },
  { id: "bidAmount", name: "Bid Amount", type: "number", width: 150 },
];

function getHighestIdNumber(rows: ProposalRow[]) {
  return rows.reduce((highest, row) => {
    const match = row.id.match(/^UP(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
}

function normalizeState(state: ProposalDetailsState): ProposalDetailsState {
  const columns = state.columns?.length ? state.columns : defaultProposalColumns;
  const rows = state.rows ?? [];
  const nextIdNumber = Math.max(state.nextIdNumber || 1, getHighestIdNumber(rows) + 1);

  return {
    columns: [
      defaultProposalColumns[0],
      ...columns.filter((column) => column.id !== UNIQUE_ID_COLUMN_ID),
    ],
    rows,
    nextIdNumber,
  };
}

export const proposalDetailsStorage = {
  getState: (): ProposalDetailsState => {
    if (typeof window === "undefined") {
      return { columns: defaultProposalColumns, rows: [], nextIdNumber: 1 };
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored
        ? normalizeState(JSON.parse(stored) as ProposalDetailsState)
        : { columns: defaultProposalColumns, rows: [], nextIdNumber: 1 };
    } catch {
      return { columns: defaultProposalColumns, rows: [], nextIdNumber: 1 };
    }
  },
  saveState: (state: ProposalDetailsState) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)));
  },
};
