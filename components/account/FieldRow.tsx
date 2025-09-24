"use client";

import React, { useState } from "react";
import { Pencil, Check, X } from "lucide-react";

type FieldProps = {
  label: string;
  value: string;
  optional?: boolean;
  disabled?: boolean;
  onChange: (v: string) => void;
};

export function FieldRow({
  label,
  value,
  onChange,
  optional,
  disabled = false,
}: FieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => {
    onChange(draft.trim());
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  // Update draft when value changes (useful when parent updates the value)
  React.useEffect(() => {
    if (!editing) {
      setDraft(value);
    }
  }, [value, editing]);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-semibold">{label}</label>
        <div className="flex items-center gap-2">
          {optional && (
            <span className="text-base font-semibold">Optional</span>
          )}
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={disabled}
              className="group inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={save}
                disabled={disabled}
                className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-white hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4" />
                Save
              </button>
              <button
                type="button"
                onClick={cancel}
                disabled={disabled}
                className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs font-semibold text-white/80 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <input
        type="text"
        value={editing ? draft : value}
        onChange={(e) => setDraft(e.target.value)}
        disabled={!editing || disabled}
        className={[
          "block w-full rounded-lg border px-4 py-6 text-sm",
          "bg-[#3B3835] text-white placeholder-white/60",
          "border-[#E2E2E2] focus:outline-none focus:ring-2 focus:ring-white/20",
          "disabled:opacity-90 disabled:cursor-not-allowed",
        ].join(" ")}
        placeholder=""
      />
    </div>
  );
}
