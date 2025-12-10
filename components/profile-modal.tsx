"use client"

import { useAppState } from "@/lib/store"
import {
  X,
  User,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  Check,
  Star,
  Zap,
  Target,
  BookOpen,
  Code,
  Trophy,
  Flame,
  Clock,
  Heart,
  Shield,
  Rocket,
  Brain,
  Sparkles,
  Crown,
  Medal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

const allAchievements = [
  { id: 1, icon: Award, name: "Перший крок", unlocked: false },
  { id: 2, icon: TrendingUp, name: "7 днів поспіль", unlocked: false },
  { id: 3, icon: Star, name: "Без помилок", unlocked: false },
  { id: 4, icon: Zap, name: "Швидкий старт", unlocked: false },
  { id: 5, icon: Target, name: "Снайпер", unlocked: false },
  { id: 6, icon: BookOpen, name: "Книжковий черв'як", unlocked: false },
  { id: 7, icon: Code, name: "Кодер", unlocked: false },
  { id: 8, icon: Trophy, name: "Чемпіон", unlocked: false },
  { id: 9, icon: Flame, name: "У вогні", unlocked: false },
  { id: 10, icon: Clock, name: "Ранній птах", unlocked: false },
  { id: 11, icon: Heart, name: "Відданий", unlocked: false },
  { id: 12, icon: Shield, name: "Захисник", unlocked: false },
  { id: 13, icon: Rocket, name: "Ракета", unlocked: false },
  { id: 14, icon: Brain, name: "Геній", unlocked: false },
  { id: 15, icon: Sparkles, name: "Майстер", unlocked: false },
  { id: 16, icon: Crown, name: "Король", unlocked: false },
  { id: 17, icon: Medal, name: "Медаліст", unlocked: false },
  { id: 18, icon: Star, name: "Зірка", unlocked: false },
]

export function ProfileModal() {
  const { setShowProfile, courses } = useAppState()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const savedProfile = localStorage.getItem("edu_profile")
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile)
        setName(data.name || "")
        setEmail(data.email || "")
      } catch {
        // ignore
      }
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("edu_profile", JSON.stringify({ name, email }))
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setShowProfile(false)
    }, 1000)
  }

  const totalCompleted = courses.reduce((acc, c) => acc + c.completedTasks, 0)
  const totalTasks = courses.reduce((acc, c) => acc + c.totalTasks, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-auto rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sticky top-0 bg-card z-10">
          <h2 className="text-lg font-semibold text-foreground">Профіль студента</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowProfile(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Avatar and name - Removed university mention */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <Input
                placeholder="Введіть ваше ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg font-semibold mb-1 bg-secondary/30"
              />
            </div>
          </div>

          {/* Info cards - Removed group field */}
          <div className="mb-6 grid gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-7 text-sm bg-transparent border-0 p-0 focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Зареєстрований</p>
                <p className="text-sm text-foreground">Сьогодні</p>
              </div>
            </div>
          </div>

          {/* Achievements - Added many locked achievements */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">Досягнення</h4>
            <div className="flex flex-wrap gap-2">
              {allAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 ${
                    achievement.unlocked ? "bg-primary/20 text-primary" : "bg-secondary/50 text-muted-foreground/50"
                  }`}
                >
                  <achievement.icon className="h-3.5 w-3.5" />
                  <span className="text-xs">{achievement.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">Загальний прогрес</h4>
            <div className="rounded-lg border border-border bg-secondary/30 p-3">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Виконано завдань</span>
                <span className="font-mono text-foreground">
                  {totalCompleted} / {totalTasks}
                </span>
              </div>
              <Progress value={(totalCompleted / totalTasks) * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3 sticky bottom-0 bg-card">
          <Button className="w-full gap-2" onClick={handleSave} variant={saved ? "secondary" : "default"}>
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Збережено!
              </>
            ) : (
              "Зберегти профіль"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
