"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Accessibility, ZoomIn, ZoomOut } from "lucide-react"

interface AccessibilitySettings {
  fontSize: number
  highContrast: boolean
  dyslexiaFont: boolean
  reducedMotion: boolean
}

export function AccessibilityControls() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 100,
    highContrast: false,
    dyslexiaFont: false,
    reducedMotion: false,
  })

  useEffect(() => {
    const saved = localStorage.getItem("accessibility_settings")
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("accessibility_settings", JSON.stringify(settings))

    // Apply settings
    document.documentElement.style.fontSize = `${settings.fontSize}%`

    if (settings.highContrast) {
      document.body.classList.add("high-contrast")
    } else {
      document.body.classList.remove("high-contrast")
    }

    if (settings.dyslexiaFont) {
      document.body.classList.add("dyslexia-font")
    } else {
      document.body.classList.remove("dyslexia-font")
    }

    if (settings.reducedMotion) {
      document.body.style.setProperty("--animation-duration", "0.01ms")
    } else {
      document.body.style.removeProperty("--animation-duration")
    }
  }, [settings])

  const increaseFontSize = () => {
    setSettings((s) => ({ ...s, fontSize: Math.min(150, s.fontSize + 10) }))
  }

  const decreaseFontSize = () => {
    setSettings((s) => ({ ...s, fontSize: Math.max(80, s.fontSize - 10) }))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Налаштування доступності">
          <Accessibility className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Доступність</h4>

          {/* Font Size */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Розмір тексту</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={decreaseFontSize}
                aria-label="Зменшити шрифт"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="flex-1 text-center text-sm">{settings.fontSize}%</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-transparent"
                onClick={increaseFontSize}
                aria-label="Збільшити шрифт"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <Label htmlFor="high-contrast" className="text-sm">
              Високий контраст
            </Label>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => setSettings((s) => ({ ...s, highContrast: checked }))}
            />
          </div>

          {/* Dyslexia Font */}
          <div className="flex items-center justify-between">
            <Label htmlFor="dyslexia-font" className="text-sm">
              Шрифт для дислексії
            </Label>
            <Switch
              id="dyslexia-font"
              checked={settings.dyslexiaFont}
              onCheckedChange={(checked) => setSettings((s) => ({ ...s, dyslexiaFont: checked }))}
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <Label htmlFor="reduced-motion" className="text-sm">
              Менше анімацій
            </Label>
            <Switch
              id="reduced-motion"
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => setSettings((s) => ({ ...s, reducedMotion: checked }))}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
