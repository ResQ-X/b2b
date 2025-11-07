"use client";
import { toast } from "react-toastify";
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardNavProps {
  onMenuClick?: () => void;
}

type UserProfile = {
  id: string;
  name: string;
  company_name: string;
  email: string;
  company_email: string;
  phone: string;
  company_phone: string;
  role?: string; // "SUPER" | "SUB"
};

type SubAdmin = {
  id: string;
  name: string | null;
  email: string;
  role: string; // should be "SUB"
};

export function DashboardNav({ onMenuClick }: DashboardNavProps) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [subs, setSubs] = useState<SubAdmin[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);

  const [isDropdownopen, setIsDropdownopen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/fleets/profile");
        setUserProfile(response.data.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  // console.log("userProfile", userProfile);

  // Fetch sub-admins (only if SUPER)
  useEffect(() => {
    const fetchSubs = async () => {
      if (!userProfile || userProfile.role !== "SUPER") return;

      setSubsLoading(true);
      try {
        const res = await axiosInstance.get<SubAdmin[]>("/super/team");
        const onlySubs = (res.data || []).filter((u) => u.role === "SUB");
        setSubs(onlySubs);
        if (onlySubs.length === 0) {
          toast.info("No Sub-Admins found yet. Invite one to get started.");
        }
      } catch (err: any) {
        console.error("Failed to fetch sub-admins:", err);
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load sub-admins.";
        toast.error(msg);
      } finally {
        setSubsLoading(false);
      }
    };
    fetchSubs();
  }, [userProfile]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownopen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSub = (admin: SubAdmin) => {
    // Persist selection so dashboard page can read it
    sessionStorage.setItem("activeSubAdmin", JSON.stringify(admin));
    toast.success(`Switched to ${admin.name || admin.email}`);
    setIsDropdownopen(false);

    // Navigate with a query param the dashboard can also use
    router.push(`/dashboard?sub=${encodeURIComponent(admin.id)}`);
  };

  const welcomeName =
    userProfile?.role === "SUB"
      ? userProfile?.name?.split(" ")[0]
      : userProfile?.name?.split(" ")[0];
  // const welcomeName =
  //   userProfile?.role === "SUB"
  //     ? userProfile?.company_name?.split(" ")[0]
  //     : userProfile?.name?.split(" ")[0];

  return (
    <div className="h-20 bg-[#3B3835] px-4 sm:px-6 md:px-8 flex items-center justify-between border-b border-[#474747] relative">
      {/* Hamburger (Mobile only) */}
      <div className="md:hidden">
        <button onClick={onMenuClick} className="p-2 rounded-md">
          <Menu className="h-6 w-6 text-[#fff]" />
        </button>
      </div>

      {/* Left greeting */}
      <div className="hidden flex-1 md:flex flex-col justify-center md:justify-start">
        <h1 className="text-[#F1F1F1] text-2xl font-semibold">
          Welcome {loading ? "..." : welcomeName || "User"},
        </h1>
        <p className="text-[#E2E2E2] text-base font-medium">
          Today&apos;s snapshot of your operations.
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-8">
          {/* Notifications */}
          <div
            className="relative cursor-pointer"
            onClick={() => router.push("/account/notifications")}
          >
            <div className="flex justify-center items-center bg-[#D8D8D8] w-11 h-11 rounded-full">
              <Image
                src="/notification-bing.svg"
                alt="Notification Avatar"
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
          </div>

          {/* User info */}
          <div className="hidden sm:block text-left text-[#FFFFFF]">
            <p className="text-sm font-semibold truncate">
              {loading
                ? "..."
                : userProfile?.role === "SUB"
                ? userProfile?.name || "User"
                : userProfile?.name || "User"}
            </p>
            {/* <p className="text-sm font-semibold truncate">
              {loading
                ? "..."
                : userProfile?.role === "SUB"
                ? userProfile?.company_name || "User"
                : userProfile?.name || "User"}
            </p> */}
            <p className="text-sm font-semibold truncate">
              {userProfile?.role === "SUB" ? "Sub Admin" : "Admin"}
            </p>
          </div>

          {/* Avatar */}
          <div
            className="flex justify-center items-center bg-[#D8D8D8] w-11 h-11 rounded-full cursor-pointer"
            onClick={() => router.push("/account/company")}
          >
            <Image
              src="/user-round.svg"
              alt="User Avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
          </div>

          {/* Dropdown toggle */}
          {userProfile?.role === "SUPER" && (
            <button
              onClick={() => setIsDropdownopen((s) => !s)}
              className="absolute right-1"
              aria-haspopup="menu"
              aria-expanded={isDropdownopen}
            >
              <Image
                src="/input-field.svg"
                alt="Open sub-admin menu"
                width={24}
                height={24}
                className="rounded-full"
              />
            </button>
          )}
        </div>

        {/* Sub-admin dropdown (only for SUPER) */}
        {isDropdownopen && userProfile?.role === "SUPER" && (
          <div
            ref={dropdownRef}
            className="modal-content absolute top-24 z-50 bg-[#3B3835] right-3 pl-6 pr-8 pt-8 pb-10 text-[14px] rounded-2xl shadow-lg min-w-[260px]"
            role="menu"
          >
            <p className="mb-3 text-white/80 font-medium">
              {subsLoading ? "Loading Sub-Admins..." : "Switch to Sub-Admin"}
            </p>

            <ul className="flex flex-col gap-2 font-medium max-h-80 overflow-auto pr-1">
              {!subsLoading && subs.length === 0 && (
                <li className="text-white/60">No Sub-Admins yet</li>
              )}

              {subs.map((admin) => (
                <li key={admin.id}>
                  <button
                    onClick={() => handleSelectSub(admin)}
                    className="w-full text-left hover:bg-[#FFA947] pr-5 pl-2 py-2 rounded-lg transition-all duration-300 text-white"
                  >
                    <div className="font-semibold">
                      {admin.name?.trim() || admin.email}
                    </div>
                    <div className="text-white/70 text-xs">{admin.email}</div>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-4 pt-3 border-t border-white/10">
              <Link
                href="/account/teams"
                className="text-orange hover:text-orange/80 underline underline-offset-4"
                onClick={() => setIsDropdownopen(false)}
              >
                Manage Team
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
