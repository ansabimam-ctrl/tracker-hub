import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { modules } from "../data/modules";
import { Logo } from "./Logo";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
};

export function Sidebar({
  collapsed,
  mobileOpen,
  onToggle,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      <button
        aria-label="Close navigation"
        className={`fixed inset-0 z-30 bg-ink/35 transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onCloseMobile}
        type="button"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex border-r border-slate-200 bg-white transition-all duration-300 lg:sticky lg:top-0 lg:z-10 ${
          collapsed ? "w-24" : "w-[280px]"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex min-h-0 w-full flex-col px-4 py-5">
          <div
            className={`mb-6 flex gap-3 ${
              collapsed
                ? "flex-col items-center justify-start"
                : "items-center justify-between"
            }`}
          >
            <Logo collapsed={collapsed} />
            <button
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-muted transition hover:border-brand-100 hover:bg-brand-50 hover:text-brand-600 lg:grid"
              onClick={onToggle}
              type="button"
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className={`min-h-0 flex-1 space-y-1 overflow-y-auto ${collapsed ? "" : "pr-1"}`}>
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <NavLink
                  aria-label={module.name}
                  className={({ isActive }) =>
                    [
                      "group flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition",
                      collapsed ? "justify-center" : "justify-start",
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-muted hover:bg-slate-50 hover:text-ink",
                    ].join(" ")
                  }
                  end={module.path === "/"}
                  key={module.path}
                  onClick={onCloseMobile}
                  title={collapsed ? module.name : undefined}
                  to={module.path}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="truncate">{module.name}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
