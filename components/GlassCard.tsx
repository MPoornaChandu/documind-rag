import type { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export function GlassCard({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("glass-card rounded-3xl", className)} {...props}>
      {children}
    </div>
  )
}
