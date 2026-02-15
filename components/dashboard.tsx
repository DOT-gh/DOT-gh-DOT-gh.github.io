"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAppState, type Course } from "@/lib/store"
import { Code2, Globe, Cpu, ChevronRight, Zap, Trophy, TrendingUp, Award, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { XPProgress } from "@/components/gamification/xp-progress"
import { DailyChallenges } from "@/components/gamification/daily-challenges"
import { AchievementsPanel } from "@/components/gamification/achievements-panel"
import { Leaderboard } from "@/components/gamification/leaderboard"
import ExtendedBadges from "@/components/gamification/extended-badges"
import ThemeSelector from "@/components/theme-selector"

const courseIcons: Record<string, React.ReactNode> = {
  python: <Code2 className="h-6 w-6" />,
  web: <Globe className="h-6 w-6" />,
  algorithm: <Cpu className="h-6 w-6" />,
}

export function Dashboard() {
  const { courses, setSelectedCourse, setCurrentView, xp, level, streak, achievements } = useAppState()
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
    "Навіть без світла можна сяяти знаннями.",
    "Кожен рядок коду - крок до мрії!",
    "Помилки - це частина навчання. Продовжуй!",
    "Сьогодні - чудовий день для програмування!",
  ]
  const [motivation] = useState(() => motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)])

  const handleStartCourse = (course: Course) => {
    setSelectedCourse(course)
    setCurrentView("learning")
  }

  const totalProgress = Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
  const completedTasks = courses.reduce((acc, c) => acc + c.completedTasks, 0)
  const totalTasks = courses.reduce((acc, c) => acc + c.totalTasks, 0)
  const unlockedAchievements = achievements.filter((a) => a.unlocked).length

  return (
    <main className="flex-1 overflow-auto bg-background" data-tour="gamification">
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Привіт{profileName ? `, ${profileName}` : ", гість"}!
          </h1>
          <p className="mt-1 text-sm sm:text-base text-primary">{motivation}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 mb-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              <Card className="border-border bg-card">
                <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/20 shrink-0">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Прогрес</p>
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
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Серія</p>
                    <p className="text-lg sm:text-xl font-bold text-foreground">{streak} днів</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-500/20 shrink-0">
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Відзнаки</p>
                    <p className="text-lg sm:text-xl font-bold text-foreground">{unlockedAchievements}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-500/20 shrink-0">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">Завдань</p>
                    <p className="text-lg sm:text-xl font-bold text-foreground">
                      {completedTasks}/{totalTasks}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-foreground">Доступні курси</h2>
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {/* Активний курс для 8 класу */}
                <Card className="group border-border bg-card transition-colors hover:border-primary/50 flex flex-col">
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <Code2 className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-green-500">
                        АКТИВНО
                      </span>
                    </div>
                    <CardTitle className="mt-2 sm:mt-3 text-sm sm:text-base">8 клас: Таблиці</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Практична робота з таблицями та курсом долара
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <div className="space-y-3">
                      <div>
                        <div className="mb-1.5 flex justify-between text-xs">
                          <span className="text-muted-foreground">Прогрес</span>
                          <parameter name="font-mono text-foreground">0/1 завдань</span>
                        </div>
                        <Progress value={0} className="h-1.5" />
                      </div>
                      <Button
                        className="w-full gap-2 text-sm"
                        variant="default"
                        size="sm"
                        onClick={() => (window.location.href = "/grade8")}
                      >
                        Почати
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Неактивні курси (сірі) */}
                {courses.map((course) => (
                  <Card
                    key={course.id}
                    className="group border-border bg-card/50 flex flex-col opacity-50 cursor-not-allowed"
                  >
                    <CardHeader className="pb-2 sm:pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                          {courseIcons[course.icon]}
                        </div>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground">
                          Незабаром
                        </span>
                      </div>
                      <CardTitle className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground">
                        {course.title}
                      </CardTitle>
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
                          <Progress value={course.progress} className="h-1.5" />
                        </div>
                        <Button className="w-full gap-2 text-sm" variant="secondary" size="sm" disabled>
                          Незабаром
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <XPProgress />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Щоденні завдання</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyChallenges />
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Досягнення</CardTitle>
            <CardDescription>Твої головні успіхи</CardDescription>
          </CardHeader>
          <CardContent>
            <AchievementsPanel />
          </CardContent>
        </Card>

        <Tabs defaultValue="extended" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="extended">Всі досягнення</TabsTrigger>
            <TabsTrigger value="leaderboard">Лідери</TabsTrigger>
            <TabsTrigger value="customization">
              <Palette className="h-3 w-3 mr-1" />
              Персоналізація
            </TabsTrigger>
          </TabsList>
          <TabsContent value="extended" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Всі досягнення (50+)</CardTitle>
                <CardDescription>Розблокуй всі відзнаки щоб отримати ультимативну нагороду</CardDescription>
              </CardHeader>
              <CardContent>
                <ExtendedBadges />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="leaderboard" className="mt-4">
            <Leaderboard />
          </TabsContent>
          <TabsContent value="customization" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Теми та кастомізація</CardTitle>
                <CardDescription>Налаштуй зовнішній вигляд під себе</CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeSelector />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
