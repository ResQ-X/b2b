"use client";
import Image from "next/image";
import ScheduleIcon from "@/public/schedule.svg";

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
      <div className="mt-4 space-y-3">
        {items.map((it, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg">
                {/* <CalendarClock className="h-4 w-4" /> */}
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
    </div>
  );
}
