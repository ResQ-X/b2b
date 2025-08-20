export function StatusPill({
  status,
}: {
  status: "Completed" | "In Progress" | "Pending";
}) {
  const map = {
    Completed: {
      bg: "#9BFF95",
      text: "#005800",
      // dot: "bg-emerald-400",
    },
    "In Progress": {
      bg: "bg-indigo-400/20",
      text: "text-indigo-300",
      // dot: "bg-indigo-400",
    },
    Pending: {
      bg: "bg-yellow-400/20",
      text: "text-yellow-300",
      // dot: "bg-yellow-400",
    },
  } as const;
  const c = map[status] ?? map.Pending;
  return (
    <span
      className={`bg-[#9BFF95] text-[#005800] inline-flex items-center gap-2 px-3 py-1 rounded-[8px] ${c.bg} ${c.text} text-sm`}
    >
      {/* <span className={`h-2 w-2 rounded-full ${c.dot}`} /> */}
      {status}
    </span>
  );
}
