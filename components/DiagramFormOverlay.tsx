"use client";
import { useState } from "react";

// ============================================================
// REUSABLE PART — this is the piece you keep and reuse everywhere.
// It knows nothing about muscles, legs, or checkboxes. It just:
//   1. Locks a container to the image's own aspect ratio
//   2. Positions arbitrary fields at %-based coordinates inside it
//   3. Clips anything that would spill outside the frame
// ============================================================

// Base shape every field needs. Extend this per-design (see MuscleField below)
// rather than editing it — keeps the overlay component fully generic.
export interface DiagramField {
  id: string;
  top: number;          // % from top of the container, 0–100
  left: number;          // % from left of the container, 0–100
  align?: "start" | "end"; // which side the input sits on relative to its label
  label?: string;
}

export interface DiagramFormOverlayProps<TField extends DiagramField> {
  imageSrc: string;
  imageAlt: string;
  aspectRatio: string;   // e.g. "760 / 780" — width / height of the source image
  maxWidth?: number;
  fields: TField[];
  renderField: (field: TField) => React.ReactNode;
}

export function DiagramFormOverlay<TField extends DiagramField>({
  imageSrc,
  imageAlt,
  aspectRatio,
  maxWidth = 720,
  fields,
  renderField,
}: DiagramFormOverlayProps<TField>) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth,
        aspectRatio,
        margin: "0 auto",
        overflow: "hidden", // nothing escapes the frame, at any viewport size
      }}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain", // never distorts, always matches aspectRatio
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {fields.map((field) => (
        <div
          key={field.id}
          style={{
            position: "absolute",
            top: `${field.top}%`,
            left: `${field.left}%`,
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: field.align === "end" ? "row-reverse" : "row",
            alignItems: "center",
            gap: "0.4em",
            whiteSpace: "nowrap",
          }}
        >
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}

// A default field renderer for the common case: checkbox + label.
// Swap this out (pass your own renderField) for number inputs,
// selects, or anything else — the overlay component doesn't care.
export interface CheckboxFieldProps<TField extends DiagramField> {
  field: TField;
  checked: boolean | undefined;
  onChange: (id: string, value: boolean) => void;
}

export function CheckboxField<TField extends DiagramField>({
  field,
  checked,
  onChange,
}: CheckboxFieldProps<TField>) {
  return (
    <>
      <input
        type="checkbox"
        id={field.id}
        checked={!!checked}
        onChange={(e) => onChange(field.id, e.target.checked)}
        style={{
          width: "clamp(12px, 2.2vw, 18px)",
          height: "clamp(12px, 2.2vw, 18px)",
          flexShrink: 0,
          cursor: "pointer",
        }}
      />
      <label
        htmlFor={field.id}
        style={{ fontSize: "clamp(9px, 1.5vw, 13px)", cursor: "pointer", lineHeight: 1.1 }}
      >
        {field.label}
      </label>
    </>
  );
}

// ============================================================
// USAGE — this is what changes per design. Field labels, positions,
// and the image path all live here, not in the reusable component.
// Positions are placeholders: swap in your real image path, then
// nudge each top/left % until it lines up with your artwork.
// ============================================================

interface MuscleField extends DiagramField {
  label: string;
  side: "left" | "right";
}

const MUSCLE_FIELDS: MuscleField[] = [
  // Right leg
  { id: "r-hip-flexor", label: "Hip flexor", side: "right", top: 16, left: 44, align: "start" },
  { id: "r-hip-extensor", label: "Hip extensor", side: "right", top: 18, left: 4, align: "start" },
  { id: "r-knee-extensor", label: "Knee extensor", side: "right", top: 33, left: 44, align: "start" },
  { id: "r-knee-flexor", label: "Knee flexor", side: "right", top: 36, left: 4, align: "start" },
  { id: "r-dorsal-flexor", label: "Dorsal flexor", side: "right", top: 60, left: 44, align: "start" },
  { id: "r-dorsal-extensor", label: "Dorsal extensor", side: "right", top: 56, left: 4, align: "start" },

  // Left leg
  { id: "l-hip-flexor", label: "Hip flexor", side: "left", top: 16, left: 53, align: "end" },
  { id: "l-hip-extensor", label: "Hip extensor", side: "left", top: 18, left: 93, align: "end" },
  { id: "l-knee-extensor", label: "Knee extensor", side: "left", top: 33, left: 53, align: "end" },
  { id: "l-knee-flexor", label: "Knee flexor", side: "left", top: 36, left: 93, align: "end" },
  { id: "l-dorsal-flexor", label: "Dorsal flexor", side: "left", top: 60, left: 53, align: "end" },
  { id: "l-dorsal-extensor", label: "Dorsal extensor", side: "left", top: 56, left: 93, align: "end" },
];

type MuscleValues = Record<string, boolean>;

export default function MuscleFunctionForm() {
  const [values, setValues] = useState<MuscleValues>({});

  const handleChange = (id: string, value: boolean) =>
    setValues((prev) => ({ ...prev, [id]: value }));

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 12,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
          2.7 Assessment of muscular function
        </h2>
        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
          <input type="checkbox" /> no findings
        </label>
      </div>

      <DiagramFormOverlay<MuscleField>
        imageSrc="/muscle-assessment-diagram.png" // <- swap for your real asset path
        imageAlt="Muscle assessment diagram, anterior view of both legs"
        aspectRatio="760 / 780" // <- match your actual image's natural width/height
        fields={MUSCLE_FIELDS}
        renderField={(field) => (
          <CheckboxField field={field} checked={values[field.id]} onChange={handleChange} />
        )}
      />

      <pre
        style={{
          fontSize: 11,
          background: "#fafafa",
          padding: 12,
          borderRadius: 6,
          marginTop: 16,
          overflowX: "auto",
        }}
      >
        {JSON.stringify(values, null, 2)}
      </pre>
    </div>
  );
}
