"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"

interface ShortcutItem {
  keys: string[]
  description: string
  category: string
}

const SHORTCUTS: ShortcutItem[] = [
  { keys: ["Ctrl", "K"], description: "Відкрити пошук", category: "Навігація" },
  { keys: ["Esc"], description: "Закрити модальні вікна", category: "Навігація" },
  { keys: ["Ctrl", "S"], description: "Зберегти код", category: "Редактор" },
  { keys: ["Tab"], description: "Додати 4 пробіли", category: "Редактор" },
  { keys: ["Ctrl", "/"], description: "Коментар/розкоментувати", category: "Редактор" },
  { keys: ["Ctrl", "Enter"], description: "Виконати код", category: "Редактор" },
  { keys: ["Ctrl", "Z"], description: "Відмінити", category: "Редактор" },
  { keys: ["Ctrl", "Shift", "Z"], description: "Повторити", category: "Редактор" },
  { keys: ["?"], description: "Показати всі шорткати", category: "Допомога" },
]

export default function KeyboardShortcuts({ onSearch }: { onSearch?: (query: string) => void }) {
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K - відкрити пошук
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setShowSearch(true)
      }

      // Esc - закрити все
      if (e.key === "Escape") {
        setShowSearch(false)
        setShowShortcuts(false)
      }

      // ? - показати shortcuts
      if (e.key === "?" && !showSearch) {
        e.preventDefault()
        setShowShortcuts(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
    setShowSearch(false)
    setSearchQuery("")
  }

  return (
    <>
      {/* Search Modal */}
      {showSearch && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 animate-in fade-in duration-200"
            onClick={() => setShowSearch(false)}
          />
          <Card className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg p-4 animate-in slide-in-from-top-4 duration-300">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder="Пошук завдань, курсів, учнів..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="button" size="icon" variant="ghost" onClick={() => setShowSearch(false)}>
                <X className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
              <kbd className="px-2 py-1 bg-muted rounded text-[10px]">Enter</kbd>
              <span>Шукати</span>
              <kbd className="px-2 py-1 bg-muted rounded text-[10px]">Esc</kbd>
              <span>Закрити</span>
            </div>
          </Card>
        </>
      )}

      {/* Shortcuts Help Modal */}
      {showShortcuts && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 animate-in fade-in duration-200"
            onClick={() => setShowShortcuts(false)}
          />
          <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl p-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Клавіатурні скорочення</h3>
              <Button size="icon" variant="ghost" onClick={() => setShowShortcuts(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["Навігація", "Редактор", "Допомога"].map((category) => (
                <div key={category}>
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground">{category}</h4>
                  <div className="space-y-2">
                    {SHORTCUTS.filter((s) => s.category === category).map((shortcut, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span>{shortcut.description}</span>
                        <div className="flex gap-1">
                          {shortcut.keys.map((key) => (
                            <kbd key={key} className="px-2 py-1 bg-muted rounded text-xs font-mono">
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </>
  )
}
