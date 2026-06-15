import { Bot, UserRound } from "lucide-react"

import { SourceCitations } from "@/components/SourceCitations"
import type { Message } from "@/lib/types"
import { cn } from "@/lib/utils"

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  const time = message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const Icon = isUser ? UserRound : Bot

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border",
          isUser ? "border-blue-300/30 bg-blue-400/20 text-blue-100" : "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className={cn("max-w-[86%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-3xl px-5 py-4 text-sm leading-6",
            isUser
              ? "rounded-tr-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-glow"
              : "rounded-tl-lg border border-white/10 bg-white/[0.06] text-slate-200 backdrop-blur-xl",
          )}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          {!isUser && message.sources ? <SourceCitations sources={message.sources} /> : null}
        </div>
        <p className={cn("mt-2 text-xs text-slate-500", isUser && "text-right")}>{time}</p>
      </div>
    </div>
  )
}
