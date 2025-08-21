"use client";
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FieldRow } from "@/components/account/FieldRow";
import { Button } from "@/components/ui/Button";

export default function CompanyInformationPage() {
  // Company info state
  const [companyName, setCompanyName] = useState("EmTech Co");
  const [companyAddress, setCompanyAddress] = useState("#1234567890");
  const [taxId, setTaxId] = useState("#1234567890");

  // Primary contact state
  const [contactName, setContactName] = useState("Sarah Johnson");
  const [email, setEmail] = useState("sarah.johnson@emtech.co");
  const [phone, setPhone] = useState("+234567890");

  return (
    <div className="min-h-screen text-[#FFFFFF]">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Header (32px arrow col + 1fr content col) */}
        <div className="grid grid-cols-[32px_1fr] items-center gap-2">
          <Link
            href="/account"
            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-white/80 hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <h1 className="text-lg font-semibold">Company Information</h1>

          {/* Divider aligned with title only */}
          <div className="col-start-2 mt-3 h-[2px] w-full bg-[#777777]" />
        </div>

        {/* Body aligned under title (skip arrow column with a spacer) */}
        <div className="mt-6 grid grid-cols-[32px_1fr] gap-y-6">
          <div /> {/* spacer */}
          {/* Company Information Section */}
          <div className="space-y-6">
            <FieldRow
              label="Company Name"
              value={companyName}
              onChange={setCompanyName}
            />

            <FieldRow
              label="Company’s Address"
              value={companyAddress}
              onChange={setCompanyAddress}
            />

            <FieldRow
              label="Tax ID"
              value={taxId}
              onChange={setTaxId}
              optional
            />
          </div>
          <div /> {/* spacer */}
          {/* Primary Contact Section header + divider (both aligned with title) */}
          <div>
            <h2 className="text-base font-semibold mb-4">
              Primary Contact Information
            </h2>
            <div className="h-[2px] w-full bg-[#777777] mb-3" />
          </div>
          <div /> {/* spacer */}
          {/* Primary Contact Fields */}
          <div className="space-y-6">
            <FieldRow
              label="Primary Contact Name"
              value={contactName}
              onChange={setContactName}
            />

            <FieldRow label="Email Address" value={email} onChange={setEmail} />

            <FieldRow label="Phone Number" value={phone} onChange={setPhone} />
          </div>
          <div /> {/* spacer */}
          {/* CTA */}
          <div className="mt-2">
            <Button
              type="button"
              className="w-[182px] h-[60px] bg-orange hover:bg-opacity-80 hover:scale-105 transition-all duration-200"
            >
              Add Team Members
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
