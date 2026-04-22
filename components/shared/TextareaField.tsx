"use client"

import { Textarea } from "@/components/ui/textarea"
import { Field } from "./Field"
import { cn } from "@/lib/utils"

export const TextareaField = ({
  label,
  description,
  error,
  required,
  ...props
}: any) => {
  return (
    <Field
      label={label}
      description={description}
      error={error}
      required={required}
      htmlFor={props.name}
    >
      <Textarea
        {...props}
        id={props.name}
        className={cn(
          "min-h-[100px] rounded",
          "border  bg-transparent dark:bg-transparent focus-visible:border-primary focus-visible:ring-0 p-2  ",
          "transition-all duration-200",
          
          error && "border-destructive"
        )}
      />
    </Field>
  )
}