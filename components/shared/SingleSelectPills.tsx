"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { CheckboxItem } from "./CheckboxItem";
import { Field } from "./Field";
import { Input } from "../ui/input";

interface Option {
  label: string;
  value: string | boolean | number;
}

interface SingleSelectPillsProps {
  label?: string;
  value?: string | boolean | number | null;
  onChange: (value: string | boolean | number | null) => void;
  options: Option[];
  required?: boolean;
  className?: string;
  itemsStyle?: string;
  containerStyle?: string;


  allowOther?: boolean;
  otherLabel?: string;
  otherPlaceholder?: string;
}

export function SingleSelectPills({
  label,
  value,
  onChange,
  options,
  required,
  className,
  allowOther = false,
  otherLabel = "Other",
  otherPlaceholder = "Please specify...",
  itemsStyle,
  containerStyle 
}: SingleSelectPillsProps) {
  const [otherValue, setOtherValue] = useState("");

  const isOptionSelected = useMemo(
    () => options.some((o) => o.value === value),
    [options, value]
  );

  const isOtherSelected =
    allowOther &&
    value !== null &&
    value !== undefined &&
    !isOptionSelected;

  useEffect(() => {
    if (
      isOtherSelected &&
      typeof value === "string" &&
      value !== otherValue
    ) {
      setOtherValue(value);
    }
  }, [value, isOtherSelected]);

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
          {options.map((opt) => (
            <CheckboxItem
              key={String(opt.value)}
              label={opt.label}
              checked={value === opt.value}
              onChange={() =>
                onChange(value === opt.value ? null : opt.value)
              }
            />
          ))}

          {allowOther && (
            <div className="flex items-center gap-2 ">
              <CheckboxItem
                label={otherLabel}
                checked={isOtherSelected}
                onChange={() => {
                  if (isOtherSelected) {
                    onChange(null);
                  } else {
                    onChange(otherValue);
                  }
                }}
              />

              <input
                className="flex-1 border-b border-muted-foreground focus:outline-none shadow-none focus-visible:ring-0"
                placeholder={otherPlaceholder}
                disabled={!isOtherSelected}
                value={otherValue}
                onFocus={() => {
                  if (!isOtherSelected) {
                    onChange(otherValue);
                  }
                }}
                onChange={(e) => {
                  setOtherValue(e.target.value);
                  onChange(e.target.value);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Field>
  );
}








// "use client";

// import { cn } from "@/lib/utils";
// import { Label } from "../ui/label";
// import { CheckboxItem } from "./CheckboxItem";
// import { Field } from "./Field";

// interface Option {
//   label: string;
//   value: string | boolean | number;
// }

// interface SingleSelectPillsProps {
//   label?: string;
//   value?: string | boolean | number | null;
//   onChange: (value: string | boolean | number | null) => void;
//   options: Option[];
//   required?: boolean;
//   className?: string;
// }

// export const SingleSelectPills = ({
//   label,
//   value,
//   onChange,
//   options,
//   required,
//   className
// }: SingleSelectPillsProps) => {
//   return (
//     <Field >
//         <div className={cn("", className)}>
//             {label && (
//                 <Label
//                 htmlFor={label}
//                 className="text-sm font-medium flex items-center gap-3 mb-2"
//                 >
//                 <span className="shrink-0">{label}</span>
//                 {required && <span className="text-destructive">*</span>}
//                 {/* <hr className="w-full" /> */}
//                 </Label>
//             )}

//             <div className="flex flex-wrap gap-2">
//                 {options.map((opt) => (
//                 <CheckboxItem
//                     key={String(opt.value)}
//                     label={opt.label}
//                     checked={value === opt.value}
//                     onChange={() => onChange((value === opt.value) ? null : opt.value)}
//                 />
//                 ))}
//             </div>
//         </div>
//     </Field>
//   );
// };


{/* <SingleSelectPills
  label="Gender"
  value={data.gender}
  onChange={(val) => updateField("profile", "gender", val)}
  options={[
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ]}
/> */}

{/* <SingleSelectPills
  label="Smoker"
  value={data.smoker}
  onChange={(val) => updateField("health", "smoker", val as boolean)}
  options={[
    { label: "Yes", value: true },
    { label: "No", value: false },
  ]}
/> */}

// clicking the selected to deselect
// onChange={() =>
//   onChange(value === opt.value ? null : opt.value)
// }
// onChange: (value: string | boolean | number | null) => void;