"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  ArrowLeft,
  Activity,
  Users,
  Eye,
  Clock,
  TrendingUp,
  BookOpen,
  FileText,
} from "lucide-react"
import Link from "next/link"

export default function TeacherPage() {
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)
  const [visits, setVisits] = useState<any[]>([])
  const [totalVisits, setTotalVisits] = useState(0)
  const [uniqueStudents, setUniqueStudents] = useState(0)
  const [todayVisits, setTodayVisits] = useState(0)

  useEffect(() => {
    // Перевірка коду доступу
    const code = localStorage.getItem("teacherAccessCode")
    const urlParams = new URLSearchParams(window.location.search)
    const codeParam = urlParams.get("code")

    if (code === "Teacher443" || codeParam === "Teacher443") {
      setHasAccess(true)
      if (codeParam) {
        localStorage.setItem("teacherAccessCode", codeParam)
      }
      
      // Завантажуємо статистику відвідувань
      const storedVisits = JSON.parse(localStorage.getItem("grade8_visits") || "[]")
      setVisits(storedVisits)
      setTotalVisits(storedVisits.length)
      
      // Унікальні учні
      const unique = new Set(storedVisits.map((v: any) => `${v.surname} ${v.name}`))
      setUniqueStudents(unique.size)
      
      // Візити сьогодні
      const today = new Date().toDateString()
      const todayCount = storedVisits.filter((v: any) => 
        new Date(v.timestamp).toDateString() === today
      ).length
      setTodayVisits(todayCount)
    } else {
      router.push("/?needCode=teacher")
    }
  }, [router])

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Перевірка доступу...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Кабінет вчителя</h1>
              <p className="text-xs text-muted-foreground">Панель моніторингу</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1.5">
            <Activity className="h-3 w-3" />
            Online
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 px-4 space-y-6">
        {/* Info Card */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Оновлення системи
            </CardTitle>
            <CardDescription>
              Статистика та дані учнів тимчасово недоступні. Система переходить на нову архітектуру з базою даних.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quick Stats - заглушка */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Відвідувачів</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">Очікування даних</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всього відвідувань</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVisits}</div>
              <p className="text-xs text-muted-foreground">
                {totalVisits > 0 ? "Відстежується автоматично" : "Поки що немає відвідувань"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Унікальних учнів</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueStudents}</div>
              <p className="text-xs text-muted-foreground">
                {uniqueStudents > 0 ? "Різних учнів заходило" : "Поки що немає відвідувань"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Візитів сьогодні</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayVisits}</div>
              <p className="text-xs text-muted-foreground">
                {todayVisits > 0 ? `З ${totalVisits} загальних` : "Сьогодні ще не було відвідувань"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">База даних</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">LocalStorage</div>
              <p className="text-xs text-muted-foreground">
                Для повної статистики підключіть Supabase
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Переглядів</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">Очікування даних</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Час навчання</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">Очікування даних</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Visits */}
        <Card>
          <CardHeader>
            <CardTitle>Останні відвідування</CardTitle>
            <CardDescription>
              {visits.length > 0 
                ? `Останні ${Math.min(10, visits.length)} записів`
                : "Тут з'являться відвідування після входу учнів"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {visits.length > 0 ? (
              <div className="space-y-2">
                {visits.slice(-10).reverse().map((visit, i) => {
                  const date = new Date(visit.timestamp)
                  const timeAgo = Math.floor((Date.now() - date.getTime()) / 60000)
                  return (
                    <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{visit.surname} {visit.name}</p>
                          <p className="text-xs text-muted-foreground">Клас: {visit.class}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {timeAgo < 1 ? "Щойно" : timeAgo < 60 ? `${timeAgo} хв тому` : date.toLocaleString("uk-UA")}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 border border-dashed border-border rounded-lg">
                <Activity className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Поки що немає відвідувань</p>
                  <p className="text-xs text-muted-foreground">Дані з'являться коли учні зайдуть на розділ "8 клас"</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Archive Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Архів даних
            </CardTitle>
            <CardDescription>Доступ до статистики попередніх періодів</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/teacher/practice-2025">
                <BookOpen className="mr-2 h-4 w-4" />
                Практика 2025 (83 учні, 3 класи)
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Статичні дані для демонстрації. Реальна аналітика буде доступна після підключення бази даних.
            </p>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Інструкції для вчителя</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-xs">
                1
              </div>
              <div>
                <p className="font-medium text-foreground">Перегляд архівних даних</p>
                <p>Натисніть "Практика 2025" щоб побачити демо-статистику з 83 учнями</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-xs">
                2
              </div>
              <div>
                <p className="font-medium text-foreground">Vercel Analytics</p>
                <p>
                  Аналітика відвідувачів доступна в{" "}
                  <a
                    href="https://vercel.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Vercel Dashboard
                  </a>{" "}
                  → Analytics
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-xs">
                3
              </div>
              <div>
                <p className="font-medium text-foreground">Майбутні оновлення</p>
                <p>
                  Після підключення Supabase тут з'явиться реальна статистика: активні учні, прогрес, час
                  навчання, AI запити
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
