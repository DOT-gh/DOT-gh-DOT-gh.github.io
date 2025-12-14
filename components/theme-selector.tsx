"use client"

import { Palette, Check } from "lucide-react"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { useStore } from "@/lib/store"

interface Theme {
  id: string
  name: string
  preview: string
  unlockLevel: number
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}

const THEMES: Theme[] = [
  {
    id: "default",
    name: "Класична темна",
    preview: "bg-gradient-to-br from-gray-900 to-gray-800",
    unlockLevel: 1,
    colors: { primary: "#10b981", secondary: "#1f2937", accent: "#3b82f6" },
  },
  {
    id: "ocean",
    name: "Океан",
    preview: "bg-gradient-to-br from-blue-900 to-cyan-800",
    unlockLevel: 5,
    colors: { primary: "#06b6d4", secondary: "#0c4a6e", accent: "#0ea5e9" },
  },
  {
    id: "sunset",
    name: "Захід сонця",
    preview: "bg-gradient-to-br from-orange-900 to-pink-800",
    unlockLevel: 10,
    colors: { primary: "#f97316", secondary: "#7c2d12", accent: "#ec4899" },
  },
  {
    id: "forest",
    name: "Ліс",
    preview: "bg-gradient-to-br from-green-900 to-emerald-800",
    unlockLevel: 15,
    colors: { primary: "#10b981", secondary: "#14532d", accent: "#22c55e" },
  },
  {
    id: "purple-haze",
    name: "Фіолетовий туман",
    preview: "bg-gradient-to-br from-purple-900 to-violet-800",
    unlockLevel: 20,
    colors: { primary: "#a855f7", secondary: "#4c1d95", accent: "#c084fc" },
  },
  {
    id: "cyberpunk",
    name: "Кіберпанк",
    preview: "bg-gradient-to-br from-pink-900 via-purple-900 to-blue-900",
    unlockLevel: 25,
    colors: { primary: "#ec4899", secondary: "#1e1b4b", accent: "#06b6d4" },
  },
  {
    id: "matrix",
    name: "Матриця",
    preview: "bg-gradient-to-br from-black to-green-900",
    unlockLevel: 30,
    colors: { primary: "#22c55e", secondary: "#000000", accent: "#10b981" },
  },
  {
    id: "gold",
    name: "Золото",
    preview: "bg-gradient-to-br from-amber-900 to-yellow-800",
    unlockLevel: 50,
    colors: { primary: "#fbbf24", secondary: "#78350f", accent: "#f59e0b" },
  },
]

export default function ThemeSelector() {
  const { level, unlockedThemes, currentTheme, unlockTheme, setCurrentTheme } = useStore()

  const handleSelectTheme = (themeId: string, unlockLevel: number) => {
    if (level >= unlockLevel) {
      if (!unlockedThemes.includes(themeId)) {
        unlockTheme(themeId)
      }
      setCurrentTheme(themeId)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Palette className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Теми редактора</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {THEMES.map((theme) => {
          const isUnlocked = level >= theme.unlockLevel
          const isActive = currentTheme === theme.id

          return (
            <Card
              key={theme.id}
              className={cn(
                "p-4 cursor-pointer transition-all",
                isActive && "ring-2 ring-primary",
                !isUnlocked && "opacity-50",
              )}
              onClick={() => handleSelectTheme(theme.id, theme.unlockLevel)}
            >
              <div className={cn("h-20 rounded-lg mb-3", theme.preview)} />

              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">{theme.name}</p>
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </div>

              <div className="flex items-center justify-between">
                {isUnlocked ? (
                  <Badge variant="secondary" className="text-xs">
                    Доступна
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Рівень {theme.unlockLevel}
                  </Badge>
                )}

                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Розблокуй нові теми досягаючи вищих рівнів. Поточний рівень: {level}
      </p>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
