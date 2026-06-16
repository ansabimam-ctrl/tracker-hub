import { Bell, Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { modules } from "../data/modules";

type TopHeaderProps = {
  onOpenMobile: () => void;
};

export function TopHeader({ onOpenMobile }: TopHeaderProps) {
  const location = useLocation();
  const activeModule =
    modules.find((module) => module.path === location.pathname) ?? modules[0];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-surface/90 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            aria-label="Open navigation"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-muted shadow-sm transition hover:text-ink lg:hidden"
            onClick={onOpenMobile}
            type="button"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              TrackHub
            </p>
            <h1 className="truncate text-2xl font-bold text-ink md:text-3xl">
              {activeModule.name}
            </h1>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row xl:max-w-2xl">
          <label className="relative min-w-0 flex-1">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
            />
            <input
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              placeholder="Search leads, proposals, reports..."
              type="search"
            />
          </label>
          <div className="flex shrink-0 items-center gap-3">
            <button
              aria-label="Notifications"
              className="grid h-11 w-11 place-items-center rounded-lg border border-slate-200 bg-white text-muted shadow-sm transition hover:border-brand-100 hover:bg-brand-50 hover:text-brand-600"
              type="button"
            >
              <Bell size={19} />
            </button>
            <div className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 shadow-sm">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-mint-50 text-sm font-bold text-mint-600">
                TH
              </div>
              <div className="hidden leading-4 sm:block">
                <p className="text-sm font-bold text-ink">TrackHub User</p>
                <p className="text-xs font-medium text-muted">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
