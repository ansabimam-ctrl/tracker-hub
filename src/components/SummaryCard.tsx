import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";

type SummaryCardProps = {
  label: string;
  value: string;
  change: string;
  tone: "brand" | "mint" | "amber" | "rose" | "violet";
  icon: LucideIcon;
};

const toneClasses: Record<SummaryCardProps["tone"], string> = {
  brand: "bg-brand-50 text-brand-600",
  mint: "bg-mint-50 text-mint-600",
  amber: "bg-amber-50 text-amber-500",
  rose: "bg-rose-50 text-rose-600",
  violet: "bg-violet-50 text-violet-600",
};

export function SummaryCard({ label, value, change, tone, icon: Icon }: SummaryCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-muted">{label}</p>
          <p className="mt-3 text-3xl font-bold text-ink">{value}</p>
        </div>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${toneClasses[tone]}`}>
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-muted">{change}</p>
    </Card>
  );
}
