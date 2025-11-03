"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/ui/CustomInput";
import { Label } from "@/components/ui/label";

/* ===================== Types ===================== */

export type AddUserForm = {
  name: string;
  email: string;
  contact: string;
  password: string;
  confirmPassword: string;
};

type ValidationErrors = {
  name?: string;
  email?: string;
  contact?: string;
  password?: string;
  confirmPassword?: string;
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
  onSubmit,
  initialValues,
  title = "Add New User",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddUserForm) => Promise<void> | void;
  initialValues?: Partial<AddUserForm>;
  title?: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [form, setForm] = useState<AddUserForm>({
    name: initialValues?.name || "",
    email: initialValues?.email || "",
    contact: initialValues?.contact || "",
    password: initialValues?.password || "",
    confirmPassword: initialValues?.confirmPassword || "",
  });

  /* -------- Validation -------- */

  const validateForm = (): boolean => {
    const next: ValidationErrors = {};

    if (!form.name?.trim()) {
      next.name = "Please enter full name";
    }

    if (!form.email?.trim()) {
      next.email = "Please enter email address";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      next.email = "Please enter a valid email address";
    }

    if (!form.contact?.trim()) {
      next.contact = "Please enter contact number";
    }

    if (!form.password) {
      next.password = "Please enter password";
    } else if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }

    if (!form.confirmPassword) {
      next.confirmPassword = "Please confirm password";
    } else if (form.password !== form.confirmPassword) {
      next.confirmPassword = "Passwords do not match";
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

  React.useEffect(() => {
    if (open) {
      setForm({
        name: initialValues?.name || "",
        email: initialValues?.email || "",
        contact: initialValues?.contact || "",
        password: initialValues?.password || "",
        confirmPassword: initialValues?.confirmPassword || "",
      });
      setErrors({});
    }
  }, [open, initialValues]);

  const canSubmit = React.useMemo(
    () =>
      form.name?.trim() &&
      form.email?.trim() &&
      form.contact?.trim() &&
      form.password &&
      form.confirmPassword &&
      form.password === form.confirmPassword,
    [form]
  );

  /* -------- Submit -------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await onSubmit(form);
      onOpenChange(false);
      
      // Reset form
      setForm({
        name: "",
        email: "",
        contact: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
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
          {/* Name */}
          <Field label="Full Name" error={errors.name}>
            <CustomInput
              type="text"
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                clearError("name");
              }}
              className="h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
            />
          </Field>

          {/* Email */}
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

          {/* Contact */}
          <Field label="Contact Number" error={errors.contact}>
            <CustomInput
              type="tel"
              placeholder="Enter phone number"
              value={form.contact}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, contact: e.target.value }));
                clearError("contact");
              }}
              className="h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
            />
          </Field>

          {/* Password */}
          <Field label="Password" error={errors.password}>
            <CustomInput
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, password: e.target.value }));
                clearError("password");
              }}
              className="h-14 rounded-2xl border border-white/10 bg-[#2D2A27] text-white placeholder:text-white/60"
            />
          </Field>

          {/* Confirm Password */}
          <Field label="Confirm Password" error={errors.confirmPassword}>
            <CustomInput
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, confirmPassword: e.target.value }));
                clearError("confirmPassword");
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
              {submitting ? "Saving..." : "Save User"}
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