"use client"

import { useAppState } from "@/lib/store"
import { X, User, Mail, School, Calendar, Award, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function ProfileModal() {
  const { setShowProfile, courses } = useAppState()

  const totalCompleted = courses.reduce((acc, c) => acc + c.completedTasks, 0)
  const totalTasks = courses.reduce((acc, c) => acc + c.totalTasks, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-lg font-semibold text-foreground">Профіль студента</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowProfile(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Avatar and name */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Дмитро Турчін</h3>
              <p className="text-sm text-muted-foreground">Студент КПІ ім. І. Сікорського</p>
            </div>
          </div>

          {/* Info cards */}
          <div className="mb-6 grid gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm text-foreground">d.turchin@student.kpi.ua</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
              <School className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Група</p>
                <p className="text-sm text-foreground">ІС-433 (4 курс)</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Зареєстрований</p>
                <p className="text-sm text-foreground">15 листопада 2024</p>
              </div>
            </div>
          </div>

          {/* Achievement */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">Досягнення</h4>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1">
                <Award className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs text-primary">Перший крок</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1">
                <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs text-amber-500">7 днів поспіль</span>
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

        {/* Footer */}
        <div className="border-t border-border px-4 py-3">
          <Button variant="secondary" className="w-full" onClick={() => setShowProfile(false)}>
            Закрити
          </Button>
        </div>
      </div>
    </div>
  )
}
