import { OrderTabs } from "@/components/orders/order-tabs";
import { OrdersTable } from "@/components/orders/orders-table";
// import { MonthlyOverview } from "@/components/orders/monthly-overview"
// import { OrderTrend } from "@/components/orders/order-trend"

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[32px] text-dark-brown font-bold mb-4">
          Order Management
        </h1>
        <OrderTabs />
      </div>

      <OrdersTable />
      {/* <MonthlyOverview />
      <OrderTrend /> */}

      <footer className="text-center text-sm text-gray-500">
        © 2025 ResQ-X. All Rights Reserved.
      </footer>
    </div>
  );
}
