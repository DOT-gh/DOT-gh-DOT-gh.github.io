"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Users,
  Eye,
  BarChart3,
  ChevronLeft,
  EyeOff,
  WifiOff,
  Timer,
  Smartphone,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowLeft,
  TrendingUp,
  FileText,
  BookOpen,
  Bot,
  Bell,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import Link from "next/link"

const classesData = [
  {
    id: "7a",
    name: "7-А (НУШ)",
    topic: "Алгоритми та виконавці",
    totalStudents: 30,
    activeStudents: 28,
    avgScore: 9.2,
    avgProgress: 94,
    students: [
      { id: "7a-01", name: "Бондаренко А.", progress: 100, lastActivity: "12.04, 14:45", currentTask: "Виконавець Робот - рівень 5", totalTime: "3г 12хв", tasksCompleted: 12, totalTasks: 12, aiRequestsCount: 8, offlineSessions: 4, className: "7-А", sessions: [{ date: "31.03", duration: 45, device: "Android", city: "м. Шостка" }, { date: "04.04", duration: 38, device: "Android", city: "м. Шостка" }, { date: "08.04", duration: 52, device: "Android", city: "м. Шостка" }, { date: "12.04", duration: 47, device: "Android", city: "м. Шостка" }], avgTimePerTask: 16, hintsUsed: 3, errorRate: 12 },
      { id: "7a-02", name: "Василенко О.", progress: 92, lastActivity: "11.04, 13:20", currentTask: "Виконавець Робот - рівень 4", totalTime: "2г 48хв", tasksCompleted: 11, totalTasks: 12, aiRequestsCount: 15, offlineSessions: 2, className: "7-А", sessions: [{ date: "02.04", duration: 40, device: "Windows", city: "м. Шостка" }, { date: "07.04", duration: 35, device: "Windows", city: "м. Шостка" }, { date: "11.04", duration: 53, device: "Windows", city: "м. Шостка" }], avgTimePerTask: 15, hintsUsed: 7, errorRate: 8 },
      { id: "7a-03", name: "Гриценко М.", progress: 75, lastActivity: "10.04, 18:30", currentTask: "Розгалуження - завдання 3", totalTime: "1г 55хв", tasksCompleted: 9, totalTasks: 12, aiRequestsCount: 22, offlineSessions: 5, className: "7-А", sessions: [{ date: "01.04", duration: 25, device: "Android", city: "с. Ямпіль" }, { date: "05.04", duration: 30, device: "Android", city: "с. Ямпіль" }, { date: "10.04", duration: 60, device: "Android", city: "с. Ямпіль" }], avgTimePerTask: 13, hintsUsed: 12, errorRate: 23 },
    ],
  },
  {
    id: "8b",
    name: "8-Б",
    topic: "Основи програмування Python",
    totalStudents: 28,
    activeStudents: 25,
    avgScore: 8.7,
    avgProgress: 81,
    students: [
      { id: "8b-01", name: "Даниленко В.", progress: 95, lastActivity: "12.04, 15:10", currentTask: "Функції Python - завдання 5", totalTime: "4г 20хв", tasksCompleted: 19, totalTasks: 20, aiRequestsCount: 5, offlineSessions: 3, className: "8-Б", sessions: [{ date: "30.03", duration: 55, device: "Chrome OS", city: "м. Шостка" }, { date: "05.04", duration: 48, device: "Windows", city: "м. Шостка" }, { date: "12.04", duration: 57, device: "Windows", city: "м. Шостка" }], avgTimePerTask: 14, hintsUsed: 2, errorRate: 5 },
      { id: "8b-02", name: "Єременко С.", progress: 60, lastActivity: "09.04, 11:00", currentTask: "Цикли - завдання 4", totalTime: "1г 30хв", tasksCompleted: 12, totalTasks: 20, aiRequestsCount: 30, offlineSessions: 1, className: "8-Б", sessions: [{ date: "31.03", duration: 20, device: "iOS", city: "м. Шостка" }, { date: "09.04", duration: 70, device: "iOS", city: "м. Шостка" }], avgTimePerTask: 8, hintsUsed: 18, errorRate: 42 },
    ],
  },
  {
    id: "9v",
    name: "9-В",
    topic: "Веб-розробка: HTML/CSS",
    totalStudents: 25,
    activeStudents: 23,
    avgScore: 9.5,
    avgProgress: 88,
    students: [
      { id: "9v-01", name: "Коваленко Т.", progress: 100, lastActivity: "12.04, 16:00", currentTask: "CSS Flexbox - фінал", totalTime: "5г 10хв", tasksCompleted: 15, totalTasks: 15, aiRequestsCount: 3, offlineSessions: 6, className: "9-В", sessions: [{ date: "30.03", duration: 60, device: "macOS", city: "м. Шостка" }, { date: "03.04", duration: 55, device: "macOS", city: "м. Шостка" }, { date: "08.04", duration: 50, device: "Chrome OS", city: "м. Шостка" }, { date: "12.04", duration: 65, device: "macOS", city: "м. Шостка" }], avgTimePerTask: 21, hintsUsed: 1, errorRate: 3 },
    ],
  },
]

// Активність за період 30.03 - 12.04 (по днях)
const activityData = [
  { time: "30.03", active: 42 }, { time: "31.03", active: 38 }, { time: "01.04", active: 55 },
  { time: "02.04", active: 48 }, { time: "03.04", active: 61 }, { time: "04.04", active: 52 },
  { time: "05.04", active: 47 }, { time: "06.04", active: 12 }, { time: "07.04", active: 15 },
  { time: "08.04", active: 58 }, { time: "09.04", active: 44 }, { time: "10.04", active: 39 },
  { time: "11.04", active: 51 }, { time: "12.04", active: 46 },
]

// Активність за годинами (типовий день, усереднено за період)
const hourlyActivity = [
  { hour: "08:00", active: 3 }, { hour: "10:00", active: 28 }, { hour: "12:00", active: 38 },
  { hour: "14:00", active: 35 }, { hour: "16:00", active: 30 }, { hour: "18:00", active: 25 },
  { hour: "20:00", active: 8 },
]

const deviceData = [
  { name: "Android", value: 38 }, { name: "Windows", value: 31 },
  { name: "iOS", value: 14 }, { name: "macOS", value: 7 },
  { name: "Chrome OS", value: 10 },
]

// Виконання завдань по темах
const topicStats = [
  { topic: "Змінні", completed: 89 },
  { topic: "Умови", completed: 76 },
  { topic: "Цикли", completed: 64 },
  { topic: "Функції", completed: 52 },
  { topic: "Списки", completed: 41 },
  { topic: "Flexbox", completed: 38 },
]

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4"]

const progressByClass = [
  { class: "7-А", progress: 94, score: 9.2 },
  { class: "8-Б", progress: 81, score: 8.7 },
  { class: "9-В", progress: 88, score: 9.5 },
]

export default function TeacherPage() {
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [showStudentDetail, setShowStudentDetail] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  useEffect(() => {
    // Перевіряємо всі можливі місця де може бути збережений код
    const stored1 = localStorage.getItem("teacherAccessCode")
    const stored2 = localStorage.getItem("edu_teacher_access")
    const stored3 = localStorage.getItem("edu_teacher_code")
    const urlParams = new URLSearchParams(window.location.search)
    const codeParam = urlParams.get("code")

    const isValidCode = (c: string | null) => c === "Teacher443" || c === "Teacher123" || c === "true"
    const hasValidAccess = isValidCode(codeParam) || isValidCode(stored1) || isValidCode(stored2) || isValidCode(stored3)

    if (hasValidAccess) {
      setHasAccess(true)
      if (codeParam) {
        localStorage.setItem("teacherAccessCode", codeParam)
        localStorage.setItem("edu_teacher_access", "true")
        localStorage.setItem("edu_teacher_code", codeParam)
      }
    } else {
      router.push("/dashboard")
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

  const currentClass = classesData.find((c) => c.id === selectedClass)
  const totalStudents = classesData.reduce((a, c) => a + c.totalStudents, 0)
  const totalActive = classesData.reduce((a, c) => a + c.activeStudents, 0)
  const avgScore = (classesData.reduce((a, c) => a + c.avgScore, 0) / classesData.length).toFixed(1)
  const avgProgress = Math.round(classesData.reduce((a, c) => a + c.avgProgress, 0) / classesData.length)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold">dot<span className="text-primary">.</span>kit<span className="text-muted-foreground">.me</span></span>
                <span className="text-muted-foreground text-sm">/</span>
                <h1 className="text-sm font-semibold">Кабінет вчителя</h1>
              </div>
              <p className="text-xs text-muted-foreground">Панель моніторингу · Практика 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              {notificationsEnabled ? <Bell className="h-4 w-4" /> : <Bell className="h-4 w-4 text-muted-foreground" />}
            </Button>
            <Badge variant="outline" className="gap-1.5 text-muted-foreground border-muted-foreground/30">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              Архів
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 sm:px-6 border-t border-border overflow-x-auto">
          {[
            { id: "overview", label: "Огляд", icon: BarChart3 },
            { id: "classes", label: "Класи", icon: Users },
            { id: "activity", label: "Активність", icon: Activity },
            { id: "archive", label: "Архів", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 space-y-6">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            {/* Stats */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Учнів всього", value: totalStudents, sub: `${totalActive} брали участь`, icon: Users, color: "text-primary" },
                { label: "Середній бал", value: avgScore, sub: "По всіх класах", icon: TrendingUp, color: "text-green-500" },
                { label: "Прогрес", value: `${avgProgress}%`, sub: "Середній по курсу", icon: CheckCircle2, color: "text-blue-500" },
                { label: "AI запити", value: "103", sub: "30.03 — 12.04", icon: Bot, color: "text-amber-500" },
              ].map((s) => (
                <Card key={s.label}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Активність за період</CardTitle>
                  <CardDescription className="text-xs">30 березня — 12 квітня · кількість активних учнів</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#a1a1aa" />
                      <YAxis tick={{ fontSize: 10 }} stroke="#a1a1aa" />
                      <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 6, fontSize: 12 }} />
                      <Bar dataKey="active" fill="#22c55e" radius={[3, 3, 0, 0]} name="Активних" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Пристрої</CardTitle>
                  <CardDescription className="text-xs">Розподіл по типах</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 6, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Progress by class + Topics */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Прогрес по класах</CardTitle>
                  <CardDescription className="text-xs">Середній % виконаних завдань</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={progressByClass} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#a1a1aa" />
                      <YAxis dataKey="class" type="category" tick={{ fontSize: 11 }} stroke="#a1a1aa" width={35} />
                      <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 6, fontSize: 12 }} />
                      <Bar dataKey="progress" fill="#22c55e" radius={[0, 3, 3, 0]} name="Прогрес %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Популярність тем</CardTitle>
                  <CardDescription className="text-xs">Кількість виконаних завдань</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={topicStats} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis type="number" tick={{ fontSize: 10 }} stroke="#a1a1aa" />
                      <YAxis dataKey="topic" type="category" tick={{ fontSize: 10 }} stroke="#a1a1aa" width={55} />
                      <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 6, fontSize: 12 }} />
                      <Bar dataKey="completed" fill="#3b82f6" radius={[0, 3, 3, 0]} name="Виконано" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Період підсумки */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Підсумки періоду
                </CardTitle>
                <CardDescription className="text-xs">30 березня — 12 квітня 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                    <p className="text-xl font-bold text-primary">647</p>
                    <p className="text-xs text-muted-foreground">Сесій навчання</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                    <p className="text-xl font-bold text-green-500">289</p>
                    <p className="text-xs text-muted-foreground">Завершених завдань</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                    <p className="text-xl font-bold text-blue-500">54г</p>
                    <p className="text-xs text-muted-foreground">Сумарний час</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                    <p className="text-xl font-bold text-amber-500">42</p>
                    <p className="text-xs text-muted-foreground">Офлайн сесій</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* ── CLASSES TAB ── */}
        {activeTab === "classes" && (
          <>
            {!selectedClass ? (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Всі класи</h2>
                {classesData.map((cls) => (
                  <Card key={cls.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedClass(cls.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{cls.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">{cls.topic}</p>
                        </div>
                        <Badge variant="secondary">{cls.avgScore} балів</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                        <div>
                          <p className="text-lg font-bold text-primary">{cls.totalStudents}</p>
                          <p className="text-xs text-muted-foreground">Учнів</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-500">{cls.activeStudents}</p>
                          <p className="text-xs text-muted-foreground">Активних</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-blue-500">{cls.avgProgress}%</p>
                          <p className="text-xs text-muted-foreground">Прогрес</p>
                        </div>
                      </div>
                      <Progress value={cls.avgProgress} className="h-1.5" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : showStudentDetail && selectedStudent ? (
              /* Student detail */
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setShowStudentDetail(false)}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Назад до класу
                </Button>
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{selectedStudent.name}</CardTitle>
                        <CardDescription>{selectedStudent.className} · {selectedStudent.currentTask}</CardDescription>
                      </div>
                      <Badge variant={selectedStudent.progress >= 90 ? "default" : "secondary"}>
                        {selectedStudent.progress}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { icon: Clock, label: "Час навчання", value: selectedStudent.totalTime },
                        { icon: CheckCircle2, label: "Завдань", value: `${selectedStudent.tasksCompleted}/${selectedStudent.totalTasks}` },
                        { icon: Bot, label: "AI запити", value: selectedStudent.aiRequestsCount },
                        { icon: WifiOff, label: "Офлайн сесій", value: selectedStudent.offlineSessions },
                      ].map((s) => (
                        <div key={s.label} className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                          <s.icon className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                          <p className="text-lg font-bold">{s.value}</p>
                          <p className="text-xs text-muted-foreground">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Загальний прогрес</p>
                      <Progress value={selectedStudent.progress} className="h-2" />
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Сесії навчання</p>
                      <div className="space-y-2">
                        {selectedStudent.sessions.map((s: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-secondary/20">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-muted-foreground">{s.date}</span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Smartphone className="h-3 w-3" />
                                {s.device}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {s.city}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium">
                              <Timer className="h-3 w-3 text-primary" />
                              {s.duration} хв
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Class students list */
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedClass(null)}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Всі класи
                  </Button>
                  <span className="text-sm font-semibold">{currentClass?.name}</span>
                </div>
                {currentClass?.students.map((student) => (
                  <Card key={student.id} className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => { setSelectedStudent(student); setShowStudentDetail(true) }}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium truncate">{student.name}</p>
                            <span className="text-xs font-mono text-primary ml-2 shrink-0">{student.progress}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{student.currentTask}</p>
                          <Progress value={student.progress} className="h-1 mt-1.5" />
                        </div>
                        <div className="text-right shrink-0 hidden sm:block">
                          <p className="text-xs text-muted-foreground">{student.lastActivity}</p>
                          <p className="text-xs text-muted-foreground">{student.totalTime}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ACTIVITY TAB ── */}
        {activeTab === "activity" && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Активність за період
                </CardTitle>
                <CardDescription className="text-xs">30 березня — 12 квітня 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                    <WifiOff className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                    <p className="text-xl font-bold">42</p>
                    <p className="text-xs text-muted-foreground">Офлайн сесій за період</p>
                  </div>
                  <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                    <EyeOff className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-xl font-bold">18г</p>
                    <p className="text-xs text-muted-foreground">Загальний офлайн час</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#a1a1aa" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#a1a1aa" />
                    <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 6, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="active" fill="#22c55e" radius={[3, 3, 0, 0]} name="Активних учнів" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Активність по годинах</CardTitle>
                <CardDescription className="text-xs">Типовий розподіл за добу (усереднено)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={hourlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="#a1a1aa" />
                    <YAxis tick={{ fontSize: 10 }} stroke="#a1a1aa" />
                    <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #27272a", borderRadius: 6, fontSize: 12 }} />
                    <Bar dataKey="active" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Учнів онлайн" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Остання активність</CardTitle>
                <CardDescription className="text-xs">Події за 12 квітня 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { time: "12.04 15:42", student: "Бондаренко А.", action: "Завершив завдання", class: "7-А" },
                    { time: "12.04 15:30", student: "Коваленко Т.", action: "Запитав AI підказку", class: "9-В" },
                    { time: "12.04 15:10", student: "Даниленко В.", action: "Розпочав новий модуль", class: "8-Б" },
                    { time: "12.04 14:55", student: "Василенко О.", action: "Увійшов в офлайн режим", class: "7-А" },
                    { time: "11.04 18:20", student: "Гриценко М.", action: "Отримав досягнення", class: "7-А" },
                    { time: "11.04 16:05", student: "Даниленко В.", action: "Завершив тему 'Функції'", class: "8-Б" },
                    { time: "10.04 14:40", student: "Єременко С.", action: "Розпочав завдання", class: "8-Б" },
                  ].map((e, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-secondary/20">
                      <span className="font-mono text-xs text-muted-foreground shrink-0">{e.time}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium">{e.student}</span>
                        <span className="text-xs text-muted-foreground ml-2">{e.action}</span>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">{e.class}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── ARCHIVE TAB ── */}
        {activeTab === "archive" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Архів даних
                </CardTitle>
                <CardDescription>Статистика попередніх навчальних періодів</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/teacher/practice-2025">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Практика 2025 — 83 учні, 3 класи (повна статистика)
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Детальна статистика з діаграмами, прогресом учнів та аналітикою по пристроях.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm">Майбутнє оновлення</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Після підключення Supabase тут з&apos;являться реальні дані учнів:</p>
                <ul className="space-y-1 ml-3">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Реальні результати навчання</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Автоматичні звіти по класах</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Експорт в Excel/PDF</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
