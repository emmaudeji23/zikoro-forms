"use client";

import { useState } from "react";
import { Label } from "../ui/label";
import { CheckboxItem } from "./CheckboxItem";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label?: string;
  value?: string[];
  onChange: (val: string[]) => void;
  options: Option[];
  required?: boolean;
  hasOthersOption?:boolean
};

const OTHER_KEY = "__other__";

export const MultiSelectInlineField = ({
  label,
  value = [],
  onChange,
  options,
  required,
  hasOthersOption
}: Props) => {
  const [otherText, setOtherText] = useState("");

  const isOtherChecked = value.includes(OTHER_KEY);

  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const handleOtherToggle = () => {
    if (isOtherChecked) {
      // remove other
      onChange(value.filter((v) => v !== OTHER_KEY));
      setOtherText("");
    } else {
      onChange([...value, OTHER_KEY]);
    }
  };

  const handleOtherChange = (text: string) => {
    setOtherText(text);

    // replace OTHER_KEY with actual value
    const filtered = value.filter((v) => v !== OTHER_KEY && v !== otherText);

    if (text.trim()) {
      onChange([...filtered, text]);
    } else {
      onChange(filtered);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium flex items-center gap-3 mb-2">
          {label}
          {required && <span className="text-destructive">*</span>}
          <hr className="w-full" />
        </Label>
      )}

      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const checked = value.includes(opt.value);

          return (
            <CheckboxItem
              key={opt.value}
              label={opt.label}
              checked={checked}
              onChange={() => toggle(opt.value)}
            />
          );
        })}

        {/* ✅ Others Row */}
        {hasOthersOption&&<label className="flex items-center gap-2">
          {/* BOX */}
          <div
            onClick={handleOtherToggle}
            className="w-4 h-4 border border-gray-700 flex items-center justify-center"
          >
            {isOtherChecked && <div className="w-2 h-2 bg-black" />}
          </div>

          {/* INPUT LINE */}
          <input
            type="text"
            value={otherText}
            onChange={(e) => handleOtherChange(e.target.value)}
            placeholder="Others..."
            disabled={!isOtherChecked}
            className="border-b border-gray-700 outline-none text-sm flex-1 bg-transparent disabled:opacity-50"
          />
        </label>}
      </div>
    </div>
  );
};