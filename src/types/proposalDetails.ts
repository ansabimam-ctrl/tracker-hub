export type ProposalColumnType = "text" | "date" | "number" | "link" | "dropdown";

export type ProposalColumn = {
  id: string;
  name: string;
  type: ProposalColumnType;
  width: number;
  locked?: boolean;
  options?: string[];
};

export type ProposalRow = {
  id: string;
  cells: Record<string, string>;
  createdAt: string;
  updatedAt: string;
};

export type ProposalDetailsState = {
  columns: ProposalColumn[];
  rows: ProposalRow[];
  nextIdNumber: number;
};
