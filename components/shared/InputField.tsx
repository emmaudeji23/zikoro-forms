
"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Field } from "./Field"
import { LucideIcon } from "lucide-react"
import { Label } from "../ui/label"

interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  icon?: LucideIcon;
  required?: boolean;
  containerStyle?: string;

  variant?: "default" | "underline";
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

export const InputFieldLine = ({
  label,
  description,
  error,
  icon: Icon,
  required,
  className,
  containerStyle = "flex-row gap-2 w-full",
  variant = "default",
  ...props
}: InputFieldProps) => {
  return (
     <div className={cn("flex flex-col gap-1 w-full",)}>
      <div className={cn("flex flex-col gap-1 w-full", containerStyle)}>
        {label && (
          <Label
            htmlFor={props.name}
            className="text-sm shrink-0 font-medium flex items-center gap-1"
          >
            {label}
            {required && (
              <span className="text-destructive">*</span>
            )}
          </Label>
        )}
 
       
          <div className={cn("relative border-b border-muted-foreground w-full focus-within:border-primary",  error &&  "animate-in fade-in border-destructive")}>
          <Input
            {...props}
            id={props.name}
            className={cn(
              "border-none bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto rounded-none dark:bg-transparent",
              className
            )}
          />
        </div>

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
 
  );
};