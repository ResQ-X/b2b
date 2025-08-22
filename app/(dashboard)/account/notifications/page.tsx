"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotificationsPage() {
  const [email, setEmail] = useState(false);
  const [sms, setSms] = useState(true);
  const [push, setPush] = useState(true);

  return (
    <div className="min-h-screen text-[#FFFFFF]">
      <div className="w-full lg:w-3/5 px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Header (arrow col + title col) */}
        <div className="grid grid-cols-[32px_1fr] items-center gap-2">
          <Link
            href="/account"
            className="h-8 w-8 inline-flex items-center justify-center rounded-md text-white/80 hover:text-white"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <h1 className="text-lg font-semibold">Notifications</h1>

          {/* Divider under title only */}
          <div className="col-start-2 mt-3 h-[2px] w-full bg-[#777777]" />
        </div>

        {/* Body aligned under title */}
        <div className="mt-6 grid grid-cols-[32px_1fr] gap-y-4">
          <div /> {/* spacer for arrow col */}
          <div className="space-y-4">
            {/* Notification Item */}
            <div className="flex items-center justify-between rounded-xl bg-[#3B3835] px-5 py-6">
              <span className="text-sm font-medium">Email Notifications</span>
              <button
                onClick={() => setEmail(!email)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  email ? "bg-orange" : "bg-gray-400"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    email ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[#3B3835] px-5 py-6">
              <span className="text-sm font-medium">SMS Alerts</span>
              <button
                onClick={() => setSms(!sms)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  sms ? "bg-orange" : "bg-gray-400"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sms ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[#3B3835] px-5 py-6">
              <span className="text-sm font-medium">Push Notifications</span>
              <button
                onClick={() => setPush(!push)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  push ? "bg-orange" : "bg-gray-400"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    push ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
