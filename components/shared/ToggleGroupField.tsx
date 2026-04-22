"use client"

import { Field } from "./Field"

export const ToggleGroupField = ({
  label,
  value,
  onChange,
  options,
  error,
}: any) => {
  return (
    <Field label={label} error={error}>
      <div className="flex gap-2">
        {options.map((opt: any) => {
          const active = value === opt.value

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`
                px-3 h-10 rounded-md text-sm border
                transition-all duration-150

                ${
                  active
                    ? "border-primary text-primary bg-primary/5"
                    : "border-border text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </Field>
  )
}