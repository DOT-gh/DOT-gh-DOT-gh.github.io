"use client"

import { useAppState } from "@/lib/store"
import { X, User, Mail, School, Calendar, Award, TrendingUp, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

export function ProfileModal() {
  const { setShowProfile, courses } = useAppState()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [group, setGroup] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const savedProfile = localStorage.getItem("edu_profile")
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile)
        setName(data.name || "")
        setEmail(data.email || "")
        setGroup(data.group || "")
      } catch {
        // ignore
      }
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("edu_profile", JSON.stringify({ name, email, group }))
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
          {/* Avatar and name */}
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
              <p className="text-sm text-muted-foreground">Студент КПІ ім. І. Сікорського</p>
            </div>
          </div>

          {/* Info cards */}
          <div className="mb-6 grid gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <Input
                  type="email"
                  placeholder="your.email@student.kpi.ua"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-7 text-sm bg-transparent border-0 p-0 focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
              <School className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Група</p>
                <Input
                  placeholder="Наприклад: ІС-433"
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
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

          {/* Achievements */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">Досягнення</h4>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                <Award className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Перший крок</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">7 днів поспіль</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1">
                <Award className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Без помилок</span>
              </div>
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

        {/* Footer - Save button instead of Close */}
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
