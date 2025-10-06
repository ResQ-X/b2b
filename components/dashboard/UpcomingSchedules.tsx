"use client";
import Image from "next/image";
import ScheduleIcon from "@/public/schedule.svg";
import { CalendarX } from "lucide-react"; // empty state icon

export function UpcomingSchedules({
  items,
}: {
  items: { title: string; where: string; when: string; vol: string }[];
}) {
  return (
    <div className="border border-[#777777] rounded-2xl bg-[#3B3835] p-6 text-white">
      <h3 className="text-[#FFFFFF] text-2xl font-semibold">
        Upcoming Schedules
      </h3>

      {items.length > 0 ? (
        <div className="mt-4 space-y-3">
          {items.map((it, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg">
                  <Image
                    src={ScheduleIcon}
                    alt="Schedule Icon"
                    className="h-10 w-10"
                  />
                </div>
                <div>
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-sm text-white/80">
                    {it.where} · {it.when}
                  </div>
                </div>
              </div>
              <div className="text-sm">{it.vol}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-52 mt-8 text-center text-white/70">
          <CalendarX className="h-12 w-10 mb-2 opacity-60" />
          <span className="text-sm">No schedules yet</span>
        </div>
      )}
    </div>
  );
}
