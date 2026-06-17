"use client"

import { motion } from "framer-motion"
import { FileText, MessageSquareText, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

const documentChips = [
  { label: "PDF", className: "left-[4%] top-[18%]", delay: 0 },
  { label: "OCR", className: "right-[5%] top-[16%]", delay: 0.25 },
  { label: "Chunks", className: "left-[0%] bottom-[22%]", delay: 0.5 },
  { label: "Vectors", className: "right-[2%] bottom-[24%]", delay: 0.75 },
  { label: "Answer", className: "left-[38%] bottom-[2%]", delay: 1 },
]

const chatBubbles = [
  { label: "Summarize this", className: "left-[11%] top-[39%]", delay: 0.15 },
  { label: "Source found", className: "right-[4%] top-[42%]", delay: 0.45 },
  { label: "Ask your PDF", className: "left-[34%] top-[6%]", delay: 0.7 },
]

const beams = [
  "left-[16%] top-[34%] w-[26%] rotate-[16deg]",
  "right-[14%] top-[36%] w-[25%] rotate-[-18deg]",
  "left-[20%] bottom-[31%] w-[24%] rotate-[-17deg]",
  "right-[18%] bottom-[32%] w-[23%] rotate-[18deg]",
]

type AIAssistantVisualProps = {
  className?: string
  compact?: boolean
}

export function AIAssistantVisual({ className, compact = false }: AIAssistantVisualProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative mx-auto aspect-square w-full max-w-[36rem] overflow-visible",
        compact && "max-w-[14rem]",
        className,
      )}
    >
      <div className="absolute inset-0 rounded-full bg-[#BA3AD3]/10 blur-3xl" />
      <motion.div
        className="absolute inset-[8%] rounded-full border border-[#F69CEB]/20 bg-[conic-gradient(from_120deg,transparent,rgba(186,58,211,0.42),transparent,rgba(92,20,187,0.55),transparent)] blur-[1px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[16%] rounded-full border border-[#BA3AD3]/35 shadow-[0_0_80px_rgba(186,58,211,0.32),inset_0_0_58px_rgba(246,156,235,0.12)]"
        animate={{ rotate: -360, scale: [1, 1.04, 1] }}
        transition={{
          rotate: { duration: 38, repeat: Infinity, ease: "linear" },
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.div
        className="absolute inset-[25%] overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_22%,#F69CEB_0%,#BA3AD3_20%,#5C14BB_48%,#19015C_73%,#020006_100%)] shadow-[0_0_70px_rgba(186,58,211,0.64),0_0_140px_rgba(92,20,187,0.38),inset_0_0_48px_rgba(255,255,255,0.18)]"
        animate={{ scale: [1, 1.055, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute left-[18%] top-[14%] h-[28%] w-[28%] rounded-full bg-white/45 blur-xl"
          animate={{ opacity: [0.32, 0.72, 0.32], x: [0, 8, 0], y: [0, -6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-[18%] rounded-full border border-white/15" />
        <div className="absolute inset-x-[22%] bottom-[15%] h-[18%] rounded-full bg-[#F69CEB]/30 blur-2xl" />
      </motion.div>

      {beams.map((beam) => (
        <span
          key={beam}
          className={cn(
            "absolute h-px bg-gradient-to-r from-transparent via-[#F69CEB]/55 to-transparent shadow-[0_0_18px_rgba(246,156,235,0.48)]",
            compact ? "hidden" : "block",
            beam,
          )}
        />
      ))}

      {documentChips.map((chip) => (
        <motion.div
          key={chip.label}
          className={cn(
            "absolute inline-flex items-center gap-2 rounded-2xl border border-white/[0.12] bg-white/[0.07] px-3 py-2 text-xs font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.34),0_0_30px_rgba(186,58,211,0.14)] backdrop-blur-2xl",
            compact && chip.label !== "OCR" && chip.label !== "PDF" && "hidden",
            chip.className,
          )}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { duration: 0.5, delay: chip.delay },
            y: { duration: 5.5, repeat: Infinity, delay: chip.delay, ease: "easeInOut" },
          }}
        >
          <FileText className="h-3.5 w-3.5 text-[#F69CEB]" />
          {chip.label}
        </motion.div>
      ))}

      {chatBubbles.map((bubble) => (
        <motion.div
          key={bubble.label}
          className={cn(
            "absolute inline-flex items-center gap-2 rounded-full border border-[#F69CEB]/20 bg-[#19015C]/55 px-3.5 py-2 text-xs font-medium text-[#F7D7F4] shadow-[0_0_34px_rgba(186,58,211,0.22)] backdrop-blur-2xl",
            compact && bubble.label !== "Ask your PDF" && "hidden",
            bubble.className,
          )}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: [0, 10, 0], scale: [1, 1.03, 1] }}
          transition={{
            opacity: { duration: 0.5, delay: bubble.delay },
            y: { duration: 6.25, repeat: Infinity, delay: bubble.delay, ease: "easeInOut" },
            scale: { duration: 6.25, repeat: Infinity, delay: bubble.delay, ease: "easeInOut" },
          }}
        >
          {bubble.label === "Ask your PDF" ? (
            <Sparkles className="h-3.5 w-3.5 text-[#F69CEB]" />
          ) : (
            <MessageSquareText className="h-3.5 w-3.5 text-[#F69CEB]" />
          )}
          {bubble.label}
        </motion.div>
      ))}
    </div>
  )
}
