"use client"

import { useEffect, useState } from "react"

export function DevToolsBlocker() {
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    const isV0Preview =
      typeof window !== "undefined" &&
      (window.location.hostname.includes("vusercontent.net") ||
        window.location.hostname.includes("v0.dev") ||
        window.location.hostname.includes("localhost") ||
        window.location.hostname.includes("127.0.0.1"))

    if (isV0Preview) {
      return // Don't block in development/preview
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault()
        return false
      }
      // Ctrl+Shift+I (Dev Tools)
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault()
        return false
      }
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault()
        return false
      }
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault()
        return false
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault()
        return false
      }
      // Cmd+Option+I (Mac Dev Tools)
      if (e.metaKey && e.altKey && e.key === "i") {
        e.preventDefault()
        return false
      }
      // Cmd+Option+J (Mac Console)
      if (e.metaKey && e.altKey && e.key === "j") {
        e.preventDefault()
        return false
      }
      // Cmd+Option+U (Mac View Source)
      if (e.metaKey && e.altKey && e.key === "u") {
        e.preventDefault()
        return false
      }
    }

    const detectDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold

      if (widthThreshold || heightThreshold) {
        setIsBlocked(true)
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

    const interval = setInterval(detectDevTools, 1000)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      clearInterval(interval)
    }
  }, [])

  if (isBlocked) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#121212]">
        <h1 className="text-2xl text-muted-foreground mb-4">Доступ заборонено</h1>
        <p className="text-muted-foreground">Інструменти розробника відключено для безпеки.</p>
        <p className="text-sm text-muted-foreground mt-2">Перезавантажте сторінку.</p>
      </div>
    )
  }

  return null
}
