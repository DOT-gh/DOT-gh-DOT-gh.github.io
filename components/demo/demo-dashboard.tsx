"use client"

import type React from "react"
import { useState } from "react"
import { Code2, Globe, Cpu, ChevronRight, Sparkles, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { DemoCourse } from "./demo-types"

const courseIcons: Record<string, React.ReactNode> = {
  demo: <Sparkles className="h-6 w-6" />,
  python: <Code2 className="h-6 w-6" />,
  web: <Globe className="h-6 w-6" />,
  algorithm: <Cpu className="h-6 w-6" />,
}

type DemoDashboardProps = {
  courses: DemoCourse[]
  onStartCourse: (course: DemoCourse) => void
  onLogin: () => void
  isLoginLoading: boolean
}

export function DemoDashboard({ courses, onStartCourse, onLogin, isLoginLoading }: DemoDashboardProps) {
  const [motivation] = useState("Спробуйте платформу без реєстрації — повний доступ після входу!")

  const openCourse = courses.find((c) => !c.locked)
  const lockedCourses = courses.filter((c) => c.locked)

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Привіт, Гість!</h1>
          <p className="mt-1 text-sm sm:text-base text-primary">{motivation}</p>
        </div>

        <div className="mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-foreground">Доступні курси</h2>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {openCourse && (
            <Card className="group border-primary/30 bg-card transition-colors hover:border-primary/50 flex flex-col">
              <CardHeader className="pb-2 sm:pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    {courseIcons[openCourse.icon]}
                  </div>
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-primary">
                    ВІДКРИТО
                  </span>
                </div>
                <CardTitle className="mt-2 sm:mt-3 text-sm sm:text-base">{openCourse.title}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">{openCourse.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="space-y-3">
                  <div>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="text-muted-foreground">Прогрес</span>
                      <span className="font-mono text-foreground">
                        {openCourse.completedTasks}/{openCourse.totalTasks} завдань
                      </span>
                    </div>
                    <Progress value={openCourse.progress} className="h-1.5" />
                  </div>
                  <Button
                    className="w-full gap-2 text-sm"
                    size="sm"
                    onClick={() => onStartCourse(openCourse)}
                  >
                    Почати
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Locked courses + paywall */}
        <div className="relative">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 relative filter blur-[3px] pointer-events-none opacity-70 select-none">
            {lockedCourses.map((course) => (
              <Card key={course.id} className="border-border bg-card/50 flex flex-col">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                      {courseIcons[course.icon]}
                    </div>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-2 sm:mt-3 text-sm sm:text-base">{course.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end">
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="text-muted-foreground">Прогрес</span>
                        <span className="font-mono text-muted-foreground">
                          {course.completedTasks}/{course.totalTasks} завдань
                        </span>
                      </div>
                      <Progress value={0} className="h-1.5" />
                    </div>
                    <Button className="w-full gap-2 text-sm" variant="secondary" size="sm" disabled>
                      Заблоковано
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-primary/30 bg-card/95 shadow-2xl backdrop-blur-sm pointer-events-auto">
              <CardContent className="pt-6 text-center space-y-4">
                <p className="text-base font-medium text-foreground">
                  🔒 Повні курси доступні після реєстрації
                </p>
                <p className="text-sm text-muted-foreground">
                  Увійдіть через Google, щоб відкрити Python, Web-розробку та інші курси
                </p>
                <Button className="w-full gap-2" onClick={onLogin} disabled={isLoginLoading}>
                  {isLoginLoading ? "Завантаження..." : "Увійти через Google"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
