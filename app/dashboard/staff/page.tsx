"use client";
import React, { useState } from "react";
import { AdminTabs } from "@/components/staff/admin-tabs";
// import { RespondersTable } from "@/components/staff/responders-table";
import { AdminTable } from "@/components/staff/admin-table";
// import { AdminStaff } from "@/types/staff";

export type Professional = {
  id: string;
  name: string;
  location: string;
  role?: string;
  dateAdded?: string;
  status: "On Duty" | "Off Duty" | "Busy";
  resolved?: number;
  avgResponseTime?: string;
};

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Staff Management</h1>

      {/* <RespondersTable responders={MOCK_RESPONDERS} /> */}
      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <AdminTable activeTab={activeTab} />
      {/* <AdminTable staff={MOCK_ADMIN} /> */}

      <footer className="text-center text-sm text-gray-500">
        © 2025 ResQ-X. All Rights Reserved.
      </footer>
    </div>
  );
}
