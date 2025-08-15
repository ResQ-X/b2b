"use client";
import React from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import Search from "@/components/dashboard/Search";
import { useAuth } from "@/contexts/auth.context";

interface DashboardNavProps {
  onMenuClick?: () => void;
}

export function DashboardNav({ onMenuClick }: DashboardNavProps) {
  const { user } = useAuth();

  return (
    <div className="h-20 bg-[#3B3835] px-4 sm:px-6 md:px-8 flex items-center justify-between border-b border-[#474747]">
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
        {/* Show only on md+ screens */}
        <div className="hidden md:block w-full max-w-xs">
          <Search />
        </div>
      </div>
      {/* Right side user info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-8">
          {/* Notification Icon with badge */}
          <div className="relative">
            <div className="flex justify-center items-center bg-[#D8D8D8] w-11 h-11 rounded-full">
              <Image
                src="/notification-bing.svg"
                alt="Notification Avatar"
                width={24}
                height={24}
                className="rounded-full"
              />
            </div>
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#F87171] text-[10px] text-white flex items-center justify-center">
              6
            </span>
          </div>

          {/* User info */}
          <div className="hidden sm:block text-left text-[#FFFFFF]">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-sm font-semibold truncate">Admin</p>
          </div>

          {/* User avatar */}
          <div className="flex justify-center items-center bg-[#D8D8D8] w-11 h-11 rounded-full">
            <Image
              src="/user-round.svg"
              alt="User Avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
