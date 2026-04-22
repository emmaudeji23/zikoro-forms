"use client"

import * as React from "react"
import { format, parseISO, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Field } from "./Field"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerFieldProps {
  label?: string
  name: string
  value?: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  description?: string
}

export const DatePickerField = ({
  label,
  name,
  value,
  onChange,
  error,
  required,
  description,
}: DatePickerFieldProps) => {
  // ✅ Parse string → Date
  const selectedDate = value
    ? isValid(parseISO(value))
      ? parseISO(value)
      : undefined
    : undefined

  /* ---------- SELECT FROM CALENDAR ---------- */
  const handleSelect = (date?: Date) => {
    if (!date) return
    onChange(format(date, "yyyy-MM-dd"))
  }

  /* ---------- MANUAL INPUT ---------- */
  const handleManualInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange(e.target.value)
  }

  return (
    <Field
      label={label}
      description={description}
      error={error}
      required={required}
      htmlFor={name}
    >
      <Popover >
        <div className="relative">
          <div
            className={cn(
              "flex items-center gap-2 rounded border px-3 h-11",
              "transition-all duration-200",
              "focus-within:border-primary",
              error && "border-destructive"
            )}
          >
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />

            {/* INPUT */}
            <Input
              id={name}
              type="text"
              placeholder="YYYY-MM-DD"
              value={value || ""}
              onChange={handleManualInput}
              className="border-none bg-transparent focus-visible:ring-0 p-0 h-auto"
            />

            {/* ICON TRIGGER */}
            <PopoverTrigger asChild>
              <button
                type="button"
                className="ml-auto text-muted-foreground hover:text-foreground transition"
              >
                <CalendarIcon className="w-4 h-4" />
              </button>
            </PopoverTrigger>
          </div>

          {/* CALENDAR */}
          <PopoverContent
            className="w-auto p-0 overflow-hidden"
            align="end"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              captionLayout="dropdown"
              className="sm:w-72 "
            />
          </PopoverContent>
        </div>
      </Popover>
    </Field>
  )
}
