"use client"

import type React from "react"
import { useEffect } from "react"
import { useAppState, type Course } from "@/lib/store"
import { Code2, Globe, Cpu, ChevronRight, Zap, Clock, Trophy, TrendingUp, ClipboardCheck, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { TestCodeModal } from "./test-code-modal"

const courseIcons: Record<string, React.ReactNode> = {
  python: <Code2 className="h-6 w-6" />,
  web: <Globe className="h-6 w-6" />,
  algorithm: <Cpu className="h-6 w-6" />,
}

export function Dashboard() {
  const { courses, setSelectedCourse, setCurrentView } = useAppState()
  const [showTestModal, setShowTestModal] = useState(false)
  const [profileName, setProfileName] = useState("")

  useEffect(() => {
    const savedProfile = localStorage.getItem("edu_profile")
    if (savedProfile) {
      try {
        const data = JSON.parse(savedProfile)
        if (data.name) setProfileName(data.name)
      } catch {
        // ignore
      }
    }
  }, [])

  const motivationalMessages = [
    "Навіть без світла можна сяяти знаннями. 💡",
    "Кожен рядок коду — крок до мрії! 🚀",
    "Помилки — це частина навчання. Продовжуй! 💪",
    "Сьогодні — чудовий день для програмування! ✨",
  ]
  const [motivation] = useState(() => motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)])

  const handleStartCourse = (course: Course) => {
    setSelectedCourse(course)
    setCurrentView("learning")
  }

  const totalProgress = Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
  const completedTasks = courses.reduce((acc, c) => c.completedTasks, 0)
  const totalTasks = courses.reduce((acc, c) => acc + c.totalTasks, 0)

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        {/* Welcome section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Привіт{profileName ? `, ${profileName}` : ""}!
          </h1>
          <p className="mt-1 text-sm sm:text-base text-primary">{motivation}</p>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Продовжуй навчання навіть без інтернету. Весь прогрес зберігається локально.
          </p>
        </div>

        <div className="mb-6 sm:mb-8 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/20 shrink-0">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Загальний прогрес</p>
                <p className="text-lg sm:text-xl font-bold text-foreground">{totalProgress}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-amber-500/20 shrink-0">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Серія днів</p>
                <p className="text-lg sm:text-xl font-bold text-foreground">0 днів</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-secondary shrink-0">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Час навчання</p>
                <p className="text-lg sm:text-xl font-bold text-foreground">0 год</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/20 shrink-0">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Завершено</p>
                <p className="text-lg sm:text-xl font-bold text-foreground">
                  {completedTasks} / {totalTasks}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-foreground">Доступні курси</h2>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="group border-border bg-card transition-colors hover:border-primary/50">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg ${
                        course.progress > 0 ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {courseIcons[course.icon]}
                    </div>
                    {course.progress > 0 && (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-primary">
                        В процесі
                      </span>
                    )}
                  </div>
                  <CardTitle className="mt-2 sm:mt-3 text-sm sm:text-base">{course.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 sm:mb-3">
                    <div className="mb-1 sm:mb-1.5 flex justify-between text-[10px] sm:text-xs">
                      <span className="text-muted-foreground">Прогрес</span>
                      <span className="font-mono text-foreground">
                        {course.completedTasks}/{course.totalTasks} завдань
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-1 sm:h-1.5" />
                  </div>
                  <Button
                    className="w-full gap-2 text-xs sm:text-sm"
                    variant={course.progress > 0 ? "default" : "secondary"}
                    size="sm"
                    onClick={() => handleStartCourse(course)}
                  >
                    {course.progress > 0 ? "Продовжити" : "Почати"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-foreground">Тестування</h2>
          <Card
            className="group cursor-pointer border-border bg-card transition-colors hover:border-amber-500/50"
            onClick={() => setShowTestModal(true)}
          >
            <CardContent className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-6">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg bg-amber-500/20 shrink-0">
                <ClipboardCheck className="h-6 w-6 sm:h-7 sm:w-7 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">Контрольні тести</h3>
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Перевірка знань з пройденого матеріалу. Потрібен код доступу від викладача.
                </p>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                <span className="rounded-full bg-secondary px-3 py-1 text-[10px] sm:text-xs font-medium text-muted-foreground">
                  3 тести доступно
                </span>
                <span className="sm:mt-1 text-[10px] sm:text-xs text-muted-foreground">Вимагає код</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Offline notice */}
        <div className="rounded-lg border border-border bg-card p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-foreground text-sm sm:text-base">Режим енергозбереження</h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Платформа оптимізована для роботи під час блекаутів. Весь контент курсів завантажено локально.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Test code modal */}
      <TestCodeModal isOpen={showTestModal} onClose={() => setShowTestModal(false)} />
    </main>
  )
}
