"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/CustomInput";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axios";
import { toast } from "react-toastify";

/* ===================== Types ===================== */

export type InviteUserForm = {
  email: string;
};

type ValidationErrors = {
  email?: string;
};

/* ===================== Small UI helpers ===================== */

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-white/80">{label}</Label>
      {children}
      {error && <p className="text-sm text-rose-400 mt-1">{error}</p>}
    </div>
  );
}

/* ===================== Main Component ===================== */

export default function AddUserModal({
  open,
  onOpenChange,
  initialValues,
  title = "Invite Sub-Admin",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<InviteUserForm>;
  title?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [form, setForm] = useState<InviteUserForm>({
    email: initialValues?.email || "",
  });

  /* -------- Validation (email only) -------- */
  const validateForm = (): boolean => {
    const next: ValidationErrors = {};
    if (!form.email?.trim()) {
      next.email = "Please enter email address";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      next.email = "Please enter a valid email address";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const clearError = (field: keyof ValidationErrors) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  /* -------- Sync on open -------- */
  useEffect(() => {
    if (open) {
      setForm({
        email: initialValues?.email || "",
      });
      setErrors({});
    }
  }, [open, initialValues]);

  const canSubmit = useMemo(() => !!form.email?.trim(), [form.email]);

  /* -------- Submit: invite subadmin (email only) -------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await axiosInstance.post("/super/team/invite", {
        email: form.email.trim(),
      });
      toast.success("Invitation sent successfully.");
      onOpenChange(false);

      // reset
      setForm({ email: "" });
      setErrors({});
    } catch (error: any) {
      console.error("Invite error:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to send invitation.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-11/12
          lg:max-w-[640px]
          rounded-[28px]
          border border-white/10
          bg-[#1F1E1C]
          text-white
          p-7 md:p-9
          max-h-[90vh]
          overflow-y-auto
          overscroll-contain
        "
      >
        <DialogHeader className="mb-2">
          <DialogTitle className="text-[28px] leading-8 font-semibold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (only field) */}
          <Field label="Email Address" error={errors.email}>
            <CustomInput
              type="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, email: e.target.value }));
                clearError("email");
              }}
              className="h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
            />
          </Field>

          <DialogFooter className="mt-4 flex w-full gap-4">
            <Button
              type="submit"
              variant="orange"
              disabled={!canSubmit || submitting}
              className="flex-1 w-full lg:w-[254px] h-[58px] lg:h-[60px] disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Invite"}
            </Button>

            <Button
              type="button"
              variant="black"
              onClick={() => onOpenChange(false)}
              className="flex-1 w-full lg:w-[254px] h-[58px] lg:h-[60px]"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
