import TrusteesDeclarationForm from '@/components/cac/TrusteesDeclarationForm'
import React from 'react'

const TrusteeDelcarationPage = () => {
  return (
    <TrusteesDeclarationForm />
  )
}

export default TrusteeDelcarationPage







// "use client";

// import { useRef, useState } from "react";
// import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

// // Put the template at this path (e.g. public/forms/declaration.pdf) and
// // adjust TEMPLATE_URL if you name/place it differently.
// const TEMPLATE_URL = "/declaration.pdf";

// // Coordinates were mapped by rendering the source PDF at 100 DPI, measuring
// // each blank line's pixel position, then converting px -> pt (pt = px * 0.72)
// // and flipping the y-axis (PDF origin is bottom-left): pdfY = pageHeight - pt.
// // Nudge these if your printed output needs adjusting.
// type FieldKey = "fullName" | "address" | "org";

// interface FieldLayout {
//   x: number; // x position of the first line
//   lineIndent: number; // x position of the wrapped second line
//   lines: [number, number]; // y positions for line 1 and line 2
//   maxWidth: number; // available width on line 1
//   fallbackWidth: number; // available width on line 2
// }

// const FIELD_LAYOUT: Record<FieldKey, FieldLayout> = {
//   fullName: { x: 119, lineIndent: 72, lines: [578, 551], maxWidth: 385, fallbackWidth: 432 },
//   address: { x: 127, lineIndent: 72, lines: [524, 500], maxWidth: 378, fallbackWidth: 430 },
//   org: { x: 152, lineIndent: 72, lines: [479, 454], maxWidth: 353, fallbackWidth: 430 },
// };

// const FONT_SIZE = 11;

// interface FormValues {
//   fullName: string;
//   address: string;
//   org: string;
// }

// const EMPTY_VALUES: FormValues = { fullName: "", address: "", org: "" };

// function wrapToTwoLines(
//   text: string,
//   font: PDFFont,
//   size: number,
//   firstWidth: number,
//   restWidth: number
// ): [string, string] {
//   const words = text.trim().split(/\s+/).filter(Boolean);
//   if (words.length === 0) return ["", ""];

//   let line1 = "";
//   let i = 0;
//   while (i < words.length) {
//     const candidate = line1 ? `${line1} ${words[i]}` : words[i];
//     if (font.widthOfTextAtSize(candidate, size) <= firstWidth) {
//       line1 = candidate;
//       i++;
//     } else {
//       break;
//     }
//   }

//   let line2 = words.slice(i).join(" ");
//   while (line2 && font.widthOfTextAtSize(line2, size) > restWidth) {
//     line2 = line2.slice(0, -1);
//   }
//   return [line1, line2];
// }

// async function fillDeclaration(values: FormValues): Promise<Uint8Array> {
//   const templateBytes = await fetch(TEMPLATE_URL).then((res) => {
//     if (!res.ok) throw new Error(`Could not load template (${res.status})`);
//     return res.arrayBuffer();
//   });

//   const pdfDoc = await PDFDocument.load(templateBytes);
//   const page: PDFPage = pdfDoc.getPages()[0];
//   const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

//   (Object.keys(FIELD_LAYOUT) as FieldKey[]).forEach((key) => {
//     const raw = values[key];
//     if (!raw) return;
//     const layout = FIELD_LAYOUT[key];
//     const [line1, line2] = wrapToTwoLines(raw, font, FONT_SIZE, layout.maxWidth, layout.fallbackWidth);

//     if (line1) {
//       page.drawText(line1, { x: layout.x, y: layout.lines[0], size: FONT_SIZE, font, color: rgb(0.08, 0.1, 0.09) });
//     }
//     if (line2) {
//       page.drawText(line2, { x: layout.lineIndent, y: layout.lines[1], size: FONT_SIZE, font, color: rgb(0.08, 0.1, 0.09) });
//     }
//   });

//   return pdfDoc.save();
// }

// export default function TrusteesDeclarationForm() {
//   const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const lastUrlRef = useRef<string | null>(null);

//   function handleChange(key: FieldKey, value: string) {
//     setValues((prev) => ({ ...prev, [key]: value }));
//   }

//   async function handleGenerate() {
//     setIsGenerating(true);
//     setError(null);
//     try {
//       const pdfBytes = await fillDeclaration(values);
//       const blob = new Blob([pdfBytes.slice()], { type: "application/pdf" });
//       const url = URL.createObjectURL(blob);

//       if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
//       lastUrlRef.current = url;
//       setPdfUrl(url);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Could not generate the PDF.");
//     } finally {
//       setIsGenerating(false);
//     }
//   }

//   function handleDownload() {
//     if (!pdfUrl) return;
//     const a = document.createElement("a");
//     a.href = pdfUrl;
//     a.download = "trustees-declaration-filled.pdf";
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   }

//   return (
//     <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 p-6 md:grid-cols-2">
//       <div className="rounded border border-neutral-200 bg-white p-6">
//         <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
//           Your details
//         </h2>

//         <div className="mb-4">
//           <label htmlFor="fullName" className="mb-1 block text-sm text-neutral-600">
//             Full names
//           </label>
//           <textarea
//             id="fullName"
//             value={values.fullName}
//             onChange={(e) => handleChange("fullName", e.target.value)}
//             className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
//             rows={2}
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="address" className="mb-1 block text-sm text-neutral-600">
//             Permanent address
//           </label>
//           <textarea
//             id="address"
//             value={values.address}
//             onChange={(e) => handleChange("address", e.target.value)}
//             className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
//             rows={2}
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="org" className="mb-1 block text-sm text-neutral-600">
//             Name of organisation
//           </label>
//           <textarea
//             id="org"
//             value={values.org}
//             onChange={(e) => handleChange("org", e.target.value)}
//             className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
//             rows={2}
//           />
//         </div>

//         <p className="mb-4 text-xs text-neutral-500">
//           Only the deponent&apos;s own details are filled here. The date, notary particulars,
//           and signature are completed in person when the declaration is sworn.
//         </p>

//         <div className="flex gap-3">
//           <button
//             type="button"
//             onClick={handleGenerate}
//             disabled={isGenerating}
//             className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
//           >
//             {isGenerating ? "Generating…" : "Generate preview"}
//           </button>
//           <button
//             type="button"
//             onClick={handleDownload}
//             disabled={!pdfUrl}
//             className="rounded border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 disabled:opacity-40"
//           >
//             Download PDF
//           </button>
//         </div>

//         {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
//       </div>

//       <div className="flex min-h-[640px] flex-col rounded border border-neutral-200 bg-white p-4">
//         <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
//           Live preview
//         </h2>
//         {pdfUrl ? (
//           <iframe src={pdfUrl} title="Filled form preview" className="flex-1 rounded border border-neutral-200" />
//         ) : (
//           <div className="flex flex-1 items-center justify-center px-8 text-center text-sm text-neutral-500">
//             Fill the fields and generate a preview to see the completed declaration here.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }