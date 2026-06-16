import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";

type ChartPlaceholderProps = {
  title: string;
  icon: LucideIcon;
  bars?: number[];
};

export function ChartPlaceholder({
  title,
  icon: Icon,
  bars = [52, 74, 46, 86, 61, 92, 70],
}: ChartPlaceholderProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-ink">{title}</p>
          <p className="mt-1 text-sm font-medium text-muted">Sample dashboard placeholder</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-ink">
          <Icon size={19} />
        </div>
      </div>
      <div className="mt-8 flex h-44 items-end gap-3 rounded-lg bg-surface p-4">
        {bars.map((height, index) => (
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2" key={index}>
            <div
              className="w-full rounded-t-md bg-brand-500/80"
              style={{ height: `${height}%` }}
            />
            <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
          </div>
        ))}
      </div>
    </Card>
  );
}
