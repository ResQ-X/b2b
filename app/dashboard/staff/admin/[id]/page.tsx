"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
// import { ProfileForm } from "@/components/staff/profile-form";
import { SuccessDialog } from "@/components/staff/success-dialog";
import type { StaffProfile } from "@/types/staff";
import ProfDetails from "@/components/staff/profDetails";

export default function AdminProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);
  // const [mode, setMode] = useState<"view" | "edit">("view");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchOrder = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/get_user_details?userID=${id}`
        );
        setProfile(response.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [id]);

  console.log("Profile", profile);

  // const handleSave = async (updatedProfile: StaffProfile) => {
  //   // Simulate or send update to backend
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   setProfile(updatedProfile);
  //   setMode("view");
  //   setShowSuccess(true);
  // };

  if (loading)
    return (
      <div className="w-full text-center py-10">
        <svg
          className="animate-spin h-6 w-6 text-orange mx-auto mb-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
        <p className="text-sm text-gray-500">
          Fetching professional Details...
        </p>
      </div>
    );
  if (!profile)
    return <div className="p-4 text-sm text-red-500">Profile not found</div>;

  return (
    <>
      {/* <ProfileForm
        profile={profile}
        type="admin"
        mode={mode}
        onEdit={() => setMode("edit")}
        onSave={handleSave}
      /> */}

      <ProfDetails professional={profile} />

      <SuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Profile updated successfully!"
      />
    </>
  );
}
