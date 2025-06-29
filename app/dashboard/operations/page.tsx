"use client";

import { useState } from "react";
import { StatsCards } from "@/components/operations/stats-cards";
import { OperationsMap } from "@/components/operations/operations-map";
import { IncidentsTable } from "@/components/operations/incidents-table";
import { RespondersTable } from "@/components/operations/responders-table";
import { PartnersTable } from "@/components/operations/partners-table";
import type { Incident, Partner, Responder } from "@/types/operations";

const MOCK_STATS = {
  activeResponders: 12,
  activePartners: 8,
  avgResponseTime: "6 Min",
  requestsInProgress: 13,
  changes: {
    activeResponders: "1.2%",
    activePartners: "8.5%",
    avgResponseTime: "4.3%",
    requestsInProgress: "1.8%",
  },
};

const MOCK_INCIDENTS = [
  {
    id: "INC-00123",
    location: "12 Awolowo Way, Ikeja",
    dateTime: "12.01.2025 - 12:53 PM",
    priority: "High",
    responderId: "FR-045",
    status: "In Progress",
    coordinates: { lat: 6.5244, lng: 3.3792 },
  },
  {
    id: "INC-00456",
    location: "5 Admiralty Road, Lekki",
    dateTime: "12.01.2025 - 12:53 PM",
    priority: "Medium",
    responderId: "FR-112",
    status: "Canceled",
    coordinates: { lat: 6.4281, lng: 3.4219 },
  },
  // ... more incidents
] as Incident[];

const MOCK_RESPONDERS = [
  {
    id: "FR-045",
    name: "Daniel Osei",
    status: "On Duty",
    location: "12 Awolowo Way, Ikeja",
    performanceMetrics: {
      avgResponseTime: "10 mins",
      incidentsResolved: 50,
    },
  },
  // ... more responders
] as Responder[];

const MOCK_PARTNERS = [
  {
    id: "FR-045",
    name: "Adebayo Tow Service",
    status: "On Duty",
    vehicles: 5,
    performanceMetrics: {
      avgResponseTime: "10 mins",
      incidentsResolved: 50,
    },
  },
  // ... more partners
] as Partner[];

export default function OperationsPage() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"live" | "status">("live");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Live Operations</h1>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "live"
                ? "bg-orange text-white"
                : "text-[#A89887] border border-[#F2E7DA] hover:bg-orange/10"
            }`}
            onClick={() => setActiveTab("live")}
          >
            Live Activities
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "status"
                ? "bg-orange text-white"
                : "text-gray-600 hover:bg-orange/10"
            }\`}
            className={\`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "status"
                ? "bg-orange text-white"
                : "text-[#A89887] border border-[#F2E7DA] hover:bg-orange/10"
            }`}
            onClick={() => setActiveTab("status")}
          >
            Status Management
          </button>
        </div>
      </div>

      {activeTab === "live" ? (
        <>
          <div className="grid grid-cols-3 gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-orange text-white">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Active Incidents
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-orange/10">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Responder Locations
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-orange/10">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Concentrated Area
            </button>
          </div>

          <OperationsMap
            incidents={MOCK_INCIDENTS}
            selectedIncidentId={selectedIncident?.id}
          />

          <IncidentsTable
            incidents={MOCK_INCIDENTS}
            onIncidentSelect={setSelectedIncident}
          />
        </>
      ) : (
        <>
          <StatsCards stats={MOCK_STATS} />
          <RespondersTable responders={MOCK_RESPONDERS} />
          <PartnersTable partners={MOCK_PARTNERS} />
        </>
      )}

      <footer className="text-center text-sm text-gray-500">
        © 2025 ResQ-X. All Rights Reserved.
      </footer>
    </div>
  );
}
