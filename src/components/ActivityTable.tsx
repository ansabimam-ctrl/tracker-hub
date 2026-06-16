import { Card } from "./Card";

const activityRows = [
  {
    item: "Lead imported",
    owner: "Sales Team",
    status: "New",
    time: "Today",
  },
  {
    item: "Proposal draft updated",
    owner: "Operations",
    status: "In review",
    time: "Yesterday",
  },
  {
    item: "Spend record synced",
    owner: "Finance",
    status: "Recorded",
    time: "2 days ago",
  },
  {
    item: "Follow-up task created",
    owner: "Admin",
    status: "Open",
    time: "3 days ago",
  },
];

export function ActivityTable() {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 p-5">
        <p className="text-lg font-bold text-ink">Recent Activity</p>
        <p className="mt-1 text-sm font-medium text-muted">Dummy activity for layout preview</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead className="bg-surface text-xs font-bold uppercase tracking-[0.12em] text-muted">
            <tr>
              <th className="px-5 py-4">Activity</th>
              <th className="px-5 py-4">Owner</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {activityRows.map((row) => (
              <tr className="transition hover:bg-slate-50" key={`${row.item}-${row.time}`}>
                <td className="px-5 py-4 font-semibold text-ink">{row.item}</td>
                <td className="px-5 py-4 text-muted">{row.owner}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-mint-50 px-3 py-1 text-xs font-bold text-mint-600">
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
