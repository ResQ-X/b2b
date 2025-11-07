"use client";
import { AccountService } from "@/services/account.service";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/account";
import AddUserModal from "@/components/AddUserModal";

type SubAdmin = {
  id: string;
  name: string | null;
  company_name: string | null;
  email: string;
  phone: string | null;
  role: string;
  created_at?: string;
};

export default function Page() {
  const [subs, setSubs] = useState<SubAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchSubs() {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosInstance.get<SubAdmin[]>("/super/team");
        const onlySubs = (res.data || []).filter(
          (u) => (u.role || "").toUpperCase() === "SUB"
        );

        // Sort newest first
        onlySubs.sort((a, b) => {
          const da = a.created_at ? new Date(a.created_at).getTime() : 0;
          const db = b.created_at ? new Date(b.created_at).getTime() : 0;
          return db - da;
        });

        setSubs(onlySubs);
      } catch (e: any) {
        console.error("Failed to load sub-admins:", e);
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          "Failed to load sub-admins.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    fetchSubs();
  }, []);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await AccountService.getProfile();

        // Extract user data from the nested response structure
        const userData = response.data || response;
        setUser(userData as unknown as User);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  console.log(user);

  if (loading) {
    return (
      <div className="p-8 text-white/70 text-center">Loading sub-admins…</div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-400 text-center">Error: {error}</div>;
  }

  if (subs.length === 0) {
    return (
      <div className="p-8 text-white/80 text-center">No Sub-Admins yet.</div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-white text-2xl font-semibold mb-6">
        Sub-Admins ({subs.length})
      </h1>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#2D2A27]">
        <table className="min-w-full text-sm text-left text-white">
          <thead className="bg-[#1F1E1C] text-white/80 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((u) => (
              <tr
                key={u.id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="px-6 py-4 font-medium">
                  {u.name || u.company_name || "Unnamed"}
                </td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">{u.phone || "—"}</td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/70">
                  {u.created_at
                    ? new Date(u.created_at).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(user as { role?: string } | null)?.role === "SUPER" && (
        <Button
          type="button"
          variant="light"
          className="w-auto h-[48px] lg:h-[52px] px-8 mt-5"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          Add User
        </Button>
      )}

      <AddUserModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
