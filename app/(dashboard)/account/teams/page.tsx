"use client";
import { AccountService } from "@/services/account.service";
import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/account";
import AddUserModal from "@/components/AddUserModal";
import PasswordModal from "@/components/account/PasswordModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, KeyRound } from "lucide-react";
import { toast } from "react-toastify";

type SubAdmin = {
  id: string;
  name: string | null;
  company_name: string | null;
  email: string;
  phone: string | null;
  role: string;
  created_at?: string;
};

type PasswordAction = {
  type: "delete" | "reset";
  userId: string;
  userName: string;
} | null;

export default function Page() {
  const [subs, setSubs] = useState<SubAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordAction, setPasswordAction] = useState<PasswordAction>(null);

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

  const initiateDeleteAccount = (userId: string, userName: string) => {
    setPasswordAction({ type: "delete", userId, userName });
  };

  const initiateResetPassword = (userId: string, userName: string) => {
    setPasswordAction({ type: "reset", userId, userName });
  };

  const handlePasswordConfirm = async (password: string) => {
    if (!passwordAction) return;

    try {
      if (passwordAction.type === "delete") {
        await axiosInstance.delete(`/super/team/${passwordAction.userId}`, {
          data: { password },
        });

        // Remove the deleted user from the list
        setSubs((prev) =>
          prev.filter((sub) => sub.id !== passwordAction.userId)
        );
        toast.success("Account deleted successfully");
      } else if (passwordAction.type === "reset") {
        await axiosInstance.post(
          `/super/team/${passwordAction.userId}/reset-password`,
          { tempPassword: password }
        );
        toast.success("Password reset successfully");
      }

      setPasswordAction(null);
    } catch (e: any) {
      console.error(`Failed to ${passwordAction.type} account:`, e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        `Failed to ${passwordAction.type} account.`;
      toast.error(msg);
      throw e; // Re-throw to keep modal open on error
    }
  };

  console.log(user);

  if (loading) {
    return (
      <div className="p-8 text-white/70 text-center">Loading sub-admins…</div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-400 text-center">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-white text-2xl font-semibold mb-6">
        Sub-Admins ({subs.length})
      </h1>

      {subs.length === 0 ? (
        <div className="p-8 text-white/80 text-center">No Sub-Admins yet.</div>
      ) : (
        <div className="overflow-visible rounded-2xl border border-white/10 bg-[#2D2A27]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-white">
              <thead className="bg-[#1F1E1C] text-white/80 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">Actions</th>
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
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-white/10 rounded-lg transition disabled:opacity-50">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#2D2A27] border-white/10"
                        >
                          <DropdownMenuItem
                            className="text-white hover:bg-white/10 cursor-pointer"
                            onClick={() =>
                              initiateResetPassword(
                                u.id,
                                u.name || u.company_name || "this user"
                              )
                            }
                          >
                            <KeyRound className="w-4 h-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-400 hover:bg-red-400/10 cursor-pointer"
                            onClick={() =>
                              initiateDeleteAccount(
                                u.id,
                                u.name || u.company_name || "this user"
                              )
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Button
        type="button"
        variant="light"
        className="w-auto h-[48px] lg:h-[52px] px-8 mt-5"
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        Add User
      </Button>

      <AddUserModal open={isModalOpen} onOpenChange={setIsModalOpen} />

      <PasswordModal
        isOpen={!!passwordAction}
        onClose={() => setPasswordAction(null)}
        onConfirm={handlePasswordConfirm}
        title={
          passwordAction?.type === "delete"
            ? "Delete Account"
            : "Reset Password"
        }
        description={
          passwordAction?.type === "delete"
            ? `Are you sure you want to delete ${passwordAction?.userName}'s account? Enter your password to confirm this action.`
            : `Enter your password to confirm password reset for ${passwordAction?.userName}.`
        }
        confirmButtonText={
          passwordAction?.type === "delete"
            ? "Delete Account"
            : "Reset Password"
        }
        isDangerous={passwordAction?.type === "delete"}
      />
    </div>
  );
}
