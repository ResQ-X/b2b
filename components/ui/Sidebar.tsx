"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";
import * as Icons from "lucide-react";
import React, { useState } from "react";

import LogoutModal from "@/components/ui/LogoutModal";
import { SIDEBAR_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    // AuthService.logout();
    router.push("/login");
  };

  return (
    <div className="w-[242px] h-auto bg-[#3B3835] gap-4 flex flex-col py-3">
      <div className="w-full h-[93px]">
        <div className="flex justify-end">
          <button onClick={onClose} className="md:hidden p-2 rounded-md">
            <Icons.X className="w-6 h-6 text-[#fff]" />
          </button>
        </div>

        <Image
          src="/sidebar-logo.svg"
          alt="RESQ-X Logo"
          width={130}
          height={30}
          className="ml-10 mt-8"
        />
      </div>

      <nav className="flex-1 flex flex-col mt-6 px-4">
        {[
          ["Dashboard"],
          ["Fuel Delivery", "Maintenance", "Emergency Service"],
          ["Fleet Management", "Schedule"],
          ["Billing", "Account"],
        ].map((group, gi, groups) => (
          <div key={gi} className="flex flex-col gap-[12px]">
            {group.map((title) => {
              const item = SIDEBAR_ITEMS.find((i) => i.title === title)!;
              const Icon = Icons[
                item.icon as keyof typeof Icons
              ] as React.ElementType;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex w-full max-w-[193px] h-[50px] items-center gap-3 text-[16px] font-semibold px-3 py-2 rounded-[10px] mb-1 relative group",
                    isActive
                      ? "bg-[#FFFFFF] text-orange"
                      : "text-[#C6C6C6] hover:bg-orange/10"
                  )}
                >
                  <div className="absolute -left-[22px] top-0 w-[9px] h-full rounded-r-full transition-all" />
                  <Icon className="h-5 w-5" />
                  <span className="whitespace-nowrap text-[14px]">
                    {item.title}
                  </span>
                </Link>
              );
            })}

            {gi < groups.length - 1 && (
              <hr className="my-3 border-t border-white/10" />
            )}
          </div>
        ))}
      </nav>

      <div className="p-4">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 px-3 py-2 w-full text-[#C6C6C6] hover:bg-orange/10 rounded-[10px]"
        >
          <LogOut className="h-5 w-5" />
          <span>Log Out</span>
        </button>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
