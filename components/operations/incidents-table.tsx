"use client";

// import { useState } from "react"
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Incident } from "@/types/operations";

const statusStyles = {
  "In Progress": "bg-[#fcbe2d]",
  Canceled: "bg-[#f00]",
  Resolved: "bg-[#00B69B]",
  Unassigned: "bg-[#535353] bg-opacity-30",
};

interface IncidentsTableProps {
  incidents: Incident[];
  onIncidentSelect: (incident: Incident) => void;
}

export function IncidentsTable({
  incidents,
  onIncidentSelect,
}: IncidentsTableProps) {
  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex items-start flex-col mb-6">
        <h2 className="text-[24px] pb-2 font-semibold">Live Incident</h2>
        <div className="flex gap-1 items-center">
          <div className="h-[5px] w-[5px] rounded-full bg-blue-600" />
          {/* <p className="text-sm text-dark-brown">January 12th</p> */}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Incident ID</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date - Time</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Responder ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {incidents.map((incident) => (
            <TableRow
              key={incident.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onIncidentSelect(incident)}
            >
              <TableCell>{incident.id}</TableCell>
              <TableCell>{incident.location}</TableCell>
              <TableCell>{incident.dateTime}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    incident.priority === "High"
                      ? "bg-red-50 text-red-600"
                      : incident.priority === "Medium"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-green-50 text-green-600"
                  )}
                >
                  {incident.priority}
                </span>
              </TableCell>
              <TableCell>{incident.responderId}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 gap-3 rounded-full text-xs font-medium"
                  )}
                >
                  <div
                    className={`w-[12px] h-[12px] rounded-full ${
                      statusStyles[incident.status]
                    }`}
                  />
                  {incident.status}
                </span>
              </TableCell>
              <TableCell>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6">
        <p className="text-sm text-lighter mb-4">
          Note: Click on incident to view on map
        </p>
      </div>
      <div className="mt-6 w-full flex items-center justify-center">
        <Button className="w-full text-[14px] rounded-[14px] font-medium max-w-[168px] mx-auto bg-orange hover:bg-orange/90">
          View All
        </Button>
      </div>
    </div>
  );
}
