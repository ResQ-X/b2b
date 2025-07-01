"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CreateOrderDialog } from "./create-order/create-order-dialog";

type Props = {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
};

const tabs = [
  { id: "ALL", label: "All Orders" },
  { id: "NEW", label: "New" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "RESOLVED", label: "Resolved" },
  { id: "CANCELLED", label: "Cancelled" },
];

export function OrderTabs({ activeTab, setActiveTab }: Props) {
  // const [activeTab, setActiveTab] = useState("all");
  // const [addOrderModalOpen, setAddOrderModalOpen] = useState(false);

  // console.log("Active Tab:", addOrderModalOpen);

  // const openAddOrderModal = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   setAddOrderModalOpen(true);
  // };

  // const closeAddOrderModal = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   setAddOrderModalOpen(false);
  // };

  console.log("activeTab tabs component", activeTab);

  const [createOrderDialogOpen, setCreateOrderDialogOpen] = useState(false);

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
      <button
        onClick={() => setCreateOrderDialogOpen(true)}
        className="bg-orange text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-orange/90"
      >
        Add New Order
      </button>

      <CreateOrderDialog
        open={createOrderDialogOpen}
        onOpenChange={setCreateOrderDialogOpen}
      />
    </div>
  );
}
