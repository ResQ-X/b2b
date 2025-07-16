import { ReactNode } from "react";

export interface StaffMember {
  id: string;
  name: string;
  location: string;
  status: "On Duty" | "Off Duty" | "Busy";
  photo?: string;
}

export interface Responder extends StaffMember {
  resolved: number;
  avgResponseTime: string;
  assignedVehicle?: string;
}

export interface AdminStaff extends StaffMember {
  role: string;
  created_at: string;
  userType: string; // e.g., "ADMIN", "SUPPORT"
  is_online: boolean;
}

export interface StaffProfile {
  is_verified(
    is_verified: any
  ): string | number | readonly string[] | undefined;
  country: string;
  is_online: string | number | readonly string[] | undefined;
  phone: string | number | readonly string[] | undefined;
  email: string | number | readonly string[] | undefined;
  userType: ReactNode;
  id: string;
  name: string;
  role: string;
  emailAddress: string;
  contactNumber: string;
  address: string;
  startDate: string;
  endDate: string;
  assignedVehicle?: string;
  payment: {
    bankName: string;
    accountNumber: string;
    frequency: string;
  };
  assignedItems: string[];
  photo?: string;
}

export interface PhotoUploadState {
  status: "idle" | "uploading" | "success" | "error";
  progress: number;
  photo?: string;
}
