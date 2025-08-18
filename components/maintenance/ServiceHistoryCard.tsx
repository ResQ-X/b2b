"use client";

export type ServiceHistoryItem = {
  title: string; // e.g., "LND-234-CC - Full Service"
  subtitle: string; // e.g., "ResQ-X Service Center • 5 days ago"
  amount: number; // NGN
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

export default function ServiceHistoryCard({
  items,
}: {
  items: ServiceHistoryItem[];
}) {
  return (
    <div className="bg-[#3B3835] rounded-2xl text-white overflow-hidden">
      <div className="px-6 pt-6">
        <h3 className="text-xl font-semibold">Service History</h3>
      </div>

      <ul className="px-6 py-4 ">
        {items.map((it, i) => (
          <li key={i} className="flex items-center justify-between py-4">
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-white/70">{it.subtitle}</div>
            </div>
            <div className="font-semibold">{fmtMoney(it.amount)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
