import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (n: string) =>
  `₦${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
