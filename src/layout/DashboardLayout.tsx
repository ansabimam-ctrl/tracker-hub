import type { ReactNode } from "react";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { TopHeader } from "../components/TopHeader";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-ink">
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onToggle={() => setCollapsed((current) => !current)}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopHeader onOpenMobile={() => setMobileOpen(true)} />
          <main className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
