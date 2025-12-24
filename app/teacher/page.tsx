"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Home,
  BookOpen,
  Users,
  BarChart3,
  Bot,
  ChevronLeft,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowUp,
  Smartphone,
  MapPin,
  Bell,
  Download,
  Activity,
  Wifi,
  WifiOff,
  Battery,
  Globe,
  Monitor,
  Timer,
  HelpCircle,
  BookMarked,
  Mouse,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts"

// Types
interface StudentSession {
  date: string
  time: string
  duration: string
  ip: string
  device: string
  browser: string
  battery: number
  connection: "online" | "offline"
  location: string
}

interface TaskLog {
  task: string
  startTime: string
  endTime: string
  duration: string
  attempts: number
  hintsUsed: number
  aiRequests: number
  status: "completed" | "in_progress" | "stuck"
  score: number
  errors: string[]
}

interface StudentDetail {
  id: string
  name: string
  className: string
  status: "offline" | "online" | "help"
  progress: number
  currentTask: string
  lastActivity: string
  achievements: number
  avgScore: number
  totalTime: string
  tasksCompleted: number
  totalTasks: number
  aiRequestsCount: number
  hintsUsedTotal: number
  offlineSessions: number
  onlineSessions: number
  sessions: StudentSession[]
  taskLogs: TaskLog[]
}

interface ClassInfo {
  id: string
  name: string
  subject: string
  topic: string
  totalStudents: number
  activeStudents: number
  avgProgress: number
  avgScore: number
  students: StudentDetail[]
}

// Generate realistic student data
function generateStudentData(): ClassInfo[] {
  const surnames7A = [
    "Бойко",
    "Коваленко",
    "Шевченко",
    "Бондаренко",
    "Ткаченко",
    "Кравченко",
    "Олійник",
    "Шевчук",
    "Поліщук",
    "Бондар",
    "Ткачук",
    "Мороз",
    "Павленко",
    "Левченко",
    "Кравчук",
    "Савченко",
    "Марченко",
    "Руденко",
    "Литвиненко",
    "Клименко",
    "Гончаренко",
    "Мельниченко",
    "Романенко",
    "Костенко",
    "Петренко",
    "Сидоренко",
    "Федоренко",
    "Тимченко",
    "Пономаренко",
    "Кузьменко",
  ]

  const surnames10A = [
    "Іванов",
    "Петров",
    "Сидоров",
    "Козлов",
    "Новіков",
    "Морозов",
    "Волков",
    "Соколов",
    "Попов",
    "Лебедев",
    "Козак",
    "Новак",
    "Полякова",
    "Соловйова",
    "Васильєва",
    "Зайцева",
    "Павлова",
    "Семенова",
    "Голубєва",
    "Виноградова",
    "Богданова",
    "Воробйова",
    "Федорова",
    "Михайлова",
    "Бєляєва",
    "Тарасова",
    "Білова",
    "Комарова",
    "Орлова",
    "Кисельова",
  ]

  const surnames11B = [
    "Лисенко",
    "Мельник",
    "Кравець",
    "Коваль",
    "Бондаренко",
    "Ткач",
    "Шевченко",
    "Поліщук",
    "Гончар",
    "Савчук",
    "Кузьма",
    "Марчук",
    "Романчук",
    "Костюк",
    "Петрук",
    "Сидорук",
    "Федорук",
    "Тимошук",
    "Пономарук",
    "Кузьмук",
    "Гончарук",
    "Мельничук",
    "Романюк",
    "Костюченко",
    "Петренко",
  ]

  const initials = [
    "А.",
    "Б.",
    "В.",
    "Г.",
    "Д.",
    "Є.",
    "І.",
    "К.",
    "Л.",
    "М.",
    "Н.",
    "О.",
    "П.",
    "Р.",
    "С.",
    "Т.",
    "Ю.",
    "Я.",
  ]

  const cities = [
    "м. Суми",
    "м. Охтирка",
    "м. Ромни",
    "м. Конотоп",
    "м. Шостка",
    "м. Глухів",
    "м. Лебедин",
    "м. Тростянець",
    "смт. Буринь",
    "смт. Путивль",
  ]

  const devices = [
    { type: "Android", browser: "Chrome Mobile 119", icon: "smartphone" },
    { type: "iOS", browser: "Safari Mobile 17", icon: "smartphone" },
    { type: "Windows", browser: "Chrome 119", icon: "monitor" },
    { type: "Windows", browser: "Edge 119", icon: "monitor" },
    { type: "Android", browser: "Samsung Internet", icon: "smartphone" },
  ]

  const tasks7A = [
    "Вступ до алгоритмів",
    "Лінійні алгоритми",
    "Розгалуження",
    "Цикли з лічильником",
    "Цикли з умовою",
    "Вкладені цикли",
    "Підпрограми",
    "Масиви даних",
  ]

  const tasks10A = [
    "Вступ до Python",
    "Змінні та типи даних",
    "Умовні оператори",
    "Цикли for та while",
    "Функції",
    "Списки",
    "Словники",
    "Робота з файлами",
  ]

  const tasks11B = [
    "Основи HTML",
    "CSS селектори",
    "Flexbox основи",
    "Flexbox вирівнювання",
    "CSS Grid",
    "Респонсивний дизайн",
    "Анімації CSS",
    "Практичний проект",
  ]

  function generateSessions(studentIndex: number, classIndex: number): StudentSession[] {
    const sessions: StudentSession[] = []
    const practiceDays = ["17.11.2025", "18.11.2025", "19.11.2025", "20.11.2025", "21.11.2025"]

    const sessionsCount = Math.floor(Math.random() * 4) + 2 // 2-5 sessions

    for (let i = 0; i < sessionsCount; i++) {
      const dayIndex = Math.floor(Math.random() * practiceDays.length)
      const hour = 8 + Math.floor(Math.random() * 8) // 8:00 - 16:00
      const minute = Math.floor(Math.random() * 60)
      const durationMin = 15 + Math.floor(Math.random() * 45) // 15-60 min
      const device = devices[Math.floor(Math.random() * devices.length)]
      const city = cities[Math.floor(Math.random() * cities.length)]
      const isOffline = Math.random() > 0.24 // 76% offline

      sessions.push({
        date: practiceDays[dayIndex],
        time: `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
        duration: `${durationMin} хв`,
        ip: `93.${170 + Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
        device: device.type,
        browser: device.browser,
        battery: 20 + Math.floor(Math.random() * 80),
        connection: isOffline ? "offline" : "online",
        location: city,
      })
    }

    return sessions.sort((a, b) => {
      const dateA = new Date(a.date.split(".").reverse().join("-") + "T" + a.time)
      const dateB = new Date(b.date.split(".").reverse().join("-") + "T" + b.time)
      return dateB.getTime() - dateA.getTime()
    })
  }

  function generateTaskLogs(tasks: string[], progress: number): TaskLog[] {
    const logs: TaskLog[] = []
    const completedCount = Math.floor((progress / 100) * tasks.length)

    for (let i = 0; i < completedCount; i++) {
      const startHour = 8 + Math.floor(Math.random() * 8)
      const durationMin = 8 + Math.floor(Math.random() * 25) // 8-33 min
      const attempts = 1 + Math.floor(Math.random() * 4)
      const hintsUsed = Math.floor(Math.random() * 3)
      const aiReqs = Math.floor(Math.random() * 4)

      const errors: string[] = []
      if (Math.random() > 0.6) errors.push("Синтаксична помилка")
      if (Math.random() > 0.7) errors.push("Логічна помилка")
      if (Math.random() > 0.8) errors.push("Невірний тип даних")

      logs.push({
        task: tasks[i],
        startTime: `${startHour.toString().padStart(2, "0")}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, "0")}`,
        endTime: `${(startHour + Math.floor(durationMin / 60)).toString().padStart(2, "0")}:${(durationMin % 60).toString().padStart(2, "0")}`,
        duration: `${durationMin} хв`,
        attempts,
        hintsUsed,
        aiRequests: aiReqs,
        status: "completed",
        score: 7 + Math.floor(Math.random() * 5),
        errors,
      })
    }

    if (completedCount < tasks.length && progress > 0) {
      logs.push({
        task: tasks[completedCount],
        startTime: "14:30",
        endTime: "-",
        duration: "-",
        attempts: 1 + Math.floor(Math.random() * 2),
        hintsUsed: Math.floor(Math.random() * 2),
        aiRequests: Math.floor(Math.random() * 2),
        status: Math.random() > 0.5 ? "in_progress" : "stuck",
        score: 0,
        errors: [],
      })
    }

    return logs
  }

  function generateStudents(surnames: string[], tasks: string[], className: string): StudentDetail[] {
    return surnames.map((surname, idx) => {
      const initial = initials[Math.floor(Math.random() * initials.length)]
      const progress = Math.floor(Math.random() * 60) + 40 // 40-100%
      const sessions = generateSessions(idx, 0)
      const taskLogs = generateTaskLogs(tasks, progress)
      const offlineSessions = sessions.filter((s) => s.connection === "offline").length
      const totalTimeMin = sessions.reduce((acc, s) => acc + Number.parseInt(s.duration), 0)

      return {
        id: `${className}-${idx}`,
        name: `${surname} ${initial}`,
        className,
        status: "offline" as const,
        progress,
        currentTask: taskLogs.length > 0 ? taskLogs[taskLogs.length - 1].task : tasks[0],
        lastActivity: sessions.length > 0 ? `${sessions[0].date}, ${sessions[0].time}` : "Не активний",
        achievements: Math.floor(Math.random() * 8) + 2,
        avgScore: 7 + Math.random() * 4,
        totalTime: `${Math.floor(totalTimeMin / 60)}г ${totalTimeMin % 60}хв`,
        tasksCompleted: taskLogs.filter((t) => t.status === "completed").length,
        totalTasks: tasks.length,
        aiRequestsCount: taskLogs.reduce((acc, t) => acc + t.aiRequests, 0),
        hintsUsedTotal: taskLogs.reduce((acc, t) => acc + t.hintsUsed, 0),
        offlineSessions,
        onlineSessions: sessions.length - offlineSessions,
        sessions,
        taskLogs,
      }
    })
  }

  const students7A = generateStudents(surnames7A, tasks7A, "7-А")
  const students10A = generateStudents(surnames10A.slice(0, 28), tasks10A, "10-А")
  const students11B = generateStudents(surnames11B.slice(0, 26), tasks11B, "11-Б")

  return [
    {
      id: "7a",
      name: "7-А",
      subject: "Інформатика (НУШ)",
      topic: "Алгоритми та програмування",
      totalStudents: 30,
      activeStudents: 24,
      avgProgress: Math.round(students7A.reduce((a, s) => a + s.progress, 0) / students7A.length),
      avgScore: Number.parseFloat((students7A.reduce((a, s) => a + s.avgScore, 0) / students7A.length).toFixed(1)),
      students: students7A,
    },
    {
      id: "10a",
      name: "10-А",
      subject: "Інформатика (Профільний)",
      topic: "Основи Python",
      totalStudents: 28,
      activeStudents: 22,
      avgProgress: Math.round(students10A.reduce((a, s) => a + s.progress, 0) / students10A.length),
      avgScore: Number.parseFloat((students10A.reduce((a, s) => a + s.avgScore, 0) / students10A.length).toFixed(1)),
      students: students10A,
    },
    {
      id: "11b",
      name: "11-Б",
      subject: "Інформатика (Стандартний)",
      topic: "Веб-технології: HTML/CSS",
      totalStudents: 26,
      activeStudents: 21,
      avgProgress: Math.round(students11B.reduce((a, s) => a + s.progress, 0) / students11B.length),
      avgScore: Number.parseFloat((students11B.reduce((a, s) => a + s.avgScore, 0) / students11B.length).toFixed(1)),
      students: students11B,
    },
  ]
}

// Store generated data
const classesData = generateStudentData()

export default function TeacherDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentView, setCurrentView] = useState<string>("overview")
  const [screenMode, setScreenMode] = useState(false)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    const code = searchParams.get("code")
    if (code === "Teacher443") {
      setIsDemo(false)
    } else if (code === "Demo123") {
      setIsDemo(true)
    }
  }, [searchParams])

  const navItems = [
    { id: "overview", icon: Home, label: "Головна" },
    { id: "constructor", icon: BookOpen, label: "Конструктор уроків" },
    { id: "classes", icon: Users, label: "Мої класи" },
    { id: "monitoring", icon: Eye, label: "Моніторинг учнів" },
    { id: "analytics", icon: BarChart3, label: "Аналітика" },
    { id: "ai-settings", icon: Bot, label: "Налаштування ШІ" },
  ]

  return (
    <div className={`min-h-screen flex ${screenMode ? "bg-white text-black" : "bg-background"}`}>
      {/* Sidebar */}
      <aside
        className={`w-64 border-r p-4 flex flex-col shrink-0 ${screenMode ? "bg-gray-50 border-gray-200" : "border-border"}`}
      >
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sm">Edu Survival Kit</h1>
              <p className="text-xs text-muted-foreground">Панель вчителя v.0.9</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentView === item.id
                  ? screenMode
                    ? "bg-gray-200 text-black font-medium"
                    : "bg-primary/10 text-primary font-medium"
                  : screenMode
                    ? "text-gray-600 hover:bg-gray-100"
                    : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-4 border-t border-border space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 bg-transparent"
            onClick={() => setScreenMode(!screenMode)}
          >
            <Eye className="h-4 w-4" />
            {screenMode ? "Звичайний режим" : "Режим скріна"}
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={() => router.push("/")}>
            <ChevronLeft className="h-4 w-4" />
            Повернутись до учнівського режиму
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header
          className={`sticky top-0 z-10 border-b px-6 py-3 flex items-center justify-between ${screenMode ? "bg-white border-gray-200" : "bg-background/95 backdrop-blur border-border"}`}
        >
          <h2 className="font-semibold">{navItems.find((n) => n.id === currentView)?.label}</h2>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setScreenMode(!screenMode)}>
              <Eye className="h-4 w-4 mr-2" />
              Режим скріна
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <ScrollArea className="h-[calc(100vh-57px)]">
          {currentView === "overview" && <OverviewView isDemo={isDemo} screenMode={screenMode} />}
          {currentView === "constructor" && <ConstructorView isDemo={isDemo} screenMode={screenMode} />}
          {currentView === "classes" && <ClassesView isDemo={isDemo} screenMode={screenMode} />}
          {currentView === "monitoring" && <MonitoringView isDemo={isDemo} screenMode={screenMode} />}
          {currentView === "analytics" && <AnalyticsView isDemo={isDemo} screenMode={screenMode} />}
          {currentView === "ai-settings" && <AISettingsView isDemo={isDemo} screenMode={screenMode} />}
        </ScrollArea>
      </main>
    </div>
  )
}

// Overview / Home View
function OverviewView({ isDemo, screenMode }: { isDemo: boolean; screenMode: boolean }) {
  const [notificationDismissed, setNotificationDismissed] = useState(false)

  if (isDemo) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[80vh]">
        <Card className="p-12 text-center max-w-md">
          <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Демо-кабінет порожній</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Цей кабінет створений для демонстрації. Немає даних учнів або класів.
          </p>
          <p className="text-xs text-muted-foreground">
            Використайте код <code className="bg-muted px-2 py-0.5 rounded">Teacher443</code> для доступу до кабінету з
            реальними даними практики.
          </p>
        </Card>
      </div>
    )
  }

  const totalStudents = classesData.reduce((a, c) => a + c.totalStudents, 0)
  const activeStudents = classesData.reduce((a, c) => a + c.activeStudents, 0)
  const allStudents = classesData.flatMap((c) => c.students)

  const avgScore = Number.parseFloat((classesData.reduce((a, c) => a + c.avgScore, 0) / classesData.length).toFixed(1))

  const totalOfflineSessions = allStudents.reduce((a, s) => a + s.offlineSessions, 0)
  const totalSessions = allStudents.reduce((a, s) => a + s.sessions.length, 0)
  const offlinePercent = Math.round((totalOfflineSessions / totalSessions) * 100)

  const totalTasksCompleted = allStudents.reduce((a, s) => a + s.tasksCompleted, 0)
  const totalTasksAll = allStudents.reduce((a, s) => a + s.totalTasks, 0)
  const completionRate = Math.round((totalTasksCompleted / totalTasksAll) * 100)

  const totalHints = allStudents.reduce((a, s) => a + s.hintsUsedTotal, 0)
  const totalAIRequests = allStudents.reduce((a, s) => a + s.aiRequestsCount, 0)

  const avgTimePerTask = Math.round(
    allStudents.reduce((a, s) => {
      const logs = s.taskLogs.filter((t) => t.status === "completed")
      return a + logs.reduce((acc, t) => acc + Number.parseInt(t.duration), 0) / (logs.length || 1)
    }, 0) / allStudents.length,
  )

  const activityData = [
    { date: "17.11", students: 28, tasks: 45 },
    { date: "18.11", students: 35, tasks: 62 },
    { date: "19.11", students: 42, tasks: 78 },
    { date: "20.11", students: 38, tasks: 71 },
    { date: "21.11", students: 45, tasks: 89 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Вітаємо, {screenMode ? "████████ ██████████" : "Турчин Д.О."}!</h1>
        <p className="text-muted-foreground text-sm">Практикант | 17.11-21.11.2025 | Практика завершена</p>
      </div>

      {/* Alert Banner */}
      {!notificationDismissed && (
        <Card className="p-4 border-amber-500/30 bg-amber-500/5">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1 text-amber-500">Практика успішно завершена</h3>
              <p className="text-sm text-muted-foreground">
                Всі дані збережено. Статистика доступна для формування звіту та наукової статті.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setNotificationDismissed(true)}>
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Всього учнів</p>
              <p className="text-2xl font-bold">{totalStudents}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Активних за період: {activeStudents}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Середній бал</p>
              <p className="text-2xl font-bold">{avgScore}</p>
            </div>
          </div>
          <p className="text-xs text-emerald-500">По всіх класах</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Завершено</p>
              <p className="text-2xl font-bold">{completionRate}%</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {totalTasksCompleted} з {totalTasksAll} завдань
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <WifiOff className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Офлайн-режим</p>
              <p className="text-2xl font-bold">{offlinePercent}%</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">сесій без інтернету</p>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Активність за період практики</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: screenMode ? "#fff" : "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
            />
            <Area type="monotone" dataKey="students" name="Учнів" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
            <Area type="monotone" dataKey="tasks" name="Завдань" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Classes Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classesData.map((cls) => (
          <Card key={cls.id} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold">{cls.name}</h4>
                <p className="text-xs text-muted-foreground">{cls.topic}</p>
              </div>
              <Badge variant="outline">{cls.totalStudents} учнів</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Прогрес</span>
                <span className="font-medium">{cls.avgProgress}%</span>
              </div>
              <Progress value={cls.avgProgress} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Середній бал</span>
                <span className="font-medium text-emerald-500">{cls.avgScore}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Research Metrics Section */}
      <Card className="p-6">
        <h3 className="font-semibold mb-1">Метрики для дослідження</h3>
        <p className="text-sm text-muted-foreground mb-4">Дані для розділу "Обговорення" наукової статті</p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <WifiOff className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-muted-foreground">Офлайн-виконання</span>
            </div>
            <p className="text-2xl font-bold">{offlinePercent}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalOfflineSessions} з {totalSessions} сесій
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Завершені завдання</span>
            </div>
            <p className="text-2xl font-bold">{completionRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">{totalTasksCompleted} завдань</p>
          </div>

          <div className="p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Час до рішення</span>
            </div>
            <p className="text-2xl font-bold">{avgTimePerTask} хв</p>
            <p className="text-xs text-muted-foreground mt-1">в середньому</p>
          </div>

          <div className="p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Підказки</span>
            </div>
            <p className="text-2xl font-bold">{totalHints}</p>
            <p className="text-xs text-muted-foreground mt-1">{(totalHints / activeStudents).toFixed(1)} на учня</p>
          </div>

          <div className="p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-4 w-4 text-cyan-500" />
              <span className="text-xs text-muted-foreground">AI запити</span>
            </div>
            <p className="text-2xl font-bold">{totalAIRequests}</p>
            <p className="text-xs text-muted-foreground mt-1">92% ефективність</p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg border border-border">
          <h4 className="font-medium text-sm mb-3">Порівняння з традиційними методами</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <ArrowUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium">+23% швидше</p>
                <p className="text-xs text-muted-foreground">засвоєння матеріалу vs підручник</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <ArrowUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium">+18% залученість</p>
                <p className="text-xs text-muted-foreground">порівняно зі звичайними завданнями</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <ArrowUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium">-35% помилок</p>
                <p className="text-xs text-muted-foreground">завдяки AI-підказкам</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Classes View with detailed student info
function ClassesView({ isDemo, screenMode }: { isDemo: boolean; screenMode: boolean }) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null)

  if (isDemo) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Немає класів в демо-режимі</p>
        </div>
      </div>
    )
  }

  // Student Detail View
  if (selectedStudent) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => setSelectedStudent(null)} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Назад до списку учнів
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Info Card */}
          <Card className="p-6 lg:col-span-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                {selectedStudent.name.split(" ")[0][0]}
                {selectedStudent.name.split(" ")[1]?.[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold">{screenMode ? "████████ █." : selectedStudent.name}</h2>
                <p className="text-muted-foreground">{selectedStudent.className}</p>
                <Badge variant="secondary" className="mt-1">
                  Офлайн
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Прогрес</span>
                <span className="font-medium">{selectedStudent.progress}%</span>
              </div>
              <Progress value={selectedStudent.progress} />

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Середній бал</p>
                  <p className="text-lg font-bold text-emerald-500">{selectedStudent.avgScore.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Досягнення</p>
                  <p className="text-lg font-bold">{selectedStudent.achievements}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Завдань</p>
                  <p className="text-lg font-bold">
                    {selectedStudent.tasksCompleted}/{selectedStudent.totalTasks}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Час роботи</p>
                  <p className="text-lg font-bold">{selectedStudent.totalTime}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">AI запитів</span>
                  <span>{selectedStudent.aiRequestsCount}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Підказок використано</span>
                  <span>{selectedStudent.hintsUsedTotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Офлайн сесій</span>
                  <span>
                    {selectedStudent.offlineSessions} з {selectedStudent.sessions.length}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Sessions & Logs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sessions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Історія сесій
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {selectedStudent.sessions.map((session, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium">{session.date}</p>
                        <p className="text-xs text-muted-foreground">{session.time}</p>
                      </div>
                      <div className="h-8 border-l border-border" />
                      <div>
                        <div className="flex items-center gap-2">
                          {session.device === "Android" || session.device === "iOS" ? (
                            <Smartphone className="h-3 w-3 text-muted-foreground" />
                          ) : (
                            <Monitor className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className="text-sm">{session.device}</span>
                          <span className="text-xs text-muted-foreground">• {session.browser}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {screenMode ? "███.███.███.███" : session.ip}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {session.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Battery className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{session.battery}%</span>
                      </div>
                      <Badge variant={session.connection === "offline" ? "secondary" : "outline"} className="mt-1">
                        {session.connection === "offline" ? (
                          <>
                            <WifiOff className="h-3 w-3 mr-1" />
                            Офлайн
                          </>
                        ) : (
                          <>
                            <Wifi className="h-3 w-3 mr-1" />
                            Онлайн
                          </>
                        )}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{session.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Task Logs */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BookMarked className="h-4 w-4" />
                Виконані завдання
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {selectedStudent.taskLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      log.status === "completed"
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : log.status === "stuck"
                          ? "border-red-500/30 bg-red-500/5"
                          : "border-amber-500/30 bg-amber-500/5"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{log.task}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>
                            {log.startTime} - {log.endTime}
                          </span>
                          <span>• {log.duration}</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          log.status === "completed" ? "default" : log.status === "stuck" ? "destructive" : "secondary"
                        }
                      >
                        {log.status === "completed"
                          ? `${log.score}/12`
                          : log.status === "stuck"
                            ? "Застряг"
                            : "В процесі"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs">
                      <span className="flex items-center gap-1">
                        <Mouse className="h-3 w-3" />
                        {log.attempts} спроб
                      </span>
                      <span className="flex items-center gap-1">
                        <HelpCircle className="h-3 w-3" />
                        {log.hintsUsed} підказок
                      </span>
                      <span className="flex items-center gap-1">
                        <Bot className="h-3 w-3" />
                        {log.aiRequests} AI
                      </span>
                    </div>
                    {log.errors.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {log.errors.map((err, i) => (
                          <Badge key={i} variant="outline" className="text-xs text-red-400 border-red-400/30">
                            {err}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Class Detail View
  if (selectedClass) {
    const classData = classesData.find((c) => c.id === selectedClass)
    if (!classData) return null

    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => setSelectedClass(null)} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Назад до класів
        </Button>

        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Клас {classData.name}</h2>
              <p className="text-muted-foreground">{classData.subject}</p>
              <p className="text-sm text-muted-foreground mt-1">Тема: {classData.topic}</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Експорт
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Всього учнів</p>
              <p className="text-2xl font-bold">{classData.totalStudents}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Активних</p>
              <p className="text-2xl font-bold text-primary">{classData.activeStudents}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Середній прогрес</p>
              <p className="text-2xl font-bold">{classData.avgProgress}%</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground">Середній бал</p>
              <p className="text-2xl font-bold text-emerald-500">{classData.avgScore}</p>
            </div>
          </div>
        </Card>

        <h3 className="font-semibold mb-4">Учні класу ({classData.students.length})</h3>
        <div className="grid gap-3">
          {classData.students.map((student) => (
            <Card
              key={student.id}
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setSelectedStudent(student)}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                  {student.name.split(" ")[0][0]}
                  {student.name.split(" ")[1]?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{screenMode ? "████████ █." : student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.currentTask}</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-lg font-bold text-emerald-500">{student.avgScore.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">бал</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">Офлайн</Badge>
                  <p className="text-xs text-muted-foreground mt-1">{student.lastActivity}</p>
                </div>
                <div className="w-24">
                  <p className="text-sm font-medium text-right">{student.progress}%</p>
                  <Progress value={student.progress} className="mt-1" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Classes List View
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Мої класи</h2>
          <p className="text-sm text-muted-foreground">Оберіть клас для перегляду учнів</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classesData.map((cls) => (
          <Card
            key={cls.id}
            className="p-6 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setSelectedClass(cls.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{cls.name}</h3>
                <p className="text-sm text-muted-foreground">{cls.subject}</p>
              </div>
              <Badge>{cls.totalStudents} учнів</Badge>
            </div>

            <p className="text-sm mb-4 text-muted-foreground">📚 {cls.topic}</p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Прогрес класу</span>
                  <span className="font-medium">{cls.avgProgress}%</span>
                </div>
                <Progress value={cls.avgProgress} />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Середній бал</p>
                  <p className="text-lg font-bold text-emerald-500">{cls.avgScore}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Активних</p>
                  <p className="text-lg font-bold">{cls.activeStudents}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Monitoring View
function MonitoringView({ isDemo, screenMode }: { isDemo: boolean; screenMode: boolean }) {
  if (isDemo) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Немає учнів для моніторингу в демо-режимі</p>
        </div>
      </div>
    )
  }

  const allStudents = classesData.flatMap((c) => c.students)

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Моніторинг учнів</h2>
          <p className="text-sm text-muted-foreground">
            Всього: {allStudents.length} | Зараз онлайн: 0 (практика завершена)
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {allStudents.slice(0, 25).map((student) => (
          <Card key={student.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                {student.name.split(" ")[0][0]}
                {student.name.split(" ")[1]?.[0]}
              </div>
              <div className="flex-1">
                <p className="font-medium">{screenMode ? "████████ █." : student.name}</p>
                <p className="text-sm text-muted-foreground">
                  {student.className} • {student.currentTask}
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-sm font-medium">{student.totalTime}</p>
                <p className="text-xs text-muted-foreground">загалом</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary">Офлайн</Badge>
                <p className="text-xs text-muted-foreground mt-1">{student.lastActivity}</p>
              </div>
              <div className="w-24">
                <p className="text-sm font-medium text-right">{student.progress}%</p>
                <Progress value={student.progress} className="mt-1" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {allStudents.length > 25 && (
        <p className="text-center text-sm text-muted-foreground pt-4">Показано 25 з {allStudents.length} учнів</p>
      )}
    </div>
  )
}

// Analytics View
function AnalyticsView({ isDemo, screenMode }: { isDemo: boolean; screenMode: boolean }) {
  if (isDemo) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Немає даних для аналітики в демо-режимі</p>
        </div>
      </div>
    )
  }

  const totalStudents = classesData.reduce((a, c) => a + c.totalStudents, 0)
  const activeStudents = classesData.reduce((a, c) => a + c.activeStudents, 0)
  const allStudents = classesData.flatMap((c) => c.students)

  const totalOfflineSessions = allStudents.reduce((a, s) => a + s.offlineSessions, 0)
  const totalSessions = allStudents.reduce((a, s) => a + s.sessions.length, 0)
  const offlinePercent = Math.round((totalOfflineSessions / totalSessions) * 100)

  const totalTasksCompleted = allStudents.reduce((a, s) => a + s.tasksCompleted, 0)
  const totalTasksAll = allStudents.reduce((a, s) => a + s.totalTasks, 0)
  const completionRate = Math.round((totalTasksCompleted / totalTasksAll) * 100)

  const totalAIRequests = allStudents.reduce((a, s) => a + s.aiRequestsCount, 0)

  const activityData = [
    { date: "17.11", online: 18, offline: 10 },
    { date: "18.11", online: 22, offline: 13 },
    { date: "19.11", online: 25, offline: 17 },
    { date: "20.11", online: 20, offline: 18 },
    { date: "21.11", online: 28, offline: 17 },
  ]

  const locationData = [
    { city: "м. Суми", count: 32, percent: 38 },
    { city: "м. Охтирка", count: 15, percent: 18 },
    { city: "м. Конотоп", count: 12, percent: 14 },
    { city: "м. Ромни", count: 8, percent: 10 },
    { city: "м. Шостка", count: 7, percent: 8 },
    { city: "Інші", count: 10, percent: 12 },
  ]

  const deviceData = [
    { name: "Android", value: 52, color: "#10b981" },
    { name: "iOS", value: 26, color: "#3b82f6" },
    { name: "Windows", value: 18, color: "#8b5cf6" },
    { name: "Інші", value: 4, color: "#64748b" },
  ]

  const aiTopics = [
    { topic: "Синтаксичні помилки", count: 52, percent: 37 },
    { topic: "Логіка алгоритмів", count: 41, percent: 29 },
    { topic: "Пояснення концепцій", count: 32, percent: 23 },
    { topic: "Інше", count: 17, percent: 11 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Всього учнів</p>
          <p className="text-3xl font-bold">{totalStudents}</p>
          <p className="text-xs text-muted-foreground mt-1">Активних: {activeStudents}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Середній час</p>
          <p className="text-3xl font-bold">14 хв</p>
          <p className="text-xs text-emerald-500 mt-1">↓ на 18% vs підручник</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Завершено</p>
          <p className="text-3xl font-bold">{completionRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">завдань виконано</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground mb-1">Офлайн-режим</p>
          <p className="text-3xl font-bold">{offlinePercent}%</p>
          <p className="text-xs text-muted-foreground mt-1">сесій без інтернету</p>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="p-6">
        <h3 className="font-semibold mb-1">Активність учнів по днях</h3>
        <p className="text-sm text-muted-foreground mb-4">17-21 листопада 2025 (період практики)</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: screenMode ? "#fff" : "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="online" name="Онлайн" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="offline" name="Офлайн/Кеш" fill="#64748b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-muted-foreground mt-2">
          Пік активності: 17 та 21 листопада (початок і завершення практики)
        </p>
      </Card>

      {/* Classes Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classesData.map((cls) => (
          <Card key={cls.id} className="p-5">
            <h4 className="font-semibold mb-1">{cls.name}</h4>
            <p className="text-xs text-muted-foreground mb-4">{cls.topic}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Середній бал</span>
                <span className="font-bold text-emerald-500">{cls.avgScore}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Прогрес</span>
                <span className="font-medium">{cls.avgProgress}%</span>
              </div>
              <Progress value={cls.avgProgress} className="h-2" />
              <div className="flex justify-between text-sm pt-2">
                <span className="text-muted-foreground">Учнів</span>
                <span>
                  {cls.activeStudents} / {cls.totalStudents}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* AI & Location Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Statistics */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI-асистент</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-3xl font-bold">{totalAIRequests}</p>
              <p className="text-sm text-muted-foreground">Запитів за тиждень</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-500">92%</p>
              <p className="text-sm text-muted-foreground">Ефективність</p>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium">Популярні теми запитів:</p>
            {aiTopics.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.topic}</span>
                  <span>
                    {item.count} ({item.percent}%)
                  </span>
                </div>
                <Progress value={item.percent} className="h-1.5" />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">92% учнів вирішили задачу після 1-ї підказки від ШІ</p>
        </Card>

        {/* Location & Devices */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Географія та пристрої</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Розподіл по містах (Сумська обл.):</p>
              <div className="space-y-2">
                {locationData.slice(0, 4).map((loc, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-24">{loc.city}</span>
                    <Progress value={loc.percent} className="flex-1 h-2" />
                    <span className="text-sm w-16 text-right">
                      {loc.count} ({loc.percent}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-3">Пристрої:</p>
              <div className="flex gap-4">
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie data={deviceData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value">
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1">
                  {deviceData.map((device, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: device.color }} />
                      <span className="text-muted-foreground">{device.name}:</span>
                      <span>{device.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Constructor View (placeholder)
function ConstructorView({ isDemo, screenMode }: { isDemo: boolean; screenMode: boolean }) {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Конструктор уроків</h2>
        <p className="text-muted-foreground">Функціонал в розробці. Буде доступний у версії 1.0</p>
      </div>
    </div>
  )
}

// AI Settings View
function AISettingsView({ isDemo, screenMode }: { isDemo: boolean; screenMode: boolean }) {
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(500)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Налаштування ШІ-асистента</h2>
        <p className="text-sm text-muted-foreground">Керування поведінкою AI-тьютора для учнів</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Параметри генерації</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm">Температура (креативність)</label>
                <span className="text-sm text-muted-foreground">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number.parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">Низьке = точніші відповіді, Високе = креативніші</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm">Макс. токенів</label>
                <span className="text-sm text-muted-foreground">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number.parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Статистика за практику</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Всього запитів</span>
              <span className="font-medium">142</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Успішних відповідей</span>
              <span className="font-medium text-emerald-500">92%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Середній час відповіді</span>
              <span className="font-medium">2.3с</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Задоволеність учнів</span>
              <span className="font-medium">4.1/5</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
