"use client"

import { Label } from "../ui/label"
import { CheckboxItem } from "./CheckboxItem"
import { Field } from "./Field"

export const MultiSelectPills = ({
  label,
  value = [],
  onChange,
  options,
  required,
}: any) => {
  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v: string) => v !== val))
    } else {
      onChange([...value, val])
    }
  }

  return (
    <Field  >
      {label&&<Label
          htmlFor={label}
          className="text-sm  font-medium flex items-center gap-3 mb-2"
        >
          <label className=" shrink-0 ">{label}</label>
          {required && (
            <span className="text-destructive">*</span>
          )}
          <hr className="w-full "/>
        </Label>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt: any) => {
          const checked = value.includes(opt.value)

 
           
            return (
              <CheckboxItem
                key={opt.value}
                label={opt.label}
                checked={checked}
                onChange={() => toggle(opt.value)}
              />
            );
          })}
    
          
   
 
      </div>
    </Field>
  )
}