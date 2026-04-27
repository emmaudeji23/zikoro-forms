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

    const originalBody = document.body.innerHTML;

    // clone node to preserve state
    const cloned = content.cloneNode(true) as HTMLElement;

    document.body.innerHTML = "";
    document.body.appendChild(cloned);

    window.print();

    // restore app
    document.body.innerHTML = originalBody;
    window.location.reload(); // ensures React rehydrates cleanly
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
            <div
              ref={printRef}
              className="bg-white mx-auto shadow print:shadow-none"
            >
              {children}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};