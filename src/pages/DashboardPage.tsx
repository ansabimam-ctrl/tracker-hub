import {
  BarChart3,
  CheckSquare2,
  CircleDollarSign,
  ClipboardList,
  FileText,
  LineChart,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { ActivityTable } from "../components/ActivityTable";
import { ChartPlaceholder } from "../components/ChartPlaceholder";
import { PageHeader } from "../components/PageHeader";
import { SummaryCard } from "../components/SummaryCard";

const summaryCards = [
  {
    label: "Total Leads",
    value: "1,284",
    change: "+12.4% from last month",
    tone: "brand" as const,
    icon: ClipboardList,
  },
  {
    label: "Active Proposals",
    value: "38",
    change: "9 awaiting review",
    tone: "mint" as const,
    icon: FileText,
  },
  {
    label: "Pending Analysis",
    value: "16",
    change: "5 high-priority items",
    tone: "amber" as const,
    icon: TrendingUp,
  },
  {
    label: "Monthly Spend",
    value: "$24.8k",
    change: "Sample financial data",
    tone: "rose" as const,
    icon: CircleDollarSign,
  },
  {
    label: "Open Tasks",
    value: "27",
    change: "8 due this week",
    tone: "violet" as const,
    icon: CheckSquare2,
  },
];

export function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Welcome to TrackHub"
        description="Manage leads, proposals, analysis, transactions, and tasks from one place."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ChartPlaceholder
          bars={[42, 62, 55, 78, 64, 88, 76]}
          icon={LineChart}
          title="Lead Activity"
        />
        <ChartPlaceholder
          bars={[72, 48, 58, 66, 82, 54, 69]}
          icon={BarChart3}
          title="Spend Overview"
        />
        <ChartPlaceholder
          bars={[38, 52, 84, 44, 74, 68, 91]}
          icon={PieChart}
          title="Proposal Status"
        />
      </section>

      <ActivityTable />
    </>
  );
}
