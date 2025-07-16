"use client";
import { cn } from "@/lib/utils";

type Props = {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

const tabs = [
  { id: "all", label: "All Admins" },
  { id: "isOnline", label: "Online" },
  { id: "isOffline", label: "Offline" },
  { id: "isVerified", label: "Verified" },
];

export function AdminTabs({ activeTab, setActiveTab }: Props) {
  console.log("activeTab tabs component", activeTab);

  return (
    <div className="w-full flex justify-between">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-orange text-white"
                : "text-[#A89887] border border-[#F2E7DA] hover:bg-orange/10"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
