"use client"

import { useEffect } from "react"

export function DevToolsBlocker() {
  useEffect(() => {
    // Note: This is a basic deterrent only. Real security should be server-side.
    // It can be easily bypassed and may interfere with accessibility tools.
    
    // Блокування правої кнопки миші
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Встановлюємо обробники
    document.addEventListener('contextmenu', blockContextMenu)

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu)
    }
  }, [])

  return null
}
