"use client";

import { useState } from "react";
// import { ProfileForm } from "@/components/staff/profile-form";
import { SuccessDialog } from "@/components/staff/success-dialog";
// import type { StaffProfile } from "@/types/staff";

// const MOCK_PROFILE = {
//   id: "FR-045",
//   name: "Daniel Osei",
//   role: "First Responder",
//   emailAddress: "danielosei@gmail.com",
//   contactNumber: "08123456789",
//   address: "Ikeja, Lagos",
//   startDate: "January 31, 2025",
//   endDate: "Till Date",
//   assignedVehicle: "Qlink-LAG-312",
//   payment: {
//     bankName: "Opay",
//     accountNumber: "12345678901",
//     frequency: "Monthly",
//   },
//   assignedItems: ["Enter List"] as string[],
// } as const;

export default function ResponderProfilePage() {
  // const [mode, setMode] = useState<"view" | "edit">("view");
  const [showSuccess, setShowSuccess] = useState(false);

  // const handleSave = async (profile: StaffProfile) => {
  //   // Simulate API call
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   console.log(profile);
  //   setMode("view");
  //   setShowSuccess(true);
  // };

  return (
    <>
      {/* <ProfileForm
        profile={MOCK_PROFILE}
        type="responder"
        mode={mode}
        onEdit={() => setMode("edit")}
        onSave={handleSave}
      /> */}

      <SuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Profile updated successfully!"
      />
    </>
  );
}
