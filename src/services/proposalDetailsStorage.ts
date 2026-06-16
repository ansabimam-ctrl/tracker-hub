import type {
  ProposalColumn,
  ProposalDetailsState,
  ProposalRow,
} from "../types/proposalDetails";
import { createClient, type RealtimeChannel } from "@supabase/supabase-js";

const STORAGE_KEY = "trackhub.proposalDetails";
const REMOTE_TABLE = "trackhub_proposal_details";
const REMOTE_DOCUMENT_ID = "default";

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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

function saveLocalState(state: ProposalDetailsState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)));
}

export const proposalDetailsStorage = {
  isRealtimeEnabled: () => Boolean(supabase),
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
  loadRemoteState: async (): Promise<ProposalDetailsState | null> => {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from(REMOTE_TABLE)
      .select("state")
      .eq("id", REMOTE_DOCUMENT_ID)
      .maybeSingle();

    if (error || !data?.state) {
      return null;
    }

    return normalizeState(data.state as ProposalDetailsState);
  },
  saveLocalState,
  saveState: async (state: ProposalDetailsState) => {
    const normalizedState = normalizeState(state);
    saveLocalState(normalizedState);

    if (!supabase) {
      return;
    }

    await supabase.from(REMOTE_TABLE).upsert({
      id: REMOTE_DOCUMENT_ID,
      state: normalizedState,
      updated_at: new Date().toISOString(),
    });
  },
  subscribe: (onStateChange: (state: ProposalDetailsState) => void) => {
    if (!supabase) {
      return () => undefined;
    }

    const channel: RealtimeChannel = supabase
      .channel("trackhub-proposal-details")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: REMOTE_TABLE,
          filter: `id=eq.${REMOTE_DOCUMENT_ID}`,
        },
        (payload) => {
          const nextState = (payload.new as { state?: ProposalDetailsState })?.state;

          if (nextState) {
            onStateChange(normalizeState(nextState));
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  },
};
