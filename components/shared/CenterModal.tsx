"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface CenterModalProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  triggerBtn?: ReactNode;
  title?: string | React.ReactNode;
  className?: string;
  showCancel?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const CenterModal = ({
  open,
  setOpen,
  triggerBtn,
  className,
  title,
  children,
  showCancel,
  footer,
}: CenterModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerBtn && <DialogTrigger asChild>{triggerBtn}</DialogTrigger>}
      <DialogContent
        className={cn(
          "md:max-w-4xl p-0 max-sm:rounded-none overflow-y-auto",
          "overflow-hidden flex flex-col" ,
          className
        )}
      >
        {title && (
          <DialogHeader className="p-6 border-b bg-gradient-to-br from-primary/40 to-secondary/90">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}

        <button onClick={()=>setOpen&&setOpen(false)} className="size-8 rounded-full flex justify-center items-center text-white bg-primary absolute top-2 right-2 z-10"><X/></button>

        <div className="p-6 overflow-y-auto max-sm:h-screen  flex-1 h-full  w-full">
          {children}
        </div>

        {footer && <DialogFooter className="flex gap-2 items-center">
          {
            showCancel && setOpen &&
            <Button onClick={()=>setOpen(false)} variant={'outline'}>{showCancel}</Button>
          }
          {footer}
        </DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

export default CenterModal;
