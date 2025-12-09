"use client"

import { useEffect } from "react"

export function DevToolsBlocker() {
  useEffect(() => {
    // Базовий блокер Developer Tools (не 100% надійний, але створює базовий захист)
    const detectDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      
      if (widthThreshold || heightThreshold) {
        console.clear()
      }
    }

    // Блокування правої кнопки миші
    const blockContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Блокування гарячих клавіш
    const blockKeys = (e: KeyboardEvent) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault()
        return false
      }
    }

    // Встановлюємо обробники
    document.addEventListener('contextmenu', blockContextMenu)
    document.addEventListener('keydown', blockKeys)
    const interval = setInterval(detectDevTools, 1000)

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu)
      document.removeEventListener('keydown', blockKeys)
      clearInterval(interval)
    }
  }, [])

  return null
}
