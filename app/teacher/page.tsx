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
  GraduationCap,
  Sparkles,
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

// Premium glassmorphism card styles (reused across the dashboard)
const CARD_CLS = "rounded-xl border border-white/5 bg-zinc-900/40 shadow-xl backdrop-blur-md"
const CARD_HOVER_CLS = "rounded-xl border border-white/5 bg-zinc-900/40 shadow-xl backdrop-blur-md cursor-pointer transition-all hover:border-emerald-500/40 hover:bg-zinc-900/60 hover:shadow-emerald-500/5"
const TILE_CLS = "rounded-lg border border-white/5 bg-white/[0.03] p-3 text-center"
// Shared dark-mode chart tooltip style
const TOOLTIP_STYLE = { background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12, color: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" } as const
const AXIS_STROKE = "#52525b"
const GRID_STROKE = "rgba(255,255,255,0.06)"

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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500">Перевірка доступу...</p>
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
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-500/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="text-zinc-400 hover:text-white hover:bg-white/5">
              <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white">dot<span className="text-emerald-400">.</span>kit<span className="text-zinc-500">.me</span></span>
                <span className="text-zinc-600 text-sm">/</span>
                <h1 className="text-sm font-semibold text-white">Кабінет вчителя</h1>
              </div>
              <p className="text-xs text-zinc-500">Панель моніторингу · Практика 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-white hover:bg-white/5"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              {notificationsEnabled ? <Bell className="h-4 w-4 text-emerald-400" /> : <Bell className="h-4 w-4" />}
            </Button>
            <Badge variant="outline" className="gap-1.5 text-zinc-400 border-white/10 bg-white/5 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
              Архів
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 sm:px-6 border-t border-white/10 overflow-x-auto">
          {[
            { id: "overview", label: "Огляд", icon: BarChart3 },
            { id: "classes", label: "Класи", icon: Users },
            { id: "activity", label: "Активність", icon: Activity },
            { id: "archive", label: "Архів", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap -mb-px ${
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-400 [text-shadow:0_0_12px_rgb(52_211_153_/_0.5)]"
                  : "border-transparent text-zinc-500 hover:text-white"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="relative z-10 flex-1 p-4 sm:p-6 space-y-6">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            {/* Welcome hero */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-900/30 p-6 backdrop-blur-md">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="relative flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-medium uppercase tracking-widest text-emerald-400">Командний центр</span>
              </div>
              <h2 className="relative text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-emerald-300 bg-clip-text text-transparent">
                Вітаємо у кабінеті вчителя
              </h2>
              <p className="relative mt-1 text-sm text-zinc-400">
                Повний огляд успішності учнів, активності та аналітики за період практики
              </p>
            </div>

            {/* Stats */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Учнів всього", value: totalStudents, sub: `${totalActive} брали участь`, icon: Users, color: "text-emerald-400", glow: "shadow-emerald-500/20", iconBg: "bg-emerald-500/10" },
                { label: "Середній бал", value: avgScore, sub: "По всіх класах", icon: TrendingUp, color: "text-green-400", glow: "shadow-green-500/20", iconBg: "bg-green-500/10" },
                { label: "Прогрес", value: `${avgProgress}%`, sub: "Середній по курсу", icon: CheckCircle2, color: "text-blue-400", glow: "shadow-blue-500/20", iconBg: "bg-blue-500/10" },
                { label: "AI запити", value: "103", sub: "30.03 — 12.04", icon: Bot, color: "text-amber-400", glow: "shadow-amber-500/20", iconBg: "bg-amber-500/10" },
              ].map((s) => (
                <div key={s.label} className="group relative overflow-hidden rounded-xl border border-white/5 bg-zinc-900/40 p-4 shadow-xl backdrop-blur-md transition-all hover:border-white/10 hover:bg-zinc-900/60">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs text-zinc-500">{s.label}</p>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.iconBg} shadow-lg ${s.glow}`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                  </div>
                  <p className={`text-3xl font-bold tracking-tight ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-zinc-500 mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className={`lg:col-span-2 ${CARD_CLS}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white">Активність за період</CardTitle>
                  <CardDescription className="text-xs text-zinc-500">30 березня — 12 квітня · кількість активних учнів</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={activityData}>
                      <defs>
                        <linearGradient id="grad-emerald" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                      <YAxis tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                      <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="active" fill="url(#grad-emerald)" radius={[4, 4, 0, 0]} name="Активних" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className={CARD_CLS}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white">Пристрої</CardTitle>
                  <CardDescription className="text-xs text-zinc-500">Розподіл по типах</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="#18181b" strokeWidth={2}>
                        {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} />
                      <Legend wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Progress by class + Topics */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className={CARD_CLS}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white">Прогрес по класах</CardTitle>
                  <CardDescription className="text-xs text-zinc-500">Середній % виконаних завдань</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={progressByClass} layout="vertical">
                      <defs>
                        <linearGradient id="grad-emerald-h" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#059669" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                      <YAxis dataKey="class" type="category" tick={{ fontSize: 11 }} stroke={AXIS_STROKE} width={35} />
                      <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="progress" fill="url(#grad-emerald-h)" radius={[0, 4, 4, 0]} name="Прогрес %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className={CARD_CLS}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white">Популярність тем</CardTitle>
                  <CardDescription className="text-xs text-zinc-500">Кількість виконаних завдань</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={topicStats} layout="vertical">
                      <defs>
                        <linearGradient id="grad-blue-h" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                      <YAxis dataKey="topic" type="category" tick={{ fontSize: 10 }} stroke={AXIS_STROKE} width={55} />
                      <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="completed" fill="url(#grad-blue-h)" radius={[0, 4, 4, 0]} name="Виконано" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Період підсумки */}
            <Card className={CARD_CLS}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  Підсумки періоду
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">30 березня — 12 квітня 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={TILE_CLS}>
                    <p className="text-2xl font-bold text-emerald-400">647</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Сесій навчання</p>
                  </div>
                  <div className={TILE_CLS}>
                    <p className="text-2xl font-bold text-green-400">289</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Завершених завдань</p>
                  </div>
                  <div className={TILE_CLS}>
                    <p className="text-2xl font-bold text-blue-400">54г</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Сумарний час</p>
                  </div>
                  <div className={TILE_CLS}>
                    <p className="text-2xl font-bold text-amber-400">42</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Офлайн сесій</p>
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
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Всі класи</h2>
                {classesData.map((cls) => (
                  <Card key={cls.id} className={CARD_HOVER_CLS} onClick={() => setSelectedClass(cls.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">{cls.name}</h3>
                          <p className="text-xs text-zinc-500 mt-0.5">{cls.topic}</p>
                        </div>
                        <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">{cls.avgScore} балів</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                        <div>
                          <p className="text-lg font-bold text-emerald-400">{cls.totalStudents}</p>
                          <p className="text-xs text-zinc-500">Учнів</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-400">{cls.activeStudents}</p>
                          <p className="text-xs text-zinc-500">Активних</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-blue-400">{cls.avgProgress}%</p>
                          <p className="text-xs text-zinc-500">Прогрес</p>
                        </div>
                      </div>
                      <Progress value={cls.avgProgress} className="h-1.5 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-400" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : showStudentDetail && selectedStudent ? (
              /* Student detail */
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setShowStudentDetail(false)} className="text-zinc-400 hover:text-white hover:bg-white/5">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Назад до класу
                </Button>
                <Card className={CARD_CLS}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-400 font-bold text-lg ring-1 ring-emerald-500/20">
                          {selectedStudent.name.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-white">{selectedStudent.name}</CardTitle>
                          <CardDescription className="text-zinc-500">{selectedStudent.className} · {selectedStudent.currentTask}</CardDescription>
                        </div>
                      </div>
                      <Badge className={selectedStudent.progress >= 90 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-white/10 bg-white/5 text-zinc-300"}>
                        {selectedStudent.progress}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { icon: Clock, label: "Час навчання", value: selectedStudent.totalTime, color: "text-emerald-400" },
                        { icon: CheckCircle2, label: "Завдань", value: `${selectedStudent.tasksCompleted}/${selectedStudent.totalTasks}`, color: "text-green-400" },
                        { icon: Bot, label: "AI запити", value: selectedStudent.aiRequestsCount, color: "text-amber-400" },
                        { icon: WifiOff, label: "Офлайн сесій", value: selectedStudent.offlineSessions, color: "text-blue-400" },
                      ].map((s) => (
                        <div key={s.label} className={TILE_CLS}>
                          <s.icon className={`h-4 w-4 ${s.color} mx-auto mb-1.5`} />
                          <p className="text-lg font-bold text-white">{s.value}</p>
                          <p className="text-xs text-zinc-500">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2 text-zinc-300">Загальний прогрес</p>
                      <Progress value={selectedStudent.progress} className="h-2 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-400" />
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2 text-zinc-300">Сесії навчання</p>
                      <div className="space-y-2">
                        {selectedStudent.sessions.map((s: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-white/[0.03]">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-zinc-400">{s.date}</span>
                              <div className="flex items-center gap-1 text-xs text-zinc-500">
                                <Smartphone className="h-3 w-3" />
                                {s.device}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-zinc-500">
                                <MapPin className="h-3 w-3" />
                                {s.city}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                              <Timer className="h-3 w-3" />
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
                  <Button variant="ghost" size="sm" onClick={() => setSelectedClass(null)} className="text-zinc-400 hover:text-white hover:bg-white/5">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Всі класи
                  </Button>
                  <span className="text-sm font-semibold text-white">{currentClass?.name}</span>
                </div>
                {currentClass?.students.map((student) => (
                  <Card key={student.id} className={CARD_HOVER_CLS}
                    onClick={() => { setSelectedStudent(student); setShowStudentDetail(true) }}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 text-emerald-400 font-semibold text-sm shrink-0 ring-1 ring-emerald-500/20">
                          {student.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium truncate text-white">{student.name}</p>
                            <span className="text-xs font-mono text-emerald-400 ml-2 shrink-0">{student.progress}%</span>
                          </div>
                          <p className="text-xs text-zinc-500 truncate">{student.currentTask}</p>
                          <Progress value={student.progress} className="h-1 mt-1.5 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-400" />
                        </div>
                        <div className="text-right shrink-0 hidden sm:block">
                          <p className="text-xs text-zinc-500">{student.lastActivity}</p>
                          <p className="text-xs text-zinc-500">{student.totalTime}</p>
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
            <Card className={CARD_CLS}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Eye className="h-4 w-4 text-emerald-400" />
                  Активність за період
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500">30 березня — 12 квітня 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={TILE_CLS}>
                    <WifiOff className="h-5 w-5 text-amber-400 mx-auto mb-1.5" />
                    <p className="text-xl font-bold text-white">42</p>
                    <p className="text-xs text-zinc-500">Офлайн сесій за період</p>
                  </div>
                  <div className={TILE_CLS}>
                    <EyeOff className="h-5 w-5 text-blue-400 mx-auto mb-1.5" />
                    <p className="text-xl font-bold text-white">18г</p>
                    <p className="text-xs text-zinc-500">Загальний офлайн час</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={activityData}>
                    <defs>
                      <linearGradient id="grad-emerald-2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                    <YAxis tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                    <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={TOOLTIP_STYLE} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#a1a1aa" }} />
                    <Bar dataKey="active" fill="url(#grad-emerald-2)" radius={[4, 4, 0, 0]} name="Активних учнів" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className={CARD_CLS}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white">Активність по годинах</CardTitle>
                <CardDescription className="text-xs text-zinc-500">Типовий розподіл за добу (усереднено)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={hourlyActivity}>
                    <defs>
                      <linearGradient id="grad-blue-2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} vertical={false} />
                    <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                    <YAxis tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                    <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="active" fill="url(#grad-blue-2)" radius={[4, 4, 0, 0]} name="Учнів онлайн" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className={CARD_CLS}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white">Остання активність</CardTitle>
                <CardDescription className="text-xs text-zinc-500">Події за 12 квітня 2026</CardDescription>
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
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 bg-white/[0.03] transition-colors hover:bg-white/[0.06]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgb(52_211_153)]" />
                      <span className="font-mono text-xs text-zinc-400 shrink-0">{e.time}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-white">{e.student}</span>
                        <span className="text-xs text-zinc-500 ml-2">{e.action}</span>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0 border-white/10 bg-white/5 text-zinc-400">{e.class}</Badge>
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
            <Card className={CARD_CLS}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5 text-emerald-400" />
                  Архів даних
                </CardTitle>
                <CardDescription className="text-zinc-500">Статистика попередніх навчальних періодів</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 hover:text-white" asChild>
                  <Link href="/teacher/practice-2025">
                    <BookOpen className="mr-2 h-4 w-4 text-emerald-400" />
                    Практика 2025 — 83 учні, 3 класи (повна статистика)
                  </Link>
                </Button>
                <p className="text-xs text-zinc-500">
                  Детальна статистика з діаграмами, прогресом учнів та аналітикою по пристроях.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  Майбутнє оновлення
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-400 space-y-2">
                <p>Після підключення Supabase тут з&apos;являться реальні дані учнів:</p>
                <ul className="space-y-1.5 ml-1">
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Реальні результати навчання</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Автоматичні звіти по класах</li>
                  <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Експорт в Excel/PDF</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
