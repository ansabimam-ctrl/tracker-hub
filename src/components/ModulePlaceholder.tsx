import { Card } from "./Card";
import type { TrackHubModule } from "../data/modules";

type ModulePlaceholderProps = {
  module: TrackHubModule;
};

export function ModulePlaceholder({ module }: ModulePlaceholderProps) {
  const Icon = module.icon;

  return (
    <Card className="flex min-h-[420px] items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-xl">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-lg bg-brand-50 text-brand-600">
          <Icon size={30} />
        </div>
        <h2 className="mt-6 text-3xl font-bold text-ink">{module.name}</h2>
        <p className="mt-3 text-base leading-7 text-muted">{module.description}</p>
        <p className="mt-6 inline-flex rounded-full border border-slate-200 bg-surface px-4 py-2 text-sm font-bold text-muted">
          This module will be configured later
        </p>
      </div>
    </Card>
  );
}
