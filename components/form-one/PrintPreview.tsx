"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export const PrintPreviewModal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;

    const win = window.open("", "", "width=900,height=700");
    if (!win) return;

    win.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body {
              font-family: sans-serif;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Preview & Print</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-4xl h-full flex flex-col rounded-none p-0">
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="flex justify-end border-b p-4">
            <Button onClick={handlePrint}>Print</Button>
          </div>

          {/* Preview */}
          <div className="flex-1 overflow-auto bg-muted p-6">
            <div ref={printRef} className="bg-white shadow mx-auto">
              {children}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};