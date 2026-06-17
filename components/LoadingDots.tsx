export function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Loading">
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#F69CEB] [animation-delay:-0.24s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#F69CEB] [animation-delay:-0.12s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#F69CEB]" />
    </span>
  )
}
