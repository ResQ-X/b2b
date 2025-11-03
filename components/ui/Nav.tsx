"use client";
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import { Menu } from "lucide-react";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";
// import { Input } from "@/components/ui/input";
// import Search from "@/components/ui/Search";
// import { useAuth } from "@/contexts/auth.context";
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
};

export function DashboardNav({ onMenuClick }: DashboardNavProps) {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);


  const subAdmins = [
  { name: "Jiver", href: "/jiver" },
  { name: "Emtech", href: "/emtech" },
  { name: "KarlTech", href: "/karltech" },
  { name: "Resq", href: "/resq" }
 ];


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

  // console.log(user);
  // const pathname = usePathname();

  // const getPageTitle = (path: string) => {
  //   if (path.startsWith("/dashboard")) return "Dashboard";
  //   if (path.startsWith("/fuel-delivery")) return "Fuel Delivery";
  //   if (path.startsWith("/maintenance")) return "Maintenance";
  //   if (path.startsWith("/emergency")) return "Emergency Services";
  //   if (path.startsWith("/fleet")) return "Fleet Management";
  //   if (path.startsWith("/schedule")) return "Schedule";
  //   if (path.startsWith("/billing")) return "Billing Management";
  //   if (path.startsWith("/account")) return "Account Management";
  //   if (path === "/dashboard") return "Dashboard";

  //   // fallback: turn last segment into Title Case
  //   const segments = path.split("/").filter(Boolean);
  //   const last = segments[segments.length - 1];
  //   return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  // };

  const [isDropdownopen, setIsDropdownopen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // Add HTMLDivElement type

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) { // Add MouseEvent type
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownopen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="h-20 bg-[#3B3835] px-4 sm:px-6 md:px-8 flex items-center justify-between border-b border-[#474747] relative">
      {/* Hamburger (Mobile only) */}
      <div className="md:hidden">
        <button onClick={onMenuClick} className="p-2 rounded-md">
          <Menu className="h-6 w-6 text-[#fff]" />
        </button>
      </div>

      {/* Logo or Search Placeholder */}
      <div className="flex-1 flex flex-col justify-center md:justify-start">
        {/* Show only on md+ screens */}
        {/* <span className="text-lg md:text-2xl font-bold text-[#fff]">
          {getPageTitle(pathname)}
        </span> */}
        <h1 className="text-[#F1F1F1] text-2xl font-semibold">
          {/* Welcome {loading ? "..." : userProfile?.name || "User"}, */}
          Welcome {loading ? "..." : userProfile?.name?.split(" ")[0] || "User"}
          ,
        </h1>
        <p className="text-[#E2E2E2] text-base font-medium">
          Today&apos;s snapshot of your operations.
        </p>
      </div>

      {/* Right side user info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-8">
          {/* Notification Icon with badge */}
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
            {/* <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#F87171] text-[10px] text-white flex items-center justify-center">
              6
            </span> */}
          </div>

          {/* User info */}
          <div className="hidden sm:block text-left text-[#FFFFFF]">
            <p className="text-sm font-semibold truncate">
              {loading ? "..." : userProfile?.name || "User"}
            </p>
            <p className="text-sm font-semibold truncate">Admin</p>
          </div>

          {/* User avatar */}
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

          {/*drop down*/}
          <div onClick={() => setIsDropdownopen(!isDropdownopen)} className="absolute right-1">
            <Image
              src="/input-field.svg"
              alt="User Avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
          </div>
        </div>

        {isDropdownopen && (  
          <div className="modal-content absolute top-24 z-50 bg-[#3B3835]  right-3 pl-6 pr-8 pt-8 pb-10 text-[14px] rounded-2xl shadow-lg "
            ref={dropdownRef} >
            <ul className="flex flex-col gap-4 font-medium">
              {subAdmins.map((admin, index) => (
                <Link 
                  key={index}
                  href={admin.href}
                  className="hover:bg-[#FFA947] pr-5 pl-1 py-2 rounded-lg transition-all duration-300"
                  onClick={() => setIsDropdownopen(false)}
                >
                  Sub Admin - {admin.name}
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
