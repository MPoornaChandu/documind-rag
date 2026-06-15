import { cn } from "@/lib/utils"

const particles = [
  { left: "8%", top: "18%", delay: "0s", duration: "10s" },
  { left: "18%", top: "62%", delay: "1.6s", duration: "13s" },
  { left: "32%", top: "28%", delay: "0.8s", duration: "12s" },
  { left: "48%", top: "72%", delay: "2.4s", duration: "11s" },
  { left: "61%", top: "20%", delay: "1.2s", duration: "14s" },
  { left: "74%", top: "54%", delay: "3s", duration: "12s" },
  { left: "88%", top: "26%", delay: "0.4s", duration: "10s" },
]

export function AnimatedBackground({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0f]", className)} aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_12%,rgba(59,130,246,0.28),transparent_30rem),radial-gradient(circle_at_82%_18%,rgba(139,92,246,0.22),transparent_28rem),linear-gradient(135deg,#0a0a0f,#111827_52%,#0f0a1e)]" />
      <div className="subtle-grid absolute inset-0 opacity-60" />
      <div className="absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute -right-28 top-16 h-80 w-80 rounded-full bg-violet-500/18 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      {particles.map((particle) => (
        <span
          key={`${particle.left}-${particle.top}`}
          className="absolute h-1 w-1 rounded-full bg-cyan-200/80 shadow-[0_0_14px_rgba(34,211,238,0.85)] animate-particle-rise"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  )
}
