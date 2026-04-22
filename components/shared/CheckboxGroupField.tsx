"use client";

import React from "react";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label?: string;
  value?: string[];
  onChange: (val: string[]) => void;
  options: Option[];
  direction?: "row" | "column";
};

export const CheckboxGroupField = ({
  label,
  value = [],
  onChange,
  options,
  direction = "column",
}: Props) => {
  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className="space-y-2">
      {label && <p className="font-medium text-sm">{label}</p>}

      <div
        className={cn(
          "flex gap-3",
          direction === "row" ? "flex-wrap" : "flex-col"
        )}
      >
        {options.map((opt) => {
          const checked = value.includes(opt.value);

          return (
            <label
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              {/* BOX */}
              <div className="w-4 h-4 border border-gray-700 flex items-center justify-center">
                {checked && <div className="w-2 h-2 bg-black" />}
              </div>

              {/* LABEL */}
              <span className="text-sm">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};


