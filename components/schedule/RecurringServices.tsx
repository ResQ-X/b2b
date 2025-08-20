import { RowCard } from "@/components/schedule/RowCard";
import { RecurringItem } from "@/app/(dashboard)/schedule/page";

export function RecurringServices({ items }: { items: RecurringItem[] }) {
  return (
    <section className="text-[#FFFFFF]">
      <h2 className="text-lg font-semibold mb-4 sm:mb-6">Recurring Services</h2>

      <div className="space-y-3">
        {items.map((it) => (
          <RowCard
            key={it.id}
            leftIcon={it.icon}
            title={it.title}
            subtitle={`Next: ${it.nextDate}${it.sub ? `\n${it.sub}` : ""}`}
            rightTop={it.cadence}
          />
        ))}
      </div>
    </section>
  );
}
