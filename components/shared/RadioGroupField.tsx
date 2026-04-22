"use client"

import { Field } from "./Field"

export const RadioGroupField = ({
  label,
  options,
  value,
  onChange,
  error,
}: any) => {
  return (
    <Field label={label} error={error}>
      <div className="flex gap-3 flex-wrap">
        {options.map((opt: any) => {
          const active = value === opt.value

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`
                px-4 h-10 rounded-full border text-sm
                transition-all duration-200

                ${
                  active
                    ? "border-primary bg-primary text-white"
                    : "border-muted-foreground/30 text-muted-foreground"
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