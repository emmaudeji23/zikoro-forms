"use client"

import { cn } from "@/lib/utils"

export const SectionBlock = ({
  title,
  children,
  className,
}: {
  title?: string
  className?:string
  children: React.ReactNode
}) => {
  return (
    <section className="space-y-4">
      
      {title && <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold tracking-tight">
          {title}
        </h3>
        <div className="flex-1 h-px bg-border/60" />
      </div>}

      <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
        {children}
      </div>
    </section>
  )
}