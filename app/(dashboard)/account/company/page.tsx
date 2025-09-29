"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Loader from "@/components/ui/Loader";
import Link from "next/link";
import { FieldRow } from "@/components/account/FieldRow";
import { Button } from "@/components/ui/button";
import { AccountService } from "@/services/account.service";
import type { User } from "@/types/account";

export default function CompanyInformationPage() {
  // User data state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Company info state
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [cac, setCac] = useState("");

  // Primary contact state
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await AccountService.getProfile();

        // Extract user data from the nested response structure
        const userData = response.data || response;
        setUser(userData);

        // Populate form fields with user data
        setCompanyName(userData.company_name || "");
        setCompanyAddress(userData.company_address || "");
        setTaxId(userData.tax_id || "");
        setCac(userData.cac || "");
        setContactName(userData.name || "");
        setEmail(userData.email || "");
        setPhone(userData.phone || "");
        setCompanyEmail(userData.company_email || "");
        setCompanyPhone(userData.company_phone || "");
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle form submission
  const handleUpdateDetails = async () => {
    if (!user) return;

    try {
      setUpdating(true);
      setError(null);

      const updateData = {
        name: contactName,
        company_name: companyName,
        company_address: companyAddress,
        tax_id: taxId,
        cac: cac,
        email: email,
        company_email: companyEmail,
        phone: phone,
        company_phone: companyPhone,
      };

      const response = await AccountService.updateProfile(updateData);

      if (response.success) {
        // Update local user state with updated data
        // Handle nested response structure for update as well
        const updatedUserData = response.user || response.data;
        if (updatedUserData) {
          setUser(updatedUserData);
        }
        // You might want to show a success message here
        console.log("Profile updated successfully:", response.message);

        // Optionally redirect or show success notification
        // router.push("/account") or show toast notification
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // Show loading state
  if (loading) {
    return <Loader content="Loading the Account details....." />;
  }

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

        {/* Error message */}
        {error && (
          <div className="mt-4 grid grid-cols-[32px_1fr] gap-2">
            <div /> {/* spacer */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-red-400 text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Body aligned under title (skip arrow column with a spacer) */}
        <div className="mt-6 grid grid-cols-[32px_1fr] gap-y-6">
          <div /> {/* spacer */}
          {/* Company Information Section */}
          <div className="space-y-6">
            <FieldRow
              label="Company Name"
              value={companyName}
              onChange={setCompanyName}
              disabled={updating}
            />

            <FieldRow
              label="Company's Address"
              value={companyAddress}
              onChange={setCompanyAddress}
              disabled={updating}
            />

            <FieldRow
              label="Tax ID"
              value={taxId}
              onChange={setTaxId}
              disabled={updating}
              optional
            />

            <FieldRow
              label="CAC Number"
              value={cac}
              onChange={setCac}
              disabled={updating}
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
              disabled={updating}
            />

            <FieldRow
              label="Email Address"
              value={email}
              onChange={setEmail}
              disabled={updating}
            />

            <FieldRow
              label="Phone Number"
              value={phone}
              onChange={setPhone}
              disabled={updating}
            />

            <FieldRow
              label="Company Email"
              value={companyEmail}
              onChange={setCompanyEmail}
              disabled={updating}
            />

            <FieldRow
              label="Company Phone"
              value={companyPhone}
              onChange={setCompanyPhone}
              disabled={updating}
            />
          </div>
          <div /> {/* spacer */}
          {/* CTA */}
          <div className="mt-2">
            <Button
              type="button"
              variant="orange"
              className="w-auto h-[48px] lg:h-[52px]"
              onClick={handleUpdateDetails}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Details"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
