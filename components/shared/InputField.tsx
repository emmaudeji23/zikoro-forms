
"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Field } from "./Field"
import { LucideIcon } from "lucide-react"

interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  error?: string
  icon?: LucideIcon
  required?: boolean
  containerStyle?:string
}

export const InputField = ({
  label,
  description,
  error,
  icon: Icon,
  required,
  className,
  containerStyle,
  ...props
}: InputFieldProps) => {
  return (
    <Field
      label={label}
      description={description}
      error={error}
      required={required}
      htmlFor={props.name}
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded border   px-3 h-11",
          "transition-all duration-200",
          "focus-within:border-primary",
          error && "border-destructive",
          containerStyle
        )}
      >
        {Icon && (
          <Icon className="w-4 h-4 text-muted-foreground" />
        )}

        <Input
          {...props}
          id={props.name}
          className={cn(
            "border-none rounded-none bg-transparent dark:bg-transparent  focus-visible:ring-0 p-0 h-auto",
            className
          )}
        />
      </div>
    </Field>
  )
}