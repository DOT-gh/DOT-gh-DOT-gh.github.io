"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAppState } from "@/lib/store"
import { Command } from "lucide-react"

interface Shortcut {
  keys: string[]
  description: string
  action: () => void
}

export function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false)
  const { setShowSettings, setShowProfile, setCurrentView } = useAppState()

  const shortcuts: Shortcut[] = [
    {
      keys: ["Ctrl", "K"],
      description: "Відкрити командну палітру",
      action: () => setShowHelp(true),
    },
    {
      keys: ["Ctrl", ","],
      description: "Відкрити налаштування",
      action: () => setShowSettings(true),
    },
    {
      keys: ["Ctrl", "Shift", "P"],
      description: "Відкрити профіль",
      action: () => setShowProfile(true),
    },
    {
      keys: ["Ctrl", "D"],
      description: "Перейти на Dashboard",
      action: () => setCurrentView("dashboard"),
    },
    {
      keys: ["Escape"],
      description: "Закрити модальне вікно",
      action: () => {
        setShowSettings(false)
        setShowProfile(false)
        setShowHelp(false)
      },
    },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K - Command palette
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault()
        setShowHelp(true)
      }

      // Ctrl+, - Settings
      if (e.ctrlKey && e.key === ",") {
        e.preventDefault()
        setShowSettings(true)
      }

      // Ctrl+Shift+P - Profile
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault()
        setShowProfile(true)
      }

      // Ctrl+D - Dashboard
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault()
        setCurrentView("dashboard")
      }

      // Escape - Close modals
      if (e.key === "Escape") {
        setShowSettings(false)
        setShowProfile(false)
        setShowHelp(false)
      }

      // Ctrl+/ - Toggle comment (for code editor)
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault()
        // Will be handled by code editor
        document.dispatchEvent(new CustomEvent("toggle-comment"))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [setShowSettings, setShowProfile, setCurrentView])

  return (
    <Dialog open={showHelp} onOpenChange={setShowHelp}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Гарячі клавіші
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <span key={keyIndex}>
                    <kbd className="px-2 py-1 text-xs font-semibold bg-secondary text-secondary-foreground rounded border border-border">
                      {key}
                    </kbd>
                    {keyIndex < shortcut.keys.length - 1 && <span className="mx-1 text-muted-foreground">+</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Натисніть <kbd className="px-1 py-0.5 text-xs bg-secondary rounded">Esc</kbd> щоб закрити
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
