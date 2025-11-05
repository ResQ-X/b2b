"use client";

import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

type Role = "SUPER" | "SUB" | string;

type SubAccount = {
  id: string;
  name: string | null;
  company_name: string | null;
  email: string;
  phone: string | null;
  role: string;
};

type FundRequest = {
  id: string;
  amount: string; // "2000.00"
  status: "PENDING" | "APPROVED" | "DECLINED" | string;
  created_at?: string;
  updated_at?: string;
  sub_account_id?: string;
  super_account_id?: string;
  sub_account?: SubAccount; // present in SUPER endpoint payload
};

type Profile = {
  id: string;
  name: string;
  company_name?: string;
  role?: Role;
};

export default function Page() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<Role>("");
  const [items, setItems] = useState<FundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actId, setActId] = useState<string | null>(null); // action-in-progress id
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  console.log("profile", profile);
  console.log("refreshing", refreshing);

  /* ------------ helpers ------------ */
  const formatAmount = (amt: string | number) => {
    const n = typeof amt === "string" ? parseFloat(amt) : amt;
    if (Number.isNaN(n)) return "₦0.00";
    return n.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleString("en-NG", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const StatusPill = ({ s }: { s: string }) => {
    const base =
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold";
    const cls =
      s === "PENDING"
        ? "bg-yellow-500/15 text-yellow-300 border border-yellow-400/20"
        : s === "APPROVED"
        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/20"
        : s === "DECLINED"
        ? "bg-rose-500/15 text-rose-300 border border-rose-400/20"
        : "bg-white/10 text-white/80 border border-white/10";
    return <span className={`${base} ${cls}`}>{s}</span>;
  };

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1) who am I?
      const profRes = await axiosInstance.get<Profile>("/fleets/profile");
      const r = (profRes?.data as any)?.data?.role || profRes?.data?.role;
      const prof = (profRes?.data as any)?.data ||
        profRes?.data || { role: r ?? "" };
      setProfile(prof);
      setRole((prof.role || "").toUpperCase());

      // 2) fetch list based on role
      if ((prof.role || "").toUpperCase() === "SUPER") {
        const res = await axiosInstance.get<FundRequest[]>(
          "/super/fund-requests"
        );
        setItems(res.data || []);
      } else {
        const res = await axiosInstance.get<FundRequest[]>(
          "/sub/fund-requests"
        );
        setItems(res.data || []);
      }
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Failed to load requests.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const pendingCount = useMemo(
    () => items.filter((x) => x.status === "PENDING").length,
    [items]
  );

  const refresh = async () => {
    setRefreshing(true);
    try {
      if (role === "SUPER") {
        const res = await axiosInstance.get<FundRequest[]>(
          "/super/fund-requests"
        );
        setItems(res.data || []);
      } else {
        const res = await axiosInstance.get<FundRequest[]>(
          "/sub/fund-requests"
        );
        setItems(res.data || []);
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Failed to refresh.";
      toast.error(msg);
    } finally {
      setRefreshing(false);
    }
  };

  /* ------------ actions (SUPER only) ------------ */
  const approve = async (id: string) => {
    setActId(id);
    try {
      // optimistic UI
      setItems((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: "APPROVED" } : x))
      );
      await axiosInstance.post(`/super/fund-requests/${id}/approve`);
      toast.success("Request approved.");
    } catch (e: any) {
      // rollback
      await refresh();
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Failed to approve.";
      toast.error(msg);
    } finally {
      setActId(null);
    }
  };

  const decline = async (id: string) => {
    setActId(id);
    try {
      setItems((prev) =>
        prev.map((x) => (x.id === id ? { ...x, status: "DECLINED" } : x))
      );
      await axiosInstance.post(`/super/fund-requests/${id}/decline`);
      toast.info("Request declined.");
    } catch (e: any) {
      await refresh();
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Failed to decline.";
      toast.error(msg);
    } finally {
      setActId(null);
    }
  };

  /* ------------ UI ------------ */
  if (loading) {
    return (
      <div className="p-8 text-white/70 text-center">Loading requests…</div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400 mb-4">Error: {error}</p>
        <Button variant="orange" onClick={load}>
          Retry
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-white/80 text-center">
        No fund requests found.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-semibold">
          Fund Requests {role ? `— ${role}` : ""}{" "}
          <span className="text-white/60 text-base ml-2">
            (Pending: {pendingCount})
          </span>
        </h1>
        {/* <Button variant="light" onClick={refresh} disabled={refreshing}>
          {refreshing ? "Refreshing…" : "Refresh"}
        </Button> */}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#2D2A27]">
        <table className="min-w-full text-sm text-left text-white">
          <thead className="bg-[#1F1E1C] text-white/80 text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Request ID</th>
              {role === "SUPER" && <th className="px-6 py-3">Sub-Admin</th>}
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created</th>
              {role === "SUPER" && <th className="px-6 py-3">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {items.map((r) => {
              const subName =
                r.sub_account?.name ||
                r.sub_account?.company_name ||
                "Sub Account";

              return (
                <tr
                  key={r.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4 font-mono text-xs md:text-sm">
                    {r.id}
                  </td>

                  {role === "SUPER" && (
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium">{subName}</span>
                        <span className="text-white/60 text-xs">
                          {r.sub_account?.email}
                        </span>
                      </div>
                    </td>
                  )}

                  <td className="px-6 py-4">{formatAmount(r.amount)}</td>

                  <td className="px-6 py-4">
                    <StatusPill s={r.status} />
                  </td>

                  <td className="px-6 py-4 text-white/70">
                    {formatDate(r.created_at)}
                  </td>

                  {role === "SUPER" && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="orange"
                          //   size="sm"
                          disabled={r.status !== "PENDING" || actId === r.id}
                          onClick={() => approve(r.id)}
                        >
                          {actId === r.id ? "..." : "Approve"}
                        </Button>
                        <Button
                          variant="black"
                          //   size="sm"
                          disabled={r.status !== "PENDING" || actId === r.id}
                          onClick={() => decline(r.id)}
                        >
                          {actId === r.id ? "..." : "Decline"}
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
