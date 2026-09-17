"use client";

import { useRef, useState } from "react";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type PDFImage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { X } from "lucide-react";
// Put the template at this path (e.g. public/forms/declaration.pdf) and
// adjust TEMPLATE_URL if you name/place it differently.
const TEMPLATE_URL = "/declaration.pdf";

// Handwriting font used only for the two notary stamp dates, so they read
// like they were penned in by hand rather than typed. Any TTF/OTF works —
// place it at this path. (Indie Flower, from Google Fonts, is a good free
// default: https://fonts.google.com/specimen/Indie+Flower)
const HANDWRITING_FONT_URL = "/fonts/IndieFlower-Regular.ttf";

// --- Coordinate map -----------------------------------------------------
// All coordinates were mapped by rendering the source PDF at 200 DPI,
// measuring each target's pixel position, then converting px -> pt
// (pt = px * 0.36) and flipping the y-axis (PDF origin is bottom-left):
// pdfY = pageHeight - pt. Verified against a marked-up render of the
// actual template before shipping. Nudge these if your copy differs.

type TextFieldKey = "fullName" | "address" | "org";

interface WrappingTextLayout {
  x: number; // x position of the first line
  lineIndent: number; // x position of the wrapped second line
  lines: [number, number]; // y positions for line 1 and line 2
  maxWidth: number; // available width on line 1
  fallbackWidth: number; // available width on line 2
}

const TEXT_FIELD_LAYOUT: Record<TextFieldKey, WrappingTextLayout> = {
  fullName: { x: 119, lineIndent: 72, lines: [573, 551], maxWidth: 385, fallbackWidth: 432 },
  address: { x: 127, lineIndent: 72, lines: [530, 504], maxWidth: 378, fallbackWidth: 430 },
  org: { x: 152, lineIndent: 72, lines: [479, 454], maxWidth: 353, fallbackWidth: 430 },
};

const FONT_SIZE = 14;

// "THIS ___ DAY OF ___" — filled automatically with today's date.
const DATE_LINE = {
  day: { x: 100, y: 209.5, maxWidth: 84 },
  month: { x: 220, y: 209.5, maxWidth: 86 },
  fontSize: 11,
};

// The two notarization stamps (top-right and bottom-right) each have a
// blank "Date....." line. Both get the picked date, in the handwriting font.
const STAMP_DATES = [
  { x: 449, y: 653, maxWidth: 70 },
  { x: 475, y: 100, maxWidth: 74 },
];
const STAMP_DATE_FONT_SIZE = 9;
const STAMP_DATE_COLOR = rgb(0.16, 0.24, 0.55); // approximate stamp-ink blue

// Passport photo box (bottom-left corner + size). Image is fit inside
// ("contain") and centered, so any aspect ratio the user uploads works.
const PHOTO_BOX = { x: 444, y: 130, width: 100, height: 115 };

// Signature sits directly above the "DEPONENT" line, left-aligned to it.
const SIGNATURE_BOX = { x: 432, y: 271, width: 117, height: 26 };

interface TextValues {
  fullName: string;
  address: string;
  org: string;
}

const EMPTY_VALUES: TextValues = { fullName: "", address: "", org: "" };

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Formats a Date as YYYY-MM-DD in local time, for <input type="date">. */
function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Parses an <input type="date"> value ("YYYY-MM-DD") as a local date, avoiding UTC shift. */
function parseDateInputValue(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function wrapToTwoLines(
  text: string,
  font: PDFFont,
  size: number,
  firstWidth: number,
  restWidth: number
): [string, string] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return ["", ""];

  let line1 = "";
  let i = 0;
  while (i < words.length) {
    const candidate = line1 ? `${line1} ${words[i]}` : words[i];
    if (font.widthOfTextAtSize(candidate, size) <= firstWidth) {
      line1 = candidate;
      i++;
    } else {
      break;
    }
  }

  let line2 = words.slice(i).join(" ");
  while (line2 && font.widthOfTextAtSize(line2, size) > restWidth) {
    line2 = line2.slice(0, -1);
  }
  return [line1, line2];
}

function fitText(text: string, font: PDFFont, size: number, maxWidth: number): string {
  let out = text;
  while (out && font.widthOfTextAtSize(out, size) > maxWidth) {
    out = out.slice(0, -1);
  }
  return out;
}

/** Draws `image` centered inside `box`, scaled to fit ("contain"). */
function drawContained(
  page: PDFPage,
  image: PDFImage,
  box: { x: number; y: number; width: number; height: number }
) {
  const scale = Math.min(box.width / image.width, box.height / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  const x = box.x + (box.width - w) / 2;
  const y = box.y + (box.height - h) / 2;
  page.drawImage(image, { x, y, width: w, height: h });
}

async function embedUploadedImage(pdfDoc: PDFDocument, file: File): Promise<PDFImage> {
  const bytes = await file.arrayBuffer();
  if (file.type === "image/png") return pdfDoc.embedPng(bytes);
  if (file.type === "image/jpeg" || file.type === "image/jpg") return pdfDoc.embedJpg(bytes);
  // Fallback: try PNG first, then JPEG, in case the browser didn't set a MIME type.
  try {
    return await pdfDoc.embedPng(bytes);
  } catch {
    return pdfDoc.embedJpg(bytes);
  }
}

interface FillOptions {
  values: TextValues;
  declarationDate: Date;
  photoFile: File | null;
  signatureFile: File | null;
}

async function fillDeclaration({ values, declarationDate, photoFile, signatureFile }: FillOptions): Promise<Uint8Array> {
  const templateBytes = await fetch(TEMPLATE_URL).then((res) => {
    if (!res.ok) throw new Error(`Could not load template (${res.status})`);
    return res.arrayBuffer();
  });

  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const ink = rgb(0.08, 0.1, 0.09);

  const handwritingBytes = await fetch(HANDWRITING_FONT_URL).then((res) => {
    if (!res.ok) throw new Error(`Could not load handwriting font (${res.status})`);
    return res.arrayBuffer();
  });
  const handwritingFont = await pdfDoc.embedFont(handwritingBytes);

  // 1. Name / address / organisation
  (Object.keys(TEXT_FIELD_LAYOUT) as TextFieldKey[]).forEach((key) => {
    const raw = values[key];
    if (!raw) return;
    const layout = TEXT_FIELD_LAYOUT[key];
    const [line1, line2] = wrapToTwoLines(raw, font, FONT_SIZE, layout.maxWidth, layout.fallbackWidth);
    if (line1) page.drawText(line1, { x: layout.x, y: layout.lines[0], size: FONT_SIZE, font, color: ink });
    if (line2) page.drawText(line2, { x: layout.lineIndent, y: layout.lines[1], size: FONT_SIZE, font, color: ink });
  });

  // 2. "THIS ___ DAY OF ___" — driven by the picked declaration date
  const day = fitText(String(declarationDate.getDate()), font, DATE_LINE.fontSize, DATE_LINE.day.maxWidth);
  const monthYear = fitText(
    `${MONTH_NAMES[declarationDate.getMonth()]}, ${declarationDate.getFullYear()}`,
    font,
    DATE_LINE.fontSize,
    DATE_LINE.month.maxWidth
  );
  page.drawText(day, { x: DATE_LINE.day.x, y: DATE_LINE.day.y, size: DATE_LINE.fontSize, font, color: ink });
  page.drawText(monthYear, { x: DATE_LINE.month.x, y: DATE_LINE.month.y, size: DATE_LINE.fontSize, font, color: ink });

  // 3. Both notary stamp date lines — same picked date, in a handwriting font
  const pad = (n: number) => String(n).padStart(2, "0");
  const shortDate = `${pad(declarationDate.getDate())}/${pad(declarationDate.getMonth() + 1)}/${declarationDate.getFullYear()}`;
  STAMP_DATES.forEach((pos) => {
    const text = fitText(shortDate, handwritingFont, STAMP_DATE_FONT_SIZE, pos.maxWidth);
    page.drawText(text, { x: pos.x, y: pos.y, size: STAMP_DATE_FONT_SIZE, font: handwritingFont, color: STAMP_DATE_COLOR });
  });

  // 4. Passport photo
  if (photoFile) {
    const image = await embedUploadedImage(pdfDoc, photoFile);
    drawContained(page, image, PHOTO_BOX);
  }

  // 5. Signature
  if (signatureFile) {
    const image = await embedUploadedImage(pdfDoc, signatureFile);
    drawContained(page, image, SIGNATURE_BOX);
  }

  return pdfDoc.save();
}

export default function TrusteesDeclarationForm() {
  const [values, setValues] = useState<TextValues>(EMPTY_VALUES);
  const [dateInput, setDateInput] = useState<string>(() => toDateInputValue(new Date()));
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastUrlRef = useRef<string | null>(null);

  function handleChange(key: TextFieldKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  // async function handleGenerate() {
  //   setIsGenerating(true);
  //   setError(null);
  //   try {
  //     if (!dateInput) throw new Error("Pick a declaration date first.");
  //     const declarationDate = parseDateInputValue(dateInput);
  //     const pdfBytes = await fillDeclaration({ values, declarationDate, photoFile, signatureFile });
  //     const blob = new Blob([pdfBytes.slice()], { type: "application/pdf" });
  //     const url = URL.createObjectURL(blob);

  //     if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
  //     lastUrlRef.current = url;
  //     setPdfUrl(url);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : "Could not generate the PDF.");
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // }
  async function handleGenerate() {
  setIsGenerating(true);
  setError(null);

  try {
    if (!dateInput) throw new Error("Pick a declaration date first.");

    const declarationDate = parseDateInputValue(dateInput);

    const pdfBytes = await fillDeclaration({
      values,
      declarationDate,
      photoFile,
      signatureFile,
    });

    const blob = new Blob([pdfBytes.slice()], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    if (lastUrlRef.current) {
      URL.revokeObjectURL(lastUrlRef.current);
    }

    lastUrlRef.current = url;
    setPdfUrl(url);

    return true;
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Could not generate the PDF."
    );

    return false;
  } finally {
    setIsGenerating(false);
  }
}

  function handleDownload() {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "trustees-declaration-filled.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  return (
  <div className=" min-h-dvh  ">
   
    <div className="absolute inset-0 min-h-screen  -z-10 bg-gradient-to-b from-primary/20  " />

    <div className="relative mx-auto max-w-7xl py-10 pb-0 px-4 lg:px-20">
      <div className="max-w-2xl">
        {/* <div className="mb-3 inline-flex rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          Trustees Declaration Generator
        </div> */}

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Generate your trustees declaration PDF
        </h1>

        <p className="mt-3 text-sm leading-6 ">
          Fill in your details, upload your passport and signature, preview the
          document, then download the completed PDF.
        </p>
      </div>
    </div>

    <div className="mx-auto max-w-7xl  py-4  lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
        {/* Form */}
        <div className="rounded-lg border border-border bg-card p-5 -sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Declaration Information
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete the information below.
            </p>
          </div>

          <div className="space-y-2">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full names
              </label>
              <input
                id="fullName"
                value={values.fullName}
                onChange={(e) =>
                  handleChange("fullName", e.target.value)
                }
                 
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                placeholder="Enter full names"
              />
            </div>

            {/* Address */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Permanent address
              </label>
              <textarea
                id="address"
                value={values.address}
                onChange={(e) =>
                  handleChange("address", e.target.value)
                }
                rows={3}
                className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                placeholder="Enter permanent address"
              />
            </div>

            {/* Organisation */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Organisation name
              </label>
              <input
                id="org"
                value={values.org}
                onChange={(e) =>
                  handleChange("org", e.target.value)
                }
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none transition focus:border-primary"
                placeholder="Organisation name"
              />
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Declaration date
              </label>
              <input
                id="declarationDate"
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="h-12 w-full rounded-md border border-border bg-background px-4 text-sm outline-none transition focus:border-primary"
              />
            </div>

            {/* Passport */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Passport photo
              </label>

              <input
                id="photo"
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) =>
                  setPhotoFile(e.target.files?.[0] ?? null)
                }
                className="block w-full rounded-md border border-dashed border-border bg-muted/30 p-1 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-background"
              />
            </div>

            {/* Signature */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Signature
              </label>

              <input
                id="signature"
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) =>
                  setSignatureFile(e.target.files?.[0] ?? null)
                }
                className="block w-full rounded-md border border-dashed border-border bg-muted/30 p-1 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-background"
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="mt-8 hidden gap-3 lg:flex">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate Preview"}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={!pdfUrl}
              className="h-10 rounded-md border border-border px-5 text-sm disabled:opacity-50"
            >
              Download PDF
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        {/* Desktop Preview */}
        <div className="hidden lg:flex">
          <div className="sticky top-6 flex h-[780px] w-full flex-col rounded-lg border border-border bg-card p-4 -sm">
            <div className="mb-4">
              <h3 className="font-semibold">
                Live Preview
              </h3>
              <p className="text-sm text-muted-foreground">
                Your generated PDF appears here.
              </p>
            </div>

            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                title="preview"
                className="flex-1 rounded-md border border-border"
              />
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                Generate preview to view PDF
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Mobile Bottom Drawer */}
    <div className="lg:hidden">
      {/* Mobile Action Bar */}
      <div className=" bg-background/95 pb-3 px-4 ">
        <div className="mx-auto flex max-w-lg gap-3">
          <button
            type="button"
            onClick={async () => {
              const generated = await handleGenerate();

              if (generated) {
                setIsPreviewOpen(true);
              }
            }}
            disabled={isGenerating}
            className="flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? "Generating..." : "Preview PDF"}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!pdfUrl}
            className="h-10 rounded-md border border-border bg-background px-5 text-sm font-medium transition-opacity active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Download
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isPreviewOpen && (
        <button
          type="button"
          aria-label="Close preview"
          onClick={() => setIsPreviewOpen(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
        />
      )}

      {/* Preview Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 flex h-[92dvh] flex-col overflow-hidden rounded-t-[24px] border-t border-border bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isPreviewOpen ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!isPreviewOpen}
      >
        {/* Handle */}
        <div className="flex shrink-0 justify-center py-3">
          <div className="h-1.5 w-12 rounded-full bg-muted-foreground/25" />
        </div>

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 pb-4">
          <div>
            <h3 className="text-base font-semibold">
              PDF Preview
            </h3>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Review your completed declaration
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(false)}
            aria-label="Close preview"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* PDF Preview */}
        <div className="min-h-0 flex-1 bg-muted/30 p-3">
          {pdfUrl ? (
            <iframe
              key={pdfUrl}
              src={pdfUrl}
              title="Filled form preview"
              className="h-full w-full rounded-md border border-border bg-background"
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border bg-background px-8 text-center">
              <div>
                <p className="text-sm font-medium">
                  No preview yet
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Generate your declaration to preview the completed PDF.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Download */}
        <div className="shrink-0 border-t border-border bg-background py-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!pdfUrl}
            className="h-10 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground transition-opacity active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>

    {/* Footer */}
    <footer className="border-t border-border py-5 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Designed by{" "}
      <a
        href="https://gogrene.vercel.app"
        target="_blank"
        rel="noreferrer"
        className="text-primary hover:underline"
      >
        Gogrene Inc
      </a>
    </footer>
  </div>
)

  // return (
  //   <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 p-6 md:grid-cols-2">
  //     <div className="rounded border border-neutral-200 bg-white p-6">
  //       <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
  //         Your details
  //       </h2>

  //       <div className="mb-4">
  //         <label htmlFor="fullName" className="mb-1 block text-sm text-neutral-600">
  //           Full names
  //         </label>
  //         <textarea
  //           id="fullName"
  //           value={values.fullName}
  //           onChange={(e) => handleChange("fullName", e.target.value)}
  //           className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
  //           rows={2}
  //         />
  //       </div>

  //       <div className="mb-4">
  //         <label htmlFor="address" className="mb-1 block text-sm text-neutral-600">
  //           Permanent address
  //         </label>
  //         <textarea
  //           id="address"
  //           value={values.address}
  //           onChange={(e) => handleChange("address", e.target.value)}
  //           className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
  //           rows={2}
  //         />
  //       </div>

  //       <div className="mb-4">
  //         <label htmlFor="org" className="mb-1 block text-sm text-neutral-600">
  //           Name of organisation
  //         </label>
  //         <textarea
  //           id="org"
  //           value={values.org}
  //           onChange={(e) => handleChange("org", e.target.value)}
  //           className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
  //           rows={2}
  //         />
  //       </div>

  //       <div className="mb-4">
  //         <label htmlFor="declarationDate" className="mb-1 block text-sm text-neutral-600">
  //           Declaration date
  //         </label>
  //         <input
  //           id="declarationDate"
  //           type="date"
  //           value={dateInput}
  //           onChange={(e) => setDateInput(e.target.value)}
  //           className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
  //         />
  //         <p className="mt-1 text-xs text-neutral-500">
  //           Written onto the &quot;THIS ___ DAY OF ___&quot; line and both notary stamp date
  //           lines. Defaults to today — change it if the declaration is being prepared ahead of
  //           the actual signing date.
  //         </p>
  //       </div>

  //       <div className="mb-4">
  //         <label htmlFor="photo" className="mb-1 block text-sm text-neutral-600">
  //           Passport photo
  //         </label>
  //         <input
  //           id="photo"
  //           type="file"
  //           accept="image/png,image/jpeg"
  //           onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
  //           className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-sm file:font-medium"
  //         />
  //         <p className="mt-1 text-xs text-neutral-500">
  //           Any size or aspect ratio works — it's fitted into the photo box automatically.
  //         </p>
  //       </div>

  //       <div className="mb-4">
  //         <label htmlFor="signature" className="mb-1 block text-sm text-neutral-600">
  //           Signature
  //         </label>
  //         <input
  //           id="signature"
  //           type="file"
  //           accept="image/png,image/jpeg"
  //           onChange={(e) => setSignatureFile(e.target.files?.[0] ?? null)}
  //           className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-sm file:font-medium"
  //         />
  //         <p className="mt-1 text-xs text-neutral-500">
  //           A cropped PNG with a transparent background looks best on the deponent line.
  //         </p>
  //       </div>

  //       <div className="flex gap-3">
  //         <button
  //           type="button"
  //           onClick={handleGenerate}
  //           disabled={isGenerating}
  //           className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
  //         >
  //           {isGenerating ? "Generating…" : "Generate preview"}
  //         </button>
  //         <button
  //           type="button"
  //           onClick={handleDownload}
  //           disabled={!pdfUrl}
  //           className="rounded border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 disabled:opacity-40"
  //         >
  //           Download PDF
  //         </button>
  //       </div>

  //       {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
  //     </div>

  //     <div className="flex min-h-[640px] flex-col rounded border border-neutral-200 bg-white p-4">
  //       <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
  //         Live preview
  //       </h2>
  //       {pdfUrl ? (
  //         <iframe src={pdfUrl} title="Filled form preview" className="flex-1 rounded border border-neutral-200" />
  //       ) : (
  //         <div className="flex flex-1 items-center justify-center px-8 text-center text-sm text-neutral-500">
  //           Fill the fields and generate a preview to see the completed declaration here.
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
}
