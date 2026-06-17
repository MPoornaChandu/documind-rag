import { Bot, UserRound } from "lucide-react"

import { SourceCitations } from "@/components/SourceCitations"
import type { Message } from "@/lib/types"
import { cn } from "@/lib/utils"

type MessageBlock =
  | {
      type: "paragraph"
      text: string
    }
  | {
      type: "list"
      listType: "ul" | "ol"
      items: string[]
    }

function parseMessageBlocks(content: string): MessageBlock[] {
  const blocks: MessageBlock[] = []
  const paragraphLines: string[] = []
  let currentList: Extract<MessageBlock, { type: "list" }> | null = null

  function flushParagraph() {
    if (paragraphLines.length === 0) {
      return
    }

    blocks.push({
      type: "paragraph",
      text: paragraphLines.join(" "),
    })
    paragraphLines.length = 0
  }

  function flushList() {
    if (!currentList) {
      return
    }

    blocks.push(currentList)
    currentList = null
  }

  for (const line of content.split(/\r?\n/)) {
    const trimmedLine = line.trim()

    if (!trimmedLine) {
      flushParagraph()
      flushList()
      continue
    }

    const bulletMatch = trimmedLine.match(/^(?:[-*]|\u2022)\s+(.+)$/)
    const numberedMatch = trimmedLine.match(/^\d+[.)]\s+(.+)$/)

    if (bulletMatch) {
      flushParagraph()

      if (!currentList || currentList.listType !== "ul") {
        flushList()
        currentList = { type: "list", listType: "ul", items: [] }
      }

      currentList.items.push(bulletMatch[1])
      continue
    }

    if (numberedMatch) {
      flushParagraph()

      if (!currentList || currentList.listType !== "ol") {
        flushList()
        currentList = { type: "list", listType: "ol", items: [] }
      }

      currentList.items.push(numberedMatch[1])
      continue
    }

    flushList()
    paragraphLines.push(trimmedLine)
  }

  flushParagraph()
  flushList()

  return blocks
}

function FormattedMessageContent({ content }: { content: string }) {
  const blocks = parseMessageBlocks(content)

  if (blocks.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={`${block.type}-${index}`} className="whitespace-pre-wrap">
              {block.text}
            </p>
          )
        }

        const ListTag = block.listType

        return (
          <ListTag
            key={`${block.type}-${block.listType}-${index}`}
            className={cn("space-y-1 pl-5", block.listType === "ul" ? "list-disc" : "list-decimal")}
          >
            {block.items.map((item, itemIndex) => (
              <li key={`${item}-${itemIndex}`}>{item}</li>
            ))}
          </ListTag>
        )
      })}
    </div>
  )
}

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  const time = message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const Icon = isUser ? UserRound : Bot

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
          isUser
            ? "border-[#F69CEB]/35 bg-[#BA3AD3]/20 text-[#F7D7F4]"
            : "border-[#F69CEB]/25 bg-white/[0.06] text-[#F69CEB]",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className={cn("max-w-[86%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-lg px-5 py-4 text-sm leading-6",
            isUser
              ? "bg-gradient-to-br from-[#5C14BB] via-[#BA3AD3] to-[#F69CEB] text-white shadow-glow"
              : "border border-white/[0.12] bg-white/[0.06] text-slate-200 backdrop-blur-xl",
          )}
        >
          <FormattedMessageContent content={message.content} />
          {!isUser && message.sources ? <SourceCitations sources={message.sources} /> : null}
        </div>
        <p className={cn("mt-2 text-xs text-[#A7A7C7]/60", isUser && "text-right")}>{time}</p>
      </div>
    </div>
  )
}
