"use client";

import React from "react";

type Props = {
  label: string;
  // checked?: boolean;
  value: string;
  // onCheckChange: (val: boolean) => void;
  onValueChange: (val: string) => void;
  placeholder?: string;
};

export const CheckboxWithInputField = ({
  label,
  // checked = false,
  value = "",
  // onCheckChange,
  onValueChange,
  placeholder,
}: Props) => {
  const ischecked = value.length > 1
  return (
    <div className="flex items-center gap-3">
      {/* CHECKBOX */}
      <div
        onClick={() => onValueChange(value || label)}
        className="w-4 h-4 border border-foreground/30 flex items-center justify-center cursor-pointer"
      >
        {ischecked && <div className="w-2 h-2 bg-primary" />}
      </div>

      {/* LABEL */}
      <span className="text-sm">{label}</span>

      {/* INPUT LINE */}
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder || "Specify..."}
        className="
          flex-1
          border-b border-gray-700
          outline-none
          text-sm
          px-1
          bg-transparent
        "
      />
    </div>
  );
};