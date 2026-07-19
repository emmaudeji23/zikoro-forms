"use client";

import { FormData } from "./form.types";
import { PrintPreviewModal } from "./PrintPreview";
import { format, parseISO, isValid } from "date-fns";

/* =========================================================
   TYPES (CLEAN + PRODUCTION SAFE)
========================================================= */

// Supported field types
type FieldType =
  | "text"
  | "textarea"
  | "checkbox"
  | "radio"
  | "date"
  | "number"
  | "table";

// Option type for radio/checkbox
type Option = {
  label: string;
  value: string;
};

// 🔥 MAIN FIELD SCHEMA
export type FieldSchema = {
  id: string; // ✅ important for React keys + stability
  name: string;
  label?: string;
  type?: FieldType;
  full?: boolean;

  unit?: string; // ✅ NEW: for kg, cm etc.

  options?: Option[];
  columns?: { key: string; label: string }[];

  // ✅ DB-safe conditional logic
  showIf?: {
    field: string;
    equals?: any;
    notEquals?: any;
  };

  // ✅ escape hatch (frontend only, NOT stored in DB)
  render?: (value: any, data: any) => React.ReactNode;
};

type SectionSchema = {
  title: string;
  fields?: FieldSchema[];
  type?: "fields" | "signature-group";
};

type FormSectionConfig = {
  key: keyof FormData;
  title: string;
  schema: FieldSchema[];
};

/* =========================================================
   HELPERS
========================================================= */

// ✅ Conditional rendering evaluator
const shouldShow = (field: FieldSchema, data: any) => {
  if (!field.showIf) return true;

  const value = data?.[field.showIf.field];

  if (field.showIf.equals !== undefined) {
    return value === field.showIf.equals;
  }

  if (field.showIf.notEquals !== undefined) {
    return value !== field.showIf.notEquals;
  }

  return true;
};

// ✅ Date formatter (for print)
const formatDate = (value?: string) => {
  if (!value) return "—";

  try {
    const date = parseISO(value);
    if (!isValid(date)) return value;

    return format(date, "dd MMM yyyy");
  } catch {
    return value;
  }
};

/* =========================================================
   FIELD RENDERER
========================================================= */

const RenderField = ({
  field,
  data,
}: {
  field: FieldSchema;
  data: Record<string, any>;
}) => {
  const type = field.type || "text";
  const value = data?.[field.name];

  // ✅ conditional rendering
  if (!shouldShow(field, data)) return null;

  // ✅ custom renderer override
  if (field.render) {
    return (
      <div className={field.full ? "col-span-2" : ""}>
        {field.render(value, data)}
      </div>
    );
  }

  switch (type) {
    /* ---------- TEXT AREA ---------- */
    case "textarea":
      return (
        <div className="col-span-2">
          <Label>{field.label}</Label>
          <TextBlock value={value} />
        </div>
      );

    /* ---------- CHECKBOX ---------- */
    case "checkbox": {
      const selectedValues = Array.isArray(value)
        ? value
        : typeof value === "string"
        ? [value]
        : [];

      return (
        <div className={field.full ? "col-span-2" : ""}>
          <Label>{field.label}</Label>
          <div className="flex flex-wrap gap-4">
            {field.options?.map((opt) => (
              <CheckItem
                key={opt.value}
                label={opt.label}
                checked={selectedValues.includes(opt.value)}
              />
            ))}
          </div>
        </div>
      );
    }

    /* ---------- RADIO ---------- */
    case "radio":
      return (
        <div className={field.full ? "col-span-2" : ""}>
          <Label>{field.label}</Label>
          <div className="flex flex-wrap gap-4">
            {field.options?.map((opt) => (
              <CheckItem
                key={opt.value}
                label={opt.label}
                checked={value === opt.value}
                circle
              />
            ))}
          </div>
        </div>
      );

    /* ---------- DATE ---------- */
    case "date":
      return (
        <Field
          label={field.label || ""}
          value={formatDate(value)}
          unit={field.unit}
          full={field.full}
        />
      );

    /* ---------- NUMBER ---------- */
    case "number":
      return (
        <Field
          label={field.label || ""}
          value={value != null ? String(value) : "—"}
          unit={field.unit}
          full={field.full}
        />
      );

    /* ---------- TABLE ---------- */
    case "table":
      return (
        <div className="col-span-2">
          <Label>{field.label}</Label>
          <TableField columns={field.columns || []} rows={value || []} />
        </div>
      );

    /* ---------- DEFAULT ---------- */
    default:
      return (
        <Field
          label={field.label || ""}
          value={value}
          unit={field.unit}
          full={field.full}
        />
      );
  }
};

/* =========================================================
   SECTION RENDERER
========================================================= */

const RenderSection = ({
  section,
  data,
}: {
  section: SectionSchema;
  data: Record<string, any>;
}) => {
  switch (section.type) {
    case "signature-group":
      return (
        <div className="grid grid-cols-2 gap-10 mt-6">
          <Signature label="Patient Signature" />
          <Signature label="Doctor Signature" />
        </div>
      );

    default:
      return (
        <FieldGrid>
          {section.fields?.map((field) => (
            <RenderField
              key={field.id || field.name}
              field={field}
              data={data}
            />
          ))}
        </FieldGrid>
      );
  }
};

/* =========================================================
   UI COMPONENTS (PRINT STYLING)
========================================================= */

const CheckItem = ({
  label,
  checked,
  circle,
}: {
  label: string;
  checked?: boolean;
  circle?: boolean;
}) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-4 h-4 border border-black flex items-center justify-center ${
        circle ? "rounded-full" : ""
      }`}
    >
      {checked && <div className="w-2 h-2 bg-black rounded-full" />}
    </div>
    <span>{label}</span>
  </div>
);

const Label = ({ children }: { children?: React.ReactNode }) => (
  <p className="font-medium mb-1">{children}</p>
);

const TableField = ({
  columns,
  rows,
}: {
  columns: { key: string; label: string }[];
  rows: Record<string, any>[];
}) => {
  return (
    <table className="w-full border border-black border-collapse text-sm">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="border p-2 text-left">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col.key} className="border p-2">
                  {row?.[col.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length || 1} className="p-2 text-center">
              No data
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h2 className="font-semibold border-b pb-1 mb-3">{title}</h2>
    {children}
  </div>
);

const FieldGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 gap-x-6 gap-y-2">{children}</div>
);

// ✅ Field display (with unit support)
const Field = ({
  label,
  value,
  unit,
  full,
}: {
  label: string;
  value?: string;
  unit?: string;
  full?: boolean;
}) => (
  <div className={full ? "col-span-2" : ""}>
    <p className="flex gap-2">
      <span className="font-medium min-w-[120px]">{label}:</span>
      <span className="border-b flex-1">
        {value ?? "—"} {unit || ""}
      </span>
    </p>
  </div>
);

const TextBlock = ({ value }: { value?: string }) => (
  <div className="border min-h-[60px] p-2 whitespace-pre-line">
    {value ?? "---"}
  </div>
);

const Signature = ({ label }: { label: string }) => (
  <div>
    <div className="border-b h-12 mb-2" />
    <p className="text-sm text-center">{label}</p>
  </div>
);

/* =========================================================
  Section aware schema
========================================================= */
export const formSections: FormSectionConfig[] = [
  {
    key: "basicInfo",
    title: "1. Patient Information",
    schema: [
      { id: "name", name: "name", label: "Full Name" },
      { id: "id", name: "id", label: "Patient ID" },
      { id: "dob", name: "dob", label: "Date of Birth", type: "date" },
      {
        id: "weight",
        name: "weight",
        label: "Weight",
        type: "number",
        unit: "kg",
      },
      {
        id: "orthosis",
        name: "orthosis",
        label: "Orthosis",
        type: "checkbox",
        options: [
          { label: "AFO", value: "afo" },
          { label: "KAFO", value: "kafo" },
        ],
        full: true,
      },
    ],
  },

  {
    key: "health",
    title: "2. Medical History",
    schema: [
      {
        id: "conditions",
        name: "conditions",
        label: "Conditions",
        type: "checkbox",
        options: [
          { label: "Stroke", value: "stroke" },
          { label: "Diabetes", value: "diabetes" },
        ],
        full: true,
      },
      {
        id: "medications",
        name: "medications",
        label: "Medications",
        type: "textarea",
      },
    ],
  },

  // {
  //   key: "mobility",
  //   title: "3. Mobility",
  //   schema: [
  //     {
  //       id: "walkingDistance",
  //       name: "walkingDistance",
  //       label: "Walking Distance",
  //     },
  //     {
  //       id: "walkingTime",
  //       name: "walkingTime",
  //       label: "Walking Time",
  //     },
  //   ],
  // },
];


/* =========================================================
   MAIN RENDERER
========================================================= */

type Props = {
  sections: FormSectionConfig[];
  data: FormData;
};

export const MedicalFormRenderer = ({ sections, data }: Props) => {
  return (
    <div className="bg-white text-black w-full max-w-[800px] mx-auto p-6 text-[13px] space-y-6">

      {/* HEADER */}
      <div className="border-b pb-4">
        <h1 className="text-xl font-bold text-center">
          GENERAL MEDICAL RECORD FORM
        </h1>
      </div>

      {/* LOOP THROUGH SECTIONS */}
      {sections.map((section, index) => {
        const sectionData = data?.[section.key] || {};

        return (
          <div
            key={section.key}
            className="border border-black rounded p-4"
          >
            {/* SECTION TITLE */}
            <h2 className="font-semibold mb-3 border-b pb-1">
              {section.title}
            </h2>

            {/* SECTION FIELDS */}
            <FieldGrid>
              {section.schema.map((field) => (
                <RenderField
                  key={field.id}
                  field={field}
                  data={sectionData} // 👈 IMPORTANT
                />
              ))}
            </FieldGrid>
          </div>
        );
      })}
    </div>
  );
};
/* =========================================================
   PRINT WRAPPER
========================================================= */

export const MedicalFormPrintTemplate = () => {
  return (
    <PrintPreviewModal>
      <MedicalFormRenderer
        sections={formSections}
        data={formData}
      />
    </PrintPreviewModal>
  );
};

/* =========================================================
   EXAMPLE SCHEMA + DATA
========================================================= */
const formData: FormData = {
  basicInfo: {
    name: "Mary Okafor",
    id: "PT-10293",
    dob: "1990-08-14",
    weight: 68,
    orthosis: ["afo"],
  },

  health: {
    // conditions: ["stroke"],
    // medications: "Metformin",
  },

  // mobility: {
  //   walkingDistance: "50 meters",
  //   walkingTime: "5 minutes",
  // },

  general_diagnosis_2_1: {},
  pain_2_2: {},
  sensitivity_2_3: {},


  limb: {},
  muscle: {},
  gait: {},
};