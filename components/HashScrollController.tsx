"use client"

import { useEffect } from "react"

function getHashTarget(hash: string) {
  if (!hash || hash === "#") {
    return null
  }

  const id = decodeURIComponent(hash.slice(1))
  return document.getElementById(id)
}

function setPageScrollTop(top: number) {
  const scrollingElement = document.scrollingElement ?? document.documentElement
  scrollingElement.scrollTop = top
  document.documentElement.scrollTop = top
  document.body.scrollTop = top
}

function getScrollRoot() {
  return document.querySelector<HTMLElement>("[data-page-scroll]")
}

function scrollToTarget(target: HTMLElement, behavior: ScrollBehavior = "smooth") {
  const scrollRoot = getScrollRoot()
  const startY = scrollRoot ? scrollRoot.scrollTop : window.scrollY
  const rootTop = scrollRoot ? scrollRoot.getBoundingClientRect().top : 0
  const top = target.getBoundingClientRect().top - rootTop + startY
  const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const resolvedBehavior = shouldReduceMotion ? "auto" : behavior

  if (scrollRoot) {
    scrollRoot.scrollTo({ top, behavior: resolvedBehavior })
  } else {
    window.scrollTo({
      top,
      behavior: resolvedBehavior,
    })
  }

  window.setTimeout(
    () => {
      const currentTop = scrollRoot ? scrollRoot.scrollTop : window.scrollY

      if (Math.abs(currentTop - top) < 4) {
        return
      }

      if (scrollRoot) {
        scrollRoot.scrollTop = top
      } else {
        setPageScrollTop(top)
      }
    },
    resolvedBehavior === "smooth" ? 180 : 0,
  )
}

export function HashScrollController() {
  useEffect(() => {
    const scrollCurrentHash = (behavior: ScrollBehavior = "auto") => {
      const target = getHashTarget(window.location.hash)

      if (target) {
        scrollToTarget(target, behavior)
      }
    }

    const handleClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null
      const hash = anchor?.getAttribute("href")

      if (!hash) {
        return
      }

      const target = getHashTarget(hash)

      if (!target) {
        return
      }

      event.preventDefault()
      event.stopPropagation()
      window.history.pushState(null, "", hash)
      scrollToTarget(target)
    }

    const handleHashChange = () => scrollCurrentHash()

    document.addEventListener("click", handleClick, { capture: true })
    window.addEventListener("hashchange", handleHashChange)
    window.requestAnimationFrame(() => scrollCurrentHash())

    return () => {
      document.removeEventListener("click", handleClick, { capture: true })
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  return null
}
