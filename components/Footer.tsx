import { Code, ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-sm text-slate-400 sm:flex-row">
        <p>Built by M. Poorna Chandu</p>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-300 transition hover:border-blue-400/60 hover:text-white"
            aria-label="GitHub"
          >
            <Code className="h-4 w-4" />
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-slate-300 transition hover:border-cyan-300/60 hover:text-white"
            aria-label="LinkedIn"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
