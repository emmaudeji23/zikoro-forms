"use client"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface FieldProps {
  label?: string
  description?: string
  error?: string
  required?: boolean
  htmlFor?: string
  children: React.ReactNode
}

export const Field = ({
  label,
  description,
  error,
  required,
  htmlFor,
  children,
}: FieldProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      
      {/* Label */}
      {label && (
        <Label
          htmlFor={htmlFor}
          className="text-sm font-medium flex items-center gap-1"
        >
          {label}
          {required && (
            <span className="text-destructive">*</span>
          )}
        </Label>
      )}

      {/* Description */}
      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}

      {/* Input */}
      <div
        className={cn(
          "relative",
          error && "animate-in fade-in"
        )}
      >
        {children}
      </div>

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  )
}