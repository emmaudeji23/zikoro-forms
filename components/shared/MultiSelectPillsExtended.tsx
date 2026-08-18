"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { CheckboxItem } from "./CheckboxItem";
import { Field } from "./Field";

interface Option {
  label: string;
  value: string | boolean | number;
}

interface MultiSelectPillsExtendedProps {
  label?: string;
  value?: (string | boolean | number)[];
  onChange: (value: (string | boolean | number)[]) => void;
  options: Option[];
  required?: boolean;
  className?: string;
  itemsStyle?: string;
  containerStyle?: string;
  inputStyle?: string;
  inputContainerStyle?: string;

  allowOther?: boolean;
  otherLabel?: string;
  otherPlaceholder?: string;
}

export function MultiSelectPillsExtended({
  label,
  value = [],
  onChange,
  options,
  required,
  className,
  itemsStyle,
  containerStyle,
  allowOther = false,
  otherLabel = "Other",
  otherPlaceholder = "Please specify...",
  inputStyle,
  inputContainerStyle,
}: MultiSelectPillsExtendedProps) {
  const [otherValue, setOtherValue] = useState("");

  /**
   * Determine whether a value belongs to one of the predefined options.
   */
  const isOptionValue = (val: string | boolean | number) =>
    options.some((option) => option.value === val);

  /**
   * Find any value that isn't one of the predefined options.
   * That value represents the "Other" input.
   */
  const otherValueFromSelection = useMemo(() => {
    if (!allowOther) return undefined;

    return value.find((val) => !isOptionValue(val));
  }, [value, options, allowOther]);

  const isOtherSelected =
    allowOther && otherValueFromSelection !== undefined;

  /**
   * Keep the local input synchronized with the value supplied
   * by the parent/form.
   */
  useEffect(() => {
    if (
      isOtherSelected &&
      typeof otherValueFromSelection === "string" &&
      otherValueFromSelection !== otherValue
    ) {
      setOtherValue(otherValueFromSelection);
    }
  }, [otherValueFromSelection, isOtherSelected, otherValue]);

  /**
   * Toggle a predefined option.
   */
  const toggle = (optionValue: string | boolean | number) => {
    const exists = value.some((val) => val === optionValue);

    if (exists) {
      onChange(value.filter((val) => val !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  /**
   * Remove the current "Other" value from the selection.
   */
  const removeOtherValue = () => {
    onChange(value.filter((val) => isOptionValue(val)));
  };

  /**
   * Select "Other".
   */
  const selectOther = () => {
    if (isOtherSelected) {
      removeOtherValue();
      return;
    }

    onChange([
      ...value,
      otherValue,
    ]);
  };

  /**
   * Update the custom "Other" value.
   */
  const updateOtherValue = (newValue: string) => {
    setOtherValue(newValue);

    const predefinedValues = value.filter((val) => isOptionValue(val));

    onChange([
      ...predefinedValues,
      newValue,
    ]);
  };

  return (
    <Field containerStyle={containerStyle}>
      <div className={cn(className)}>
        {label && (
          <Label className="mb-2 flex items-center gap-2 text-sm font-medium">
            <span>{label}</span>

            {required && (
              <span className="text-destructive">*</span>
            )}
          </Label>
        )}

        <div className={cn("flex flex-wrap gap-2", itemsStyle)}>
          {options.map((opt) => {
            const checked = value.some(
              (val) => val === opt.value
            );

            return (
              <CheckboxItem
                key={String(opt.value)}
                label={opt.label}
                checked={checked}
                onChange={() => toggle(opt.value)}
              />
            );
          })}

          {allowOther && (
            <div className={cn("flex items-center gap-2", inputContainerStyle)}>
              <CheckboxItem
                label={otherLabel}
                checked={isOtherSelected}
                onChange={selectOther}
              />

              <input
                className={cn("flex-1 border-b border-muted-foreground bg-transparent focus:outline-none shadow-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50", inputStyle)}
                placeholder={otherPlaceholder}
                disabled={!isOtherSelected}
                value={otherValue}
                onFocus={() => {
                  if (!isOtherSelected) {
                    selectOther();
                  }
                }}
                onChange={(e) => {
                  updateOtherValue(e.target.value);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Field>
  );
}