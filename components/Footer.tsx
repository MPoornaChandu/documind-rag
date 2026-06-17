import { Code, ExternalLink } from "lucide-react"

const footerLinks = [
  {
    label: "GitHub",
    href: "https://github.com/MPoornaChandu",
    icon: Code,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/poorna-chandu-938119379/",
    icon: ExternalLink,
  },
  {
    label: "Project repo",
    href: "https://github.com/MPoornaChandu/documind-rag",
    icon: Code,
  },
  {
    label: "Live demo",
    href: "https://documind-rag-mauve.vercel.app",
    icon: ExternalLink,
  },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.12] px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 text-sm text-[#A7A7C7] sm:flex-row sm:items-center">
        <p>Built by M. Poorna Chandu</p>
        <div className="flex flex-wrap items-center gap-3">
          {footerLinks.map((link) => {
            const Icon = link.icon

            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-4 py-2 text-slate-300 transition hover:border-[#F69CEB]/60 hover:text-white hover:shadow-glow"
                aria-label={link.label}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </a>
            )
          })}
        </div>
      </div>
    </footer>
  )
}
