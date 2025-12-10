"use client"

import { useAppState } from "@/lib/store"
import { X, Moon, Sun, Volume2, VolumeX, Download, Trash2, HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

export function SettingsModal() {
  const { setShowSettings, isOffline, setIsOffline, batteryLevel, fontSize, setFontSize, storageUsed, setStorageUsed } =
    useAppState()
  const [darkMode, setDarkMode] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [displayedStorage, setDisplayedStorage] = useState(storageUsed)
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCache = () => {
    setIsClearing(true)
    const startValue = displayedStorage
    const duration = 1500
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      const currentValue = startValue * (1 - eased)

      setDisplayedStorage(Math.max(0, Number(currentValue.toFixed(2))))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayedStorage(0)
        setStorageUsed(0)
        setIsClearing(false)
      }
    }

    requestAnimationFrame(animate)
  }

  const handleSave = () => {
    // Settings are auto-saved via store
    setShowSettings(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-auto rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sticky top-0 bg-card z-10">
          <h2 className="text-lg font-semibold text-foreground">Налаштування</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowSettings(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Appearance */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Зовнішній вигляд</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {darkMode ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-amber-500" />}
                  <span className="text-sm text-foreground">Темна тема (OLED)</span>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-foreground">Розмір шрифту редактора</span>
                  <span className="font-mono text-xs text-muted-foreground">{fontSize}px</span>
                </div>
                <Slider
                  value={[fontSize]}
                  onValueChange={(v) => setFontSize(v[0])}
                  min={12}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Sound */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Звук</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-primary" />
                ) : (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <span className="text-sm text-foreground">Звукові ефекти</span>
                  <p className="text-xs text-muted-foreground">Звуки: клік, успіх, помилка, друк</p>
                </div>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
          </div>

          {/* Offline Mode */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Офлайн режим</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">Автозбереження прогресу</span>
                </div>
                <Switch checked={autoSave} onCheckedChange={setAutoSave} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Примусовий офлайн</span>
                </div>
                <Switch checked={isOffline} onCheckedChange={setIsOffline} />
              </div>
            </div>
          </div>

          {/* Storage */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Сховище</h3>
            <div className="rounded-lg border border-border bg-secondary/30 p-3">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Використано</span>
                <span className="font-mono text-foreground transition-all">
                  {displayedStorage.toFixed(2)} MB / 50 MB
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${(displayedStorage / 50) * 100}%` }}
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="mt-3 w-full gap-2"
                onClick={handleClearCache}
                disabled={isClearing || displayedStorage === 0}
              >
                <Trash2 className={`h-3.5 w-3.5 ${isClearing ? "animate-spin" : ""}`} />
                {isClearing ? "Очищення..." : "Очистити кеш"}
              </Button>
            </div>
          </div>

          {/* Battery warning */}
          {batteryLevel <= 20 && (
            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-3">
              <p className="text-sm text-amber-500">
                Увага: низький заряд батареї ({batteryLevel}%). Рекомендуємо зберегти прогрес.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3 sticky bottom-0 bg-card">
          <Button className="w-full" onClick={handleSave}>
            Зберегти налаштування
          </Button>
        </div>
      </div>
    </div>
  )
}
