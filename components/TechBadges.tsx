import { cn } from "@/lib/utils"

const techStack = [
  "RAG",
  "Next.js 14",
  "TypeScript",
  "Gemini API",
  "Supabase",
  "pgvector",
  "Tailwind CSS",
  "Framer Motion",
]

export function TechBadges({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap justify-center gap-3", className)}>
      {techStack.map((tech) => (
        <span
          key={tech}
          className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
        >
          {tech}
        </span>
      ))}
    </div>
  )
}
