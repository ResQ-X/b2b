import { StatusPill } from "./StatusPill";

export function ServiceHistoryList({
  items,
}: {
  items: Array<{
    title: string;
    subtitle: string;
    status: "Completed" | "In Progress" | "Pending";
  }>;
}) {
  return (
    <div className="bg-[#2B2A28] rounded-2xl text-white p-6 md:p-8 border border-white/10">
      <h3 className="text-xl font-semibold mb-4">Service History</h3>
      <ul className="">
        {items.map((it, i) => (
          <li key={i} className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-white/70">{it.subtitle}</div>
            </div>
            <StatusPill status={it.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
