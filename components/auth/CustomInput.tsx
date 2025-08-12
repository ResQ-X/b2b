"use client";

import React from "react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function CustomInput({ label, ...props }: CustomInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full text-[#FFFFFF]">
      {label && (
        <label htmlFor={props.id} className="text-sm font-medium">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full max-w-[500px] bg-[#3B3835]/100 placeholder:text-[#FFFFFF] h-[60px] rounded-[5px] border-none focus:border-none focus:ring-0 outline-none pl-3   ${
          props.className || ""
        }
        `}
      />
    </div>
  );
}
