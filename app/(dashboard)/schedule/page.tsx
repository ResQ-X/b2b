"use client";
import { Wrench, Fuel, Truck } from "lucide-react";
import { ThisWeekSchedule } from "@/components/schedule/ThisWeekSchedule";
import { RecurringServices } from "@/components/schedule/RecurringServices";

export type OneOffItem = {
  id: string;
  dateISO: string;
  time: string;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
};

export type RecurringItem = {
  id: string;
  title: string; // e.g. "Fleet Refuel - Lekki"
  nextDate: string; // e.g. "Jan 11, 2025"
  sub?: string; // e.g. "200L" or "12 vehicles"
  cadence: string; // e.g. "Weekly (Every Friday)"
  icon?: React.ComponentType<any>;
};

export const WEEK_ITEMS: OneOffItem[] = [
  {
    id: "w1",
    dateISO: "2025-05-11",
    time: "10:00 AM",
    title: "LND-789-DD Full Service",
    subtitle: "ResQ-X Service Center",
    icon: Wrench,
  },
  {
    id: "w2",
    dateISO: "2025-05-11",
    time: "2:00 AM",
    title: "Generator Refuel",
    subtitle: "Head Office",
    icon: Fuel,
  },
  {
    id: "w3",
    dateISO: "2025-05-12",
    time: "2:00 AM",
    title: "Generator Refuel",
    subtitle: "Head Office",
    icon: Fuel,
  },
  {
    id: "w4",
    dateISO: "2025-05-14",
    time: "10:00 AM",
    title: "LND-789-DD Full Service",
    subtitle: "ResQ-X Service Center",
    icon: Wrench,
  },
];

export const RECURRING: RecurringItem[] = [
  {
    id: "r1",
    title: "Fleet Refuel - Lekki",
    nextDate: "Jan 11, 2025",
    sub: "200L",
    cadence: "Weekly (Every Friday)",
    icon: Fuel,
  },
  {
    id: "r2",
    title: "Fleet Refuel - Lekki",
    nextDate: "Jan 11, 2025",
    sub: "200L",
    cadence: "Weekly (Every Friday)",
    icon: Fuel,
  },
  {
    id: "r3",
    title: "Fleet Inspection",
    nextDate: "Feb 2, 2025",
    sub: "12 vehicles",
    cadence: "Monthly (1st Tuesday)",
    icon: Truck,
  },
];

export const formatDateHeader = (iso: string) => {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd} - ${mm} - ${yyyy}`;
};

export function groupByDate(items: OneOffItem[]) {
  return items.reduce<Record<string, OneOffItem[]>>((acc, item) => {
    (acc[item.dateISO] ||= []).push(item);
    return acc;
  }, {});
}

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <ThisWeekSchedule items={WEEK_ITEMS} />
      <RecurringServices items={RECURRING} />
    </div>
  );
}
