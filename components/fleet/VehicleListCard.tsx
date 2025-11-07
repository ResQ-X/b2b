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
  const hasItems = items && items.length > 0;

  return (
    <div className="bg-[#2B2A28] rounded-2xl text-white p-6 md:p-8 border border-white/10">
      <h3 className="text-xl font-semibold mb-4">Vehicle List</h3>

      {hasItems ? (
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
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex items-center justify-center h-14 w-14 rounded-full bg-white/10 mb-4">
            <Car className="h-6 w-6 text-white/70" />
          </div>
          <p className="text-white/70 text-lg font-medium mb-1">
            No vehicles available
          </p>
          <p className="text-white/50 text-sm">
            Add a new vehicle to get started.
          </p>
        </div>
      )}
    </div>
  );
}
