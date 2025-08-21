"use client";
import React from "react";

export default function Search({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`w-[450px] relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <svg
          className="h-4 w-4 text-[#A89887]"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>

      <input
        type="search"
        className="block w-full rounded-[19px] border border-[#5E5E5E] bg-[#242220] p-4 pl-10 text-sm font-medium placeholder-[#A1A1AA] text-white outline-none"
        placeholder="Search ..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search"
      />
    </div>
  );
}
