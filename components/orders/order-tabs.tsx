"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CreateOrderDialog } from "./create-order/create-order-dialog";

const tabs = [
  { id: "all", label: "All Orders" },
  { id: "new", label: "New" },
  { id: "in-progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
  { id: "canceled", label: "Canceled" },
];

export function OrderTabs() {
  const [activeTab, setActiveTab] = useState("all");
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
