"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Paintbrush, Check } from "lucide-react"
import { useAppState } from "@/lib/store"
import { toast } from "@/hooks/use-toast"

interface Theme {
  id: string
  name: string
  preview: string
  unlockLevel: number
  unlocked: boolean
}

export function ThemeCustomization() {
  const { level, xp } = useAppState()
  const [currentTheme, setCurrentTheme] = useState("default")

  const themes: Theme[] = [
    {
      id: "default",
      name: "Темна тема",
      preview: "bg-gradient-to-r from-zinc-900 to-zinc-800",
      unlockLevel: 1,
      unlocked: true,
    },
    {
      id: "ocean",
      name: "Океан",
      preview: "bg-gradient-to-r from-blue-900 to-cyan-800",
      unlockLevel: 5,
      unlocked: level >= 5,
    },
    {
      id: "forest",
      name: "Ліс",
      preview: "bg-gradient-to-r from-green-900 to-emerald-800",
      unlockLevel: 10,
      unlocked: level >= 10,
    },
    {
      id: "sunset",
      name: "Захід сонця",
      preview: "bg-gradient-to-r from-orange-900 to-pink-800",
      unlockLevel: 15,
      unlocked: level >= 15,
    },
    {
      id: "galaxy",
      name: "Галактика",
      preview: "bg-gradient-to-r from-purple-900 to-indigo-800",
      unlockLevel: 20,
      unlocked: level >= 20,
    },
    {
      id: "cyberpunk",
      name: "Кіберпанк",
      preview: "bg-gradient-to-r from-fuchsia-900 to-cyan-800",
      unlockLevel: 25,
      unlocked: level >= 25,
    },
  ]

  const handleSelectTheme = (themeId: string, unlocked: boolean) => {
    if (!unlocked) {
      toast({
        variant: "destructive",
        title: "Тема заблокована",
        description: "Підвищ свій рівень щоб розблокувати цю тему",
      })
      return
    }

    setCurrentTheme(themeId)
    localStorage.setItem("editor_theme", themeId)

    toast({
      variant: "success",
      title: "Тему змінено",
      description: "Нова тема застосована до редактора коду",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Paintbrush className="h-4 w-4" />
          Теми редактора
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleSelectTheme(theme.id, theme.unlocked)}
              className={`relative rounded-lg p-3 border-2 transition-all ${
                currentTheme === theme.id
                  ? "border-primary"
                  : theme.unlocked
                    ? "border-border hover:border-primary/50"
                    : "border-border opacity-50"
              }`}
            >
              <div className={`h-16 rounded ${theme.preview} mb-2`} />
              <p className="text-xs font-medium text-center">{theme.name}</p>
              {!theme.unlocked && (
                <p className="text-[10px] text-muted-foreground text-center mt-1">Рівень {theme.unlockLevel}</p>
              )}
              {currentTheme === theme.id && (
                <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
