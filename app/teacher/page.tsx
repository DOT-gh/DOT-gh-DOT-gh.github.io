"use client"

import { useState, useEffect } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Sparkles,
  Settings2,
  PlusCircle,
  Search,
  AlertTriangle,
  Trophy,
  ArrowUpDown,
  UserPlus,
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
import { BrandLogo } from "@/components/brand-logo"
import { AIControlCenter } from "@/components/teacher/ai-control-center"
import { AssignmentCreator } from "@/components/teacher/assignment-creator"
import {
  classesData,
  progressByClass,
  summaryStats,
  activityData,
  deviceData,
  topicStats,
  hourlyActivity,
  recentActivity,
  riskStudents,
  topStudents,
  PERIOD_LABEL,
  PERIOD_LABEL_SHORT,
} from "@/lib/students-data"

const COLORS = ["#16a34a", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4"]

// Premium glassmorphism card styles (reused across the dashboard)
const CARD_CLS = "rounded-xl border border-white/5 bg-card/60 shadow-xl backdrop-blur-md"
const CARD_HOVER_CLS = "rounded-xl border border-white/5 bg-card/60 shadow-xl backdrop-blur-md cursor-pointer transition-all hover:border-primary/40 hover:bg-card hover:shadow-primary/5"
const TILE_CLS = "rounded-lg border border-white/5 bg-white/[0.03] p-3 text-center"
// Shared dark-mode chart tooltip style
const TOOLTIP_STYLE = { background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12, color: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" } as const
const AXIS_STROKE = "#52525b"
const GRID_STROKE = "rgba(255,255,255,0.06)"


export default function TeacherPage() {
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)
  const [selectedClass, setSelectedClass] = useLocalStorage<string | null>("teacher_selected_class", null)
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [showStudentDetail, setShowStudentDetail] = useState(false)
  const [activeTab, setActiveTab] = useLocalStorage<string>("teacher_active_tab", "overview")
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage<boolean>("teacher_notifications", true)
  const [classQuery, setClassQuery] = useState("")
  const [studentQuery, setStudentQuery] = useState("")
  const [studentSort, setStudentSort] = useLocalStorage<"progress" | "name" | "activity">("teacher_student_sort", "progress")
  const [statusFilter, setStatusFilter] = useLocalStorage<"all" | "active" | "invited" | "risk">("teacher_status_filter", "all")

  useEffect(() => {
    // Панель відкривається одразу — доступ надається автоматично (демо-режим)
    const urlParams = new URLSearchParams(window.location.search)
    const codeParam = urlParams.get("code")

    localStorage.setItem("teacherAccessCode", codeParam || "Teacher443")
    localStorage.setItem("edu_teacher_access", "true")
    localStorage.setItem("edu_teacher_code", codeParam || "Teacher443")
    setHasAccess(true)
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
  const { totalStudents, totalActive, avgScore, avgProgress } = summaryStats

  // Класи, відфільтровані пошуком, згруповані за паралеллю
  const filteredClasses = classesData.filter(
    (c) =>
      c.name.toLowerCase().includes(classQuery.toLowerCase()) ||
      c.topic.toLowerCase().includes(classQuery.toLowerCase()),
  )
  const parallelOrder = ["5", "8", "9", "10", "11"]
  const groupedClasses = parallelOrder
    .map((p) => ({
      parallel: `${p}-ті класи`,
      classes: filteredClasses.filter((c) => c.name.startsWith(p)),
    }))
    .filter((g) => g.classes.length > 0)

  // Список учнів поточного класу з пошуком, фільтром та сортуванням
  const riskIds = new Set(riskStudents.map((s) => s.id))
  const visibleStudents = (currentClass?.students ?? [])
    .filter((s) => s.name.toLowerCase().includes(studentQuery.toLowerCase()))
    .filter((s) => {
      if (statusFilter === "active") return !s.invited
      if (statusFilter === "invited") return s.invited
      if (statusFilter === "risk") return riskIds.has(s.id)
      return true
    })
    .slice()
    .sort((a, b) => {
      if (studentSort === "name") return a.name.localeCompare(b.name, "uk")
      if (studentSort === "activity") return b.lastActivityTs - a.lastActivityTs
      return b.progress - a.progress
    })

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-1/3 right-0 h-80 w-80 rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-500/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex h-12 items-center justify-between px-2 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground">
              <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div className="flex items-center gap-2 min-w-0">
              <BrandLogo className="shrink-0" />
              <span className="font-mono text-sm font-semibold tracking-tight text-foreground whitespace-nowrap">
                <span className="hidden sm:inline">dot<span className="text-primary">.</span>kit</span>
                <span className="sm:hidden">dot</span>
                <span className="hidden sm:inline text-muted-foreground">.me</span>
              </span>
              <span className="text-muted-foreground/60 text-sm shrink-0">/</span>
              <h1 className="text-sm font-semibold text-foreground whitespace-nowrap truncate">Кабінет вчителя</h1>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              {notificationsEnabled ? <Bell className="h-4 w-4 text-primary" /> : <Bell className="h-4 w-4" />}
            </Button>
            <Badge variant="outline" className="gap-1.5 text-muted-foreground border-border bg-secondary/50">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
              <span className="hidden sm:inline">Архів</span>
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-2 sm:px-4 border-t border-border overflow-x-auto">
          {[
            { id: "overview", label: "Огляд", icon: BarChart3 },
            { id: "classes", label: "Класи", icon: Users },
            { id: "ai", label: "AI Помічник", icon: Settings2 },
            { id: "assignments", label: "Завдання", icon: PlusCircle },
            { id: "activity", label: "Активність", icon: Activity },
            { id: "archive", label: "Архів", icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap -mb-px ${
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

      <main className="relative z-10 flex-1 p-4 sm:p-6 space-y-6">

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            {/* Welcome hero */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-card to-card/40 p-6 backdrop-blur-md">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium uppercase tracking-widest text-primary">Командний центр</span>
              </div>
              <h2 className="relative text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                Вітаємо у кабінеті вчителя
              </h2>
              <p className="relative mt-1 text-sm text-muted-foreground">
                Повний огляд ус��ішності учнів, активності та аналітики · {PERIOD_LABEL}
              </p>
            </div>

            {/* Stats */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Учнів всього", value: totalStudents, sub: `${totalActive} брали участь`, icon: Users, color: "text-primary", glow: "shadow-primary/20", iconBg: "bg-primary/10" },
                { label: "Середній бал", value: avgScore, sub: "По всіх класах", icon: TrendingUp, color: "text-green-400", glow: "shadow-green-500/20", iconBg: "bg-green-500/10" },
                { label: "Прогрес", value: `${avgProgress}%`, sub: "Середній по курсу", icon: CheckCircle2, color: "text-blue-400", glow: "shadow-blue-500/20", iconBg: "bg-blue-500/10" },
                { label: "AI запити", value: summaryStats.totalAiRequests, sub: PERIOD_LABEL_SHORT, icon: Bot, color: "text-amber-400", glow: "shadow-amber-500/20", iconBg: "bg-amber-500/10" },
              ].map((s) => (
                <div key={s.label} className="group relative overflow-hidden rounded-xl border border-white/5 bg-card/60 p-4 shadow-xl backdrop-blur-md transition-all hover:border-white/10 hover:bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.iconBg} shadow-lg ${s.glow}`}>
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                  </div>
                  <p className={`text-3xl font-bold tracking-tight ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 lg:grid-cols-3">
              <Card className={`lg:col-span-2 ${CARD_CLS}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground">Активність за період</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">{PERIOD_LABEL} · кількість активних учнів</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={activityData}>
                      <defs>
                        <linearGradient id="grad-emerald" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4ade80" />
                          <stop offset="100%" stopColor="#16a34a" />
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
                  <CardTitle className="text-sm text-foreground">Пристрої</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Розподіл по типах</CardDescription>
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
                  <CardTitle className="text-sm text-foreground">Прогрес по класах</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Середній % виконаних завдань</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={380}>
                    <BarChart data={progressByClass} layout="vertical">
                      <defs>
                        <linearGradient id="grad-emerald-h" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#16a34a" />
                          <stop offset="100%" stopColor="#4ade80" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} stroke={AXIS_STROKE} />
                      <YAxis dataKey="class" type="category" tick={{ fontSize: 10 }} stroke={AXIS_STROKE} width={58} />
                      <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={TOOLTIP_STYLE} />
                      <Bar dataKey="progress" fill="url(#grad-emerald-h)" radius={[0, 4, 4, 0]} name="Прогрес %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className={CARD_CLS}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-foreground">Популярність тем</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Кількість виконаних завдань</CardDescription>
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

            {/* Група ризику + ТОП учнів */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className={CARD_CLS}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    Потребують уваги
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    {riskStudents.length} учнів · низький прогрес, помилки або давня активність
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {riskStudents.slice(0, 12).map((s) => (
                      <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-amber-500/10 bg-amber-500/[0.04]">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 font-semibold text-xs shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{s.className} · {s.riskReasons.join(", ")}</p>
                        </div>
                        <span className="text-xs font-mono text-amber-400 shrink-0">{s.progress}%</span>
                      </div>
                    ))}
                    {riskStudents.length === 0 && (
                      <p className="text-sm text-muted-foreground py-6 text-center">Немає учнів у групі ризику</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className={CARD_CLS}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                    <Trophy className="h-4 w-4 text-primary" />
                    ТОП учнів
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Найкращі за прогресом та виконаними завданнями</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {topStudents.map((s, i) => (
                      <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 bg-white/[0.03]">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0 ${i < 3 ? "bg-primary/15 text-primary" : "bg-white/5 text-muted-foreground"}`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{s.className} · {s.tasksCompleted}/{s.totalTasks} завдань</p>
                        </div>
                        <span className="text-xs font-mono text-primary shrink-0">{s.progress}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Період підсумки */}
            <Card className={CARD_CLS}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  Підсумки періоду
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">{PERIOD_LABEL}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={TILE_CLS}>
                    <p className="text-2xl font-bold text-primary">{summaryStats.totalSessions}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Сесій навчання</p>
                  </div>
                  <div className={TILE_CLS}>
                    <p className="text-2xl font-bold text-green-400">{summaryStats.totalCompletedTasks}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Завершених завдань</p>
                  </div>
                  <div className={TILE_CLS}>
                    <p className="text-2xl font-bold text-blue-400">{summaryStats.totalHours}г</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Сумарний час</p>
                  </div>
                  <div className={TILE_CLS}>
                    <p className="text-2xl font-bold text-amber-400">{summaryStats.totalOfflineSessions}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Офлайн сесій</p>
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
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Всі класи · {classesData.length} груп
                  </h2>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={classQuery}
                      onChange={(e) => setClassQuery(e.target.value)}
                      placeholder="Пошук класу або теми..."
                      className="pl-8 h-9 bg-white/[0.03] border-white/10 text-sm"
                    />
                  </div>
                </div>

                {groupedClasses.length === 0 && (
                  <p className="text-sm text-muted-foreground py-8 text-center">Нічого не знайдено за запитом «{classQuery}»</p>
                )}

                {groupedClasses.map((group) => (
                  <div key={group.parallel} className="space-y-3">
                    <h3 className="text-xs font-medium text-primary/80 uppercase tracking-wider">{group.parallel}</h3>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {group.classes.map((cls) => (
                        <Card key={cls.id} className={CARD_HOVER_CLS} onClick={() => { setSelectedClass(cls.id); setStudentQuery(""); setStatusFilter("all") }}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="min-w-0">
                                <h3 className="font-semibold text-foreground">{cls.name}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">{cls.topic}</p>
                              </div>
                              <Badge className="border-primary/30 bg-primary/10 text-primary shrink-0 ml-2">{cls.avgScore} балів</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-3 text-center">
                              <div>
                                <p className="text-lg font-bold text-primary">{cls.totalStudents}</p>
                                <p className="text-xs text-muted-foreground">Учнів</p>
                              </div>
                              <div>
                                <p className="text-lg font-bold text-green-400">{cls.activeStudents}</p>
                                <p className="text-xs text-muted-foreground">Активних</p>
                              </div>
                              <div>
                                <p className="text-lg font-bold text-blue-400">{cls.avgProgress}%</p>
                                <p className="text-xs text-muted-foreground">Прогрес</p>
                              </div>
                            </div>
                            <Progress value={cls.avgProgress} className="h-1.5 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : showStudentDetail && selectedStudent ? (
              /* Student detail */
              <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => setShowStudentDetail(false)} className="text-muted-foreground hover:text-foreground hover:bg-white/5">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Назад до класу
                </Button>
                <Card className={CARD_CLS}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-lg ring-1 ring-primary/20">
                          {selectedStudent.name.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-foreground">{selectedStudent.name}</CardTitle>
                          <CardDescription className="text-muted-foreground">{selectedStudent.className} · {selectedStudent.currentTask}</CardDescription>
                        </div>
                      </div>
                      <Badge className={selectedStudent.progress >= 90 ? "border-primary/30 bg-primary/10 text-primary" : "border-white/10 bg-white/5 text-foreground/90"}>
                        {selectedStudent.progress}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { icon: Clock, label: "Час навчання", value: selectedStudent.totalTime, color: "text-primary" },
                        { icon: CheckCircle2, label: "Завдань", value: `${selectedStudent.tasksCompleted}/${selectedStudent.totalTasks}`, color: "text-green-400" },
                        { icon: Bot, label: "AI запити", value: selectedStudent.aiRequestsCount, color: "text-amber-400" },
                        { icon: WifiOff, label: "Офлайн сесій", value: selectedStudent.offlineSessions, color: "text-blue-400" },
                      ].map((s) => (
                        <div key={s.label} className={TILE_CLS}>
                          <s.icon className={`h-4 w-4 ${s.color} mx-auto mb-1.5`} />
                          <p className="text-lg font-bold text-foreground">{s.value}</p>
                          <p className="text-xs text-muted-foreground">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2 text-foreground/90">Загальний прогрес</p>
                      <Progress value={selectedStudent.progress} className="h-2 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary" />
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2 text-foreground/90">Сесії навчання</p>
                      <div className="space-y-2">
                        {selectedStudent.sessions.map((s: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-white/5 bg-white/[0.03]">
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
                            <div className="flex items-center gap-1 text-xs font-medium text-primary">
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
                  <Button variant="ghost" size="sm" onClick={() => setSelectedClass(null)} className="text-muted-foreground hover:text-foreground hover:bg-white/5">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Всі класи
                  </Button>
                  <span className="text-sm font-semibold text-foreground">{currentClass?.name}</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">· {currentClass?.topic}</span>
                </div>

                {/* Пошук + фільтр + сортування */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={studentQuery}
                      onChange={(e) => setStudentQuery(e.target.value)}
                      placeholder="Пошук учня..."
                      className="pl-8 h-9 bg-white/[0.03] border-white/10 text-sm"
                    />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { id: "all", label: "Усі" },
                      { id: "active", label: "Активні" },
                      { id: "invited", label: "Запрошені" },
                      { id: "risk", label: "Група ризику" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setStatusFilter(f.id as typeof statusFilter)}
                        className={`px-2.5 h-9 rounded-md text-xs font-medium border transition-colors ${
                          statusFilter === f.id
                            ? "border-primary/40 bg-primary/15 text-primary"
                            : "border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setStudentSort((s) => (s === "progress" ? "name" : s === "name" ? "activity" : "progress"))}
                      className="flex items-center gap-1 px-2.5 h-9 rounded-md text-xs font-medium border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      {studentSort === "progress" ? "Прогрес" : studentSort === "name" ? "Імʼя" : "Активність"}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">Показано {visibleStudents.length} з {currentClass?.students.length}</p>

                {visibleStudents.map((student) => (
                  <Card key={student.id} className={student.invited ? CARD_CLS : CARD_HOVER_CLS}
                    onClick={() => { if (!student.invited) { setSelectedStudent(student); setShowStudentDetail(true) } }}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full font-semibold text-sm shrink-0 ring-1 ${student.invited ? "bg-white/5 text-muted-foreground ring-white/10" : "bg-gradient-to-br from-primary/20 to-primary/10 text-primary ring-primary/20"}`}>
                          {student.invited ? <UserPlus className="h-4 w-4" /> : student.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 gap-2">
                            <p className="text-sm font-medium truncate text-foreground flex items-center gap-2">
                              {student.name}
                              {student.invited && <Badge variant="outline" className="text-[10px] border-amber-500/30 bg-amber-500/10 text-amber-400 px-1.5 py-0">Запрошено</Badge>}
                              {!student.invited && riskIds.has(student.id) && <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                            </p>
                            <span className="text-xs font-mono text-primary ml-2 shrink-0">{student.invited ? "—" : `${student.progress}%`}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{student.invited ? "Запрошення надіслано · ще не приєднав(-ся/-лась)" : student.currentTask}</p>
                          <Progress value={student.progress} className="h-1 mt-1.5 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-primary" />
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

        {/* ── AI ASSISTANT TAB ── */}
        {activeTab === "ai" && <AIControlCenter />}

        {/* ── ASSIGNMENTS TAB ── */}
        {activeTab === "assignments" && <AssignmentCreator />}

        {/* ── ACTIVITY TAB ── */}
        {activeTab === "activity" && (
          <div className="space-y-4">
            <Card className={CARD_CLS}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                  <Eye className="h-4 w-4 text-primary" />
                  Активність за період
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">{PERIOD_LABEL}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className={TILE_CLS}>
                    <WifiOff className="h-5 w-5 text-amber-400 mx-auto mb-1.5" />
                    <p className="text-xl font-bold text-foreground">{summaryStats.totalOfflineSessions}</p>
                    <p className="text-xs text-muted-foreground">Офлайн сесій за період</p>
                  </div>
                  <div className={TILE_CLS}>
                    <EyeOff className="h-5 w-5 text-blue-400 mx-auto mb-1.5" />
                    <p className="text-xl font-bold text-foreground">{Math.round(summaryStats.totalOfflineSessions * 0.42)}г</p>
                    <p className="text-xs text-muted-foreground">Загальний офлайн час</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={activityData}>
                    <defs>
                      <linearGradient id="grad-emerald-2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#16a34a" />
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
                <CardTitle className="text-sm text-foreground">Активність по годинах</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Типовий розподіл за добу (усереднено)</CardDescription>
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
                <CardTitle className="text-sm text-foreground">Остання активність</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Останні події учнів за період навчання</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recentActivity.map((e, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-white/5 bg-white/[0.03] transition-colors hover:bg-white/[0.06]">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_var(--primary)]" />
                      <span className="font-mono text-xs text-muted-foreground shrink-0">{e.time}</span>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground">{e.student}</span>
                        <span className="text-xs text-muted-foreground ml-2">{e.action}</span>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0 border-white/10 bg-white/5 text-muted-foreground">{e.class}</Badge>
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
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  Архів даних
                </CardTitle>
                <CardDescription className="text-muted-foreground">Статистика попередніх навчальних періодів</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-white/10 bg-white/5 text-foreground hover:bg-white/10 hover:text-foreground" asChild>
                  <Link href="/teacher/practice-2025?code=Teacher443">
                    <BookOpen className="mr-2 h-4 w-4 text-primary" />
                    Практика 2025 — 83 учні, 3 класи (повна статистика)
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Детальна статистика з діаграмами, прогресом учнів та аналітикою по пристроях.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-primary/20 bg-primary/5 shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Майбутнє оновлення
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Після підключення Supabase тут з&apos;являться реальні дані учнів:</p>
                <ul className="space-y-1.5 ml-1">
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
