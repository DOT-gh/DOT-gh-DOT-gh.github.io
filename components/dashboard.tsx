"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAppState, type Course } from "@/lib/store"
import { Code2, Globe, Cpu, ChevronRight, Zap, Trophy, TrendingUp, Award, Sparkles, Clock, CheckCircle2 } from "lucide-react"
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
  const [showAchievementsPanel, setShowAchievementsPanel] = useState(false)

  useEffect(() => {
    // Спочатку пробуємо отримати ім'я з Google через Supabase
    import("@/lib/supabase/client").then(({ createClient }) => {
      createClient().auth.getUser().then(({ data }) => {
        if (data.user) {
          const meta = data.user.user_metadata
          const name = meta?.full_name || meta?.name || data.user.email?.split("@")[0]
          if (name) { setProfileName(name); return }
        }
        // Fallback: localStorage
        const savedProfile = localStorage.getItem("edu_profile")
        if (savedProfile) {
          try { const d = JSON.parse(savedProfile); if (d.name) setProfileName(d.name) } catch { /* ignore */ }
        }
      })
    })
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

  const realTotalProgress = Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
  const realCompletedTasks = courses.reduce((acc, c) => acc + c.completedTasks, 0)
  const totalTasks = courses.reduce((acc, c) => acc + c.totalTasks, 0)
  const realUnlockedAchievements = achievements.filter((a) => a.unlocked).length

  // ─── DEMO MODE: active when profile name is "Дмитро" ───
  const isDemoMode = profileName.trim().toLowerCase() === "дмитро"

  // When demo mode is active — overlay rich demo statistics for demonstration
  const totalProgress = isDemoMode ? 88 : realTotalProgress
  const completedTasks = isDemoMode ? 16 : realCompletedTasks
  const demoTotalTasks = isDemoMode ? 18 : totalTasks
  const demoStreak = isDemoMode ? 4 : streak
  const demoXP = isDemoMode ? 2340 : xp
  const demoLevel = isDemoMode ? 5 : level
  const unlockedAchievements = isDemoMode ? 12 : realUnlockedAchievements

  // Per-course demo progress overrides
  const getCourseProgress = (courseId: string): { completed: number; total: number; progress: number } => {
    if (!isDemoMode) return { completed: 0, total: 0, progress: 0 }
    const demoData: Record<string, { completed: number; total: number; progress: number }> = {
      python: { completed: 8, total: 10, progress: 80 },
      web: { completed: 5, total: 6, progress: 83 },
      algorithm: { completed: 3, total: 5, progress: 60 },
    }
    return demoData[courseId] || { completed: 0, total: 0, progress: 0 }
  }

  // Recent demo activity (shown in a card when demo mode is on)
  const demoActivity = [
    { time: "Сьогодні, 14:32", title: "Завершено тему 'Цикли for'", course: "Python", type: "complete" as const },
    { time: "Сьогодні, 13:15", title: "Розпочато практику 'Таблиці HTML'", course: "Web", type: "start" as const },
    { time: "Вчора, 19:40", title: "Отримано досягнення 'Марафонець'", course: "Загальне", type: "badge" as const },
    { time: "Вчора, 18:02", title: "Завершено тест 'Умовні оператори'", course: "Python", type: "complete" as const },
    { time: "15 квітня, 16:20", title: "Запит до ШІ-тьютора: пояснення range()", course: "Python", type: "ai" as const },
    { time: "14 квітня, 21:11", title: "Завершено тему 'Flexbox'", course: "Web", type: "complete" as const },
  ]

  return (
    <main className="flex-1 overflow-auto bg-background" data-tour="gamification">
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Привіт{profileName ? `, ${profileName}` : ", гість"}!
          </h1>
          <p className="mt-1 text-sm sm:text-base text-primary">{motivation}</p>

          {isDemoMode && (
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-primary/40 bg-primary/10 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary">Демо-профіль активовано</p>
                <p className="text-xs text-muted-foreground">
                  Статистика, прогрес курсів та досягнення заповнені автоматично для презентації
                </p>
              </div>
              <span className="hidden sm:inline-flex shrink-0 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">
                DEMO
              </span>
            </div>
          )}
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
                    <p className="text-lg sm:text-xl font-bold text-foreground">{demoStreak} днів</p>
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
                      {completedTasks}/{demoTotalTasks}
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
                          <span className="font-mono text-foreground">0/1 завдань</span>
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

                {/* Активні курси */}
                {courses.map((course) => {
                  const demoStats = getCourseProgress(course.icon)
                  const displayCompleted = isDemoMode ? demoStats.completed : course.completedTasks
                  const displayTotal = isDemoMode ? demoStats.total : course.totalTasks
                  const displayProgress = isDemoMode ? demoStats.progress : course.progress

                  return (
                    <Card
                      key={course.id}
                      className="group border-border bg-card transition-colors hover:border-primary/50 flex flex-col cursor-pointer"
                      onClick={() => handleStartCourse(course)}
                    >
                      <CardHeader className="pb-2 sm:pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                            {courseIcons[course.icon]}
                          </div>
                          <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-green-500">
                            {isDemoMode && displayProgress >= 80 ? "МАЙЖЕ" : "АКТИВНО"}
                          </span>
                        </div>
                        <CardTitle className="mt-2 sm:mt-3 text-sm sm:text-base">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-end">
                        <div className="space-y-3">
                          <div>
                            <div className="mb-1.5 flex justify-between text-xs">
                              <span className="text-muted-foreground">Прогрес</span>
                              <span className="font-mono text-foreground">
                                {displayCompleted}/{displayTotal} завдань
                              </span>
                            </div>
                            <Progress value={displayProgress} className="h-1.5" />
                          </div>
                          <Button className="w-full gap-2 text-sm" variant="default" size="sm">
                            {isDemoMode ? "Продовжити" : "Почати"}
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
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

            {isDemoMode && (
              <Card className="border-primary/30 bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Остання активність
                  </CardTitle>
                  <CardDescription className="text-xs">Події за тиждень</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {demoActivity.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-md border border-border/60 bg-secondary/30 p-2.5"
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                          item.type === "complete"
                            ? "bg-green-500/15 text-green-500"
                            : item.type === "badge"
                              ? "bg-amber-500/15 text-amber-500"
                              : item.type === "ai"
                                ? "bg-blue-500/15 text-blue-500"
                                : "bg-primary/15 text-primary"
                        }`}
                      >
                        {item.type === "complete" && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {item.type === "badge" && <Trophy className="h-3.5 w-3.5" />}
                        {item.type === "ai" && <Sparkles className="h-3.5 w-3.5" />}
                        {item.type === "start" && <Zap className="h-3.5 w-3.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground leading-tight">
                          {item.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <span>{item.time}</span>
                          <span>·</span>
                          <span className="font-mono">{item.course}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Achievements Banner — collapsible */}
        <div className="mb-6">
          <button
            onClick={() => setShowAchievementsPanel(!showAchievementsPanel)}
            className="w-full flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 font-mono font-bold text-primary text-lg">
                {demoLevel}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">Рівень {demoLevel}</p>
                <p className="text-xs text-muted-foreground">
                  {unlockedAchievements} досягнень розблоковано · Натисни щоб переглянути
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-primary">{demoXP} XP</span>
              <Trophy className="h-4 w-4 text-primary" />
            </div>
          </button>

          {showAchievementsPanel && (
            <div className="mt-3 rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-4 border-b border-border">
                <AchievementsPanel />
              </div>
              <Tabs defaultValue="extended" className="w-full">
                <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-border bg-background h-auto">
                  <TabsTrigger value="extended" className="text-xs py-2.5 rounded-none">Всі досягнення</TabsTrigger>
                  <TabsTrigger value="leaderboard" className="text-xs py-2.5 rounded-none">Лідери</TabsTrigger>
                  <TabsTrigger value="customization" className="text-xs py-2.5 rounded-none">
                    <Palette className="h-3 w-3 mr-1" />
                    Теми
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="extended" className="p-4">
                  <ExtendedBadges />
                </TabsContent>
                <TabsContent value="leaderboard" className="p-4">
                  <Leaderboard />
                </TabsContent>
                <TabsContent value="customization" className="p-4">
                  <ThemeSelector />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
