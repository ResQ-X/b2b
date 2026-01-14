import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (n: string) =>
  `₦${Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

type UserRole = "USER" | "SUPER" | "SUB";

type UserRoleEnum = {
  USER: "USER";
  SUPER: "SUPER";
  SUB: "SUB";
};

const UserRoleEnum: UserRoleEnum = {
  USER: "USER",
  SUPER: "SUPER",
  SUB: "SUB",
};
export const ROLE_PERMISSIONS: Record<UserRole, { canManualTopUp: boolean }> = {
  USER: { canManualTopUp: true },
  SUPER: { canManualTopUp: true },
  SUB: { canManualTopUp: false },
};
