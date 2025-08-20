import {
  formatDateHeader,
  groupByDate,
  OneOffItem,
} from "@/app/(dashboard)/schedule/page";
import { RowCard } from "@/components/schedule/RowCard";

export function ThisWeekSchedule({ items }: { items: OneOffItem[] }) {
  const grouped = groupByDate(items);

  // Keep dates sorted ascending
  const dates = Object.keys(grouped).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <section className="text-[#FFFFFF]">
      <h2 className="text-lg font-semibold mb-4 sm:mb-6">This Week Schedule</h2>

      <div className="space-y-6">
        {dates.map((d) => (
          <div key={d} className="space-y-3">
            <div className="text-[#FFFFFF] text-base font-medium">
              {formatDateHeader(d)}
            </div>

            <div className="space-y-3">
              {grouped[d].map((it) => (
                <RowCard
                  key={it.id}
                  leftIcon={it.icon}
                  title={it.title}
                  subtitle={it.subtitle}
                  rightTop={it.time}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
