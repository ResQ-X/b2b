import { StatusPill } from "./StatusPill";

export function ServiceHistoryList({
  items,
  onItemClick,
}: {
  items: Array<{
    id: string;
    title: string;
    subtitle: string;
    status: "Completed" | "In Progress" | "Pending" | "Cancelled";
  }>;
  onItemClick?: (id: string) => void;
}) {
  return (
    <div className="bg-[#2B2A28] rounded-2xl text-white p-6 md:p-8 border border-white/10">
      <h3 className="text-xl font-semibold mb-4">Service History</h3>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-white/40 mb-3">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h4 className="text-white text-base font-semibold mb-2">
            No service history
          </h4>
          <p className="text-white/60 text-sm text-center max-w-sm">
            Service records and maintenance history will appear here
          </p>
        </div>
      ) : (
        <ul className="">
          {items.map((it, i) => (
            <li
              key={i}
              onClick={() => onItemClick?.(it.id)}
              className="flex items-center justify-between py-4 cursor-pointer hover:bg-white/5 rounded-lg px-3 -mx-3 transition-colors"
            >
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-white/70">{it.subtitle}</div>
              </div>
              <StatusPill status={it.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
