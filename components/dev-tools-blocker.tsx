"use client"

import { useEffect, useState } from "react"

export function DevToolsBlocker() {
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    const isProductionDomain = typeof window !== "undefined" && window.location.hostname === "dotkit.me"

    if (!isProductionDomain) {
      return // Don't block in development/preview
    }

    // Block right-click context menu
    const handleContextMenu = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      return false
    }

    // Block all keyboard shortcuts for dev tools
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return false
      }
      // Ctrl+Shift+I, J, C (Windows/Linux Dev Tools)
      if (e.ctrlKey && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return false
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return false
      }
      // Ctrl+S (Save)
      if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return false
      }
      // Ctrl+P (Print)
      if (e.ctrlKey && (e.key === "p" || e.key === "P")) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return false
      }
      // Ctrl+A (Select All) - block outside of inputs
      if (e.ctrlKey && (e.key === "a" || e.key === "A")) {
        const target = e.target as HTMLElement
        if (target.tagName !== "TEXTAREA" && target.tagName !== "INPUT") {
          e.preventDefault()
          e.stopPropagation()
          return false
        }
      }
      // Cmd+Option+I, J, C (Mac Dev Tools)
      if (e.metaKey && e.altKey && ["i", "I", "j", "J", "c", "C"].includes(e.key)) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return false
      }
      // Cmd+Option+U (Mac View Source)
      if (e.metaKey && e.altKey && (e.key === "u" || e.key === "U")) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return false
      }
      // Cmd+Shift+C (Mac Inspect)
      if (e.metaKey && e.shiftKey && (e.key === "c" || e.key === "C")) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return false
      }
      // Cmd+S (Mac Save)
      if (e.metaKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      // Cmd+P (Mac Print)
      if (e.metaKey && (e.key === "p" || e.key === "P")) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    // Detect DevTools opening via window size
    const detectDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold

      if (widthThreshold || heightThreshold) {
        setIsBlocked(true)
      }
    }

    // Detect DevTools via debugger - more aggressive
    const detectDebugger = () => {
      const start = performance.now()
      // eslint-disable-next-line no-debugger
      debugger
      const end = performance.now()
      if (end - start > 50) {
        setIsBlocked(true)
      }
    }

    // Block text selection on the page
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement
      // Allow selection only in specific inputs (code editor textarea)
      if (target.tagName === "TEXTAREA" || target.tagName === "INPUT") {
        return true
      }
      e.preventDefault()
      return false
    }

    // Block drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // Block copy - except in code editor
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement
      // Block copy everywhere except specific inputs
      if (target.tagName !== "TEXTAREA" && target.tagName !== "INPUT") {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    // Block cut
    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName !== "TEXTAREA" && target.tagName !== "INPUT") {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    // Add all event listeners with capture
    document.addEventListener("contextmenu", handleContextMenu, true)
    document.addEventListener("keydown", handleKeyDown, true)
    document.addEventListener("selectstart", handleSelectStart, true)
    document.addEventListener("dragstart", handleDragStart, true)
    document.addEventListener("copy", handleCopy, true)
    document.addEventListener("cut", handleCut, true)

    // Also add to window for extra coverage
    window.addEventListener("contextmenu", handleContextMenu, true)
    window.addEventListener("keydown", handleKeyDown, true)

    const sizeInterval = setInterval(detectDevTools, 500)
    const debugInterval = setInterval(detectDebugger, 3000)

    // Disable console methods completely
    const noop = () => {}
    const originalConsole = { ...console }
    Object.keys(console).forEach((key) => {
      ;(console as Record<string, unknown>)[key] = noop
    })

    // Add CSS to prevent selection
    const style = document.createElement("style")
    style.textContent = `
      body {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      textarea, input {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, true)
      document.removeEventListener("keydown", handleKeyDown, true)
      document.removeEventListener("selectstart", handleSelectStart, true)
      document.removeEventListener("dragstart", handleDragStart, true)
      document.removeEventListener("copy", handleCopy, true)
      document.removeEventListener("cut", handleCut, true)
      window.removeEventListener("contextmenu", handleContextMenu, true)
      window.removeEventListener("keydown", handleKeyDown, true)
      clearInterval(sizeInterval)
      clearInterval(debugInterval)
      Object.assign(console, originalConsole)
      style.remove()
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
