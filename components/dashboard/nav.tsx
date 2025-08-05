"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react"; // hamburger icon
// import { Bell } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth.context";

interface DashboardNavProps {
  onMenuClick?: () => void;
}

export function DashboardNav({ onMenuClick }: DashboardNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  // const getPageTitle = (path: string) => {
  //   const titleMap: Record<string, string> = {
  //     "/dashboard": "Dashboard",
  //     "/dashboard/orders": "Orders Management",
  //     "/dashboard/services": "Services Management",
  //     "/dashboard/staff": "Staff Management",
  //     "/dashboard/resqx-service": "ResQx Service",
  //     "/dashboard/tracking": "Live Tracking",
  //   };

  //   return titleMap[path] || "Page";
  // };

  const getPageTitle = (path: string) => {
    if (path.startsWith("/dashboard/orders")) return "Orders Management";
    if (path.startsWith("/dashboard/services")) return "Services Management";
    if (path.startsWith("/dashboard/staff")) return "Staff Management";
    if (path.startsWith("/dashboard/resqx-service")) return "ResQx Service";
    if (path.startsWith("/dashboard/tracking")) return "Live Tracking";
    if (path === "/dashboard") return "Dashboard";

    // fallback: turn last segment into Title Case
    const segments = path.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="h-16 bg-white px-4 sm:px-6 md:px-8 flex items-center justify-between border-b">
      {/* Hamburger (Mobile only) */}
      <div className="md:hidden">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Logo or Search Placeholder */}
      <div className="flex-1 flex justify-center md:justify-start">
        <span className="text-lg font-bold text-dark-brown">
          {getPageTitle(pathname)}
        </span>
        {/* Optional: insert search input here for md+ screens */}
      </div>

      {/* Right side user info */}
      <div className="flex items-center gap-4">
        {/* Optional notification button */}
        {/* 
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange text-[10px] text-white flex items-center justify-center">
            6
          </span>
        </Button> 
        */}

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-orange text-white flex items-center justify-center text-sm font-medium">
            EA
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm text-dark-brown font-medium truncate">
              {user?.name}
            </p>
            <p className="text-xs text-[#565656] truncate">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
