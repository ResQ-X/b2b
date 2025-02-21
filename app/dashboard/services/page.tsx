import { ServiceTabs } from "@/components/services/service-tabs"
import { ServicesTable } from "@/components/services/services-table"

export default function ServicesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[32px] text-dark-brown font-bold mb-4">Service Management</h1>
        <ServiceTabs />
      </div>

      <ServicesTable />

      <footer className="text-center text-sm text-gray-500">© 2025 ResQ-X. All Rights Reserved.</footer>
    </div>
  )
}