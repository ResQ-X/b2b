"use client";

import { Car } from "lucide-react";
import Link from "next/link";

export type VehicleListItem = {
  vehicleId: string;
  title: string;
  subtitle: string;
};

export default function VehicleListCard({
  items,
}: {
  items: VehicleListItem[];
}) {
  return (
    <div className="bg-[#2B2A28] rounded-2xl text-white p-6 md:p-8 border border-white/10">
      <h3 className="text-xl font-semibold mb-4">Vehicle List</h3>

      <ul className="divide-y divide-white/10">
        {items.map((it) => (
          <li
            key={it.vehicleId}
            className="flex items-center justify-between py-4"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <Car className="h-4 w-4 text-white/80" />
              </span>
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-sm text-white/70">{it.subtitle}</div>
              </div>
            </div>

            <Link
              href={`/fleet/${encodeURIComponent(it.vehicleId)}`}
              className="text-[#FF8500] font-semibold hover:underline"
            >
              View Details
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
