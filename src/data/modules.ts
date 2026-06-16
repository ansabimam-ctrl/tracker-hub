import {
  Activity,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  ClipboardList,
  FileChartColumn,
  FilePlus2,
  FileText,
  LayoutDashboard,
  ListTodo,
  type LucideIcon,
  ReceiptText,
  Sparkles,
} from "lucide-react";

export type TrackHubModule = {
  name: string;
  path: string;
  description: string;
  icon: LucideIcon;
};

export const modules: TrackHubModule[] = [
  {
    name: "Dashboard",
    path: "/",
    description: "Overview of business activity, tasks, proposals, and spending.",
    icon: LayoutDashboard,
  },
  {
    name: "Proposal Details",
    path: "/proposal-details",
    description: "Review and manage proposal information in one organized workspace.",
    icon: FileText,
  },
  {
    name: "Reporting",
    path: "/reporting",
    description: "Build reporting views for performance, activity, and outcomes.",
    icon: FileChartColumn,
  },
  {
    name: "Smart Analysis",
    path: "/smart-analysis",
    description: "Prepare intelligent business insights and decision support.",
    icon: BrainCircuit,
  },
  {
    name: "Lead Analysis",
    path: "/lead-analysis",
    description: "Analyze lead quality, sources, movement, and conversion signals.",
    icon: Activity,
  },
  {
    name: "Job Analysis",
    path: "/job-analysis",
    description: "Track job performance, status, and operational analysis.",
    icon: BriefcaseBusiness,
  },
  {
    name: "Proposal Creation",
    path: "/proposal-creation",
    description: "Create, draft, and organize future proposal workflows.",
    icon: FilePlus2,
  },
  {
    name: "Lead Prioritization",
    path: "/lead-prioritization",
    description: "Score and prioritize leads for focused follow-up.",
    icon: Sparkles,
  },
  {
    name: "Transactions",
    path: "/transactions",
    description: "Track income, transaction history, and business financial movement.",
    icon: ReceiptText,
  },
  {
    name: "Notes & To-Do",
    path: "/notes-todo",
    description: "Keep notes, reminders, and action items connected to the workflow.",
    icon: ListTodo,
  },
];

export const dashboardQuickActions = [
  { label: "New Proposal", icon: FilePlus2 },
  { label: "Review Leads", icon: ClipboardList },
  { label: "View Reports", icon: BarChart3 },
];
