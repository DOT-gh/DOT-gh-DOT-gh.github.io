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
  Plus,
  Eye,
  MessageSquare,
  Shield,
  Target,
  Clock,
  Zap,
  Activity,
  Settings,
  EyeOff,
  Bell,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUp,
  Brain,
  MapPin,
  Smartphone,
  CheckCircle,
  WifiOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"
import { BarChart, Bar, CartesianGrid, Legend } from "recharts" // Added for Activity Chart

import { teacherData, type StudentData } from "@/lib/teacher-data"

// Define Student type for MonitorView
type Student = {
  id: string
  name: string
  avatar: string
  course: string
  progress: number
  status: "offline" | "help"
  lastActivity: string
  badges: number
}

type View = "dashboard" | "classes" | "builder" | "monitor" | "analytics" | "ai-settings"

const studentsByClass: Record<
  string,
  Array<{ name: string; status: "offline" | "help"; task: string; progress: number; lastSeen: string }>
> = {
  "10-А": [
    {
      name: "Шевченко О.",
      status: "offline",
      task: "Адресація IP - Маска підмережі",
      progress: 75,
      lastSeen: "21.11, 14:20",
    },
    { name: "Бойко А.", status: "offline", task: "Адресація IP", progress: 45, lastSeen: "20.11, 15:30" },
    { name: "Коваленко М.", status: "help", task: "DNS Резолюція", progress: 60, lastSeen: "18.11, 11:45" },
    { name: "Франко І.", status: "offline", task: "DHCP конфігурація", progress: 82, lastSeen: "21.11, 16:10" },
  ],
  "11-Б": [
    { name: "Мельник Т.", status: "offline", task: "Flexbox - Вирівнювання", progress: 68, lastSeen: "21.11, 13:30" },
    {
      name: "Петренко В.",
      status: "offline",
      task: "Flexbox - Grid комбінація",
      progress: 72,
      lastSeen: "20.11, 17:45",
    },
    { name: "Сидоренко К.", status: "help", task: "Flexbox - Респонсив", progress: 55, lastSeen: "19.11, 12:20" },
    { name: "Іваненко О.", status: "offline", task: "CSS Grid основи", progress: 40, lastSeen: "19.11, 10:15" },
    { name: "Ткаченко М.", status: "offline", task: "Flexbox практика", progress: 85, lastSeen: "21.11, 15:50" },
  ],
  "7-А": [
    { name: "Дмитренко А.", status: "offline", task: "Гра 'Робот' - Рівень 3", progress: 80, lastSeen: "21.11, 12:40" },
    { name: "Ковальчук Н.", status: "offline", task: "Гра 'Робот' - Рівень 2", progress: 65, lastSeen: "20.11, 14:15" },
    { name: "Романенко С.", status: "help", task: "Гра 'Робот' - Рівень 4", progress: 50, lastSeen: "18.11, 16:30" },
  ],
}

export default function TeacherDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [teacherCode, setTeacherCode] = useState("")
  const [screenMode, setScreenMode] = useState(false)

  useEffect(() => {
    const codeFromUrl = searchParams.get("code")
    if (codeFromUrl && (codeFromUrl === "Teacher443" || codeFromUrl === "Teacher123")) {
      setTeacherCode(codeFromUrl)
      setIsAuthorized(true)
      localStorage.setItem("edu_teacher_access", "true")
      localStorage.setItem("edu_teacher_code", codeFromUrl)
    } else {
      // Check localStorage
      const savedAccess = localStorage.getItem("edu_teacher_access")
      const savedCode = localStorage.getItem("edu_teacher_code")
      if (savedAccess === "true" && savedCode) {
        setTeacherCode(savedCode)
        setIsAuthorized(true)
      }
    }
  }, [searchParams])

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Доступ заборонено. Поверніться до головної сторінки.</p>
      </div>
    )
  }

  const isDemo = teacherCode === "Teacher123"

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-sm">Edu Survival Kit</h1>
              <p className="text-xs text-muted-foreground">Панель вчителя v.0.9</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <NavItem
            icon={Home}
            label="Головна"
            active={currentView === "dashboard"}
            onClick={() => setCurrentView("dashboard")}
          />
          <NavItem
            icon={BookOpen}
            label="Конструктор уроків"
            active={currentView === "builder"}
            onClick={() => setCurrentView("builder")}
          />
          <NavItem
            icon={Users}
            label="Мої класи"
            active={currentView === "classes"}
            onClick={() => setCurrentView("classes")}
          />
          <NavItem
            icon={Eye}
            label="Моніторинг учнів"
            active={currentView === "monitor"}
            onClick={() => setCurrentView("monitor")}
          />
          <NavItem
            icon={BarChart3}
            label="Аналітика"
            active={currentView === "analytics"}
            onClick={() => setCurrentView("analytics")}
          />
          <NavItem
            icon={Bot}
            label="Налаштування ШІ"
            active={currentView === "ai-settings"}
            onClick={() => setCurrentView("ai-settings")}
          />
        </nav>

        {/* Back to Student */}
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-xs h-auto py-2"
            onClick={() => {
              localStorage.removeItem("edu_teacher_access")
              localStorage.removeItem("edu_teacher_code")
              router.push("/")
            }}
          >
            <ChevronLeft className="h-4 w-4 flex-shrink-0" />
            <span className="text-balance leading-tight">Повернутись до учнівського режиму</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold">
              {currentView === "dashboard" && "Головна"}
              {currentView === "builder" && "Конструктор уроків"}
              {currentView === "classes" && "Мої класи"}
              {currentView === "monitor" && "Моніторинг учнів"}
              {currentView === "analytics" && "Аналітика"}
              {currentView === "ai-settings" && "Налаштування ШІ"}
            </h2>
            {isDemo && (
              <Badge variant="outline" className="text-xs">
                Демо-режим
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              onClick={() => setScreenMode(!screenMode)}
            >
              {screenMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {screenMode ? "Показати імена" : "Режим скріна"}
            </Button>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {currentView === "dashboard" && <DashboardView isDemo={isDemo} screenMode={screenMode} />}
        {currentView === "builder" && <ContentBuilderView isDemo={isDemo} />}
        {currentView === "classes" && <ClassesView isDemo={isDemo} screenMode={screenMode} />}
        {currentView === "monitor" && <MonitorView isDemo={isDemo} screenMode={screenMode} />}
        {currentView === "analytics" && <AnalyticsView isDemo={isDemo} screenMode={screenMode} />}
        {currentView === "ai-settings" && <AISettingsView isDemo={isDemo} />}
      </main>
    </div>
  )
}

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: any
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}

function DashboardView({ isDemo, screenMode }: { isDemo: boolean; screenMode: boolean }) {
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

  // Real data from practice
  const activityData = [
    { date: "17.11", students: 18 },
    { date: "18.11", students: 24 },
    { date: "19.11", students: 30 },
    { date: "20.11", students: 28 },
    { date: "21.11", students: 22 },
  ]

  const statsData = [
    { name: "Активні (брали участь)", value: 54, color: "#10b981" },
    { name: "Менш активні", value: 18, color: "#64748b" },
    { name: "Потребували допомоги", value: 8, color: "#ef4444" },
  ]

  const efficiencyData = [
    { name: "Ефективність", value: 92, color: "#10b981" },
    { name: "Залишок", value: 8, color: "#1e293b" },
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
              <h3 className="font-semibold mb-1 text-amber-500">Увага: Графік планових відключень</h3>
              <p className="text-sm text-muted-foreground">
                За графіком ГПВ можливе відключення 4-ї черги о 14:00. Рекомендується зберегти роботу учнів до цього
                часу.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setNotificationDismissed(true)}>
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Top Metrics with Circular Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Активні учні</p>
              <p className="text-3xl font-bold">54 / 72</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-muted-foreground">Зараз всі офлайн (практика завершена)</span>
              </div>
            </div>
            <ResponsiveContainer width={80} height={80}>
              <PieChart>
                <Pie
                  data={statsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={35}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1">
            {statsData.map((stat) => (
              <div key={stat.name} className="flex items-center gap-2 text-xs">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: stat.color }} />
                <span className="text-muted-foreground">{stat.name}:</span>
                <span className="font-medium">{stat.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Середній бал</p>
              <p className="text-3xl font-bold">9.3</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp className="h-3 w-3 text-emerald-500" />
                <span className="text-xs text-emerald-500">Загальний результат</span>
              </div>
            </div>
            <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center relative">
              <div className="text-center">
                <TrendingUp className="h-6 w-6 text-emerald-500 mx-auto" />
              </div>
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-emerald-500/20"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${(9.3 / 12) * 213} 213`}
                  className="text-emerald-500"
                />
              </svg>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">По всіх трьох класах (7-А, 10-А, 11-Б)</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ефективність ШІ</p>
              <p className="text-3xl font-bold">92%</p>
              <div className="flex items-center gap-1 mt-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span className="text-xs text-emerald-500">Відмінно</span>
              </div>
            </div>
            <ResponsiveContainer width={80} height={80}>
              <PieChart>
                <Pie
                  data={efficiencyData}
                  cx="50%"
                  cy="50%"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={25}
                  outerRadius={35}
                  dataKey="value"
                >
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground">142 запити до AI-асистента, 131 успішних</p>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Активність учнів (17.11 - 21.11.2025)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={activityData}>
            <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: "12px" }} />
            <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="students" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-emerald-500" />
            <span>Пік активності 19.11 - 30 учнів онлайн</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          Детальна статистика практики
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Офлайн-виконань</p>
            <p className="text-2xl font-bold">76%</p>
            <p className="text-xs text-muted-foreground">завдань виконано без інтернету</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Завершені завдання</p>
            <p className="text-2xl font-bold">88%</p>
            <p className="text-xs text-muted-foreground">учні завершили свої завдання</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Середній час</p>
            <p className="text-2xl font-bold">12 хв</p>
            <p className="text-xs text-muted-foreground">до правильного розв'язання</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Звернення до AI</p>
            <p className="text-2xl font-bold">142</p>
            <p className="text-xs text-muted-foreground">запитів підказок (92% ефективність)</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-semibold mb-2">Порівняння з іншими платформами</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Час відгуку AI:</span>
              <span className="font-medium text-emerald-500">2.3с (краще на 60% ніж середнє)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Офлайн-можливості:</span>
              <span className="font-medium text-emerald-500">Повний функціонал (унікально)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Економія трафіку:</span>
              <span className="font-medium text-emerald-500">85-90% (критично для регіонів)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card className="p-4 border-primary/30 bg-primary/5">
        <div className="flex gap-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Рекомендації ШІ</h3>
            <p className="text-sm text-muted-foreground mb-3">
              На основі статистики класу 11-А: 40% учнів не впоралися з модулем{" "}
              <span className="text-foreground font-medium">"Цикли в Python"</span>. Рекомендується повторити матеріал
              або створити додатковий посібник.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="default" className="gap-2">
                <Plus className="h-3 w-3" />
                Згенерувати додаткові завдання
              </Button>
              <Button size="sm" variant="outline">
                Переглянути деталі
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Останні події
        </h3>
        <div className="space-y-3">
          <ActivityItem
            icon={CheckCircle2}
            text={`${screenMode ? "████████ █." : "Шевченко Т."} завершив курс 'Python: Основи'`}
            time="21.11, 16:45"
            type="success"
          />
          <ActivityItem
            icon={MessageSquare}
            text={`${screenMode ? "██████ █." : "Франко І."} запитав допомогу в ШІ-тьютора (завдання: Рекурсія)`}
            time="21.11, 14:30"
            type="info"
          />
          <ActivityItem
            icon={Shield}
            text={`${screenMode ? "████████ █." : "Сидоренко О."} - виявлена спроба вставки коду (заблоковано)`}
            time="20.11, 11:20"
            type="warning"
          />
          <ActivityItem
            icon={Target}
            text="Клас 10-А завершив 89% завдань цього тижня"
            time="21.11, 10:00"
            type="info"
          />
        </div>
      </Card>
    </div>
  )
}

function ActivityItem({ icon: Icon, text, time, type }: any) {
  const colors = {
    success: "bg-emerald-500/10 text-emerald-500",
    warning: "bg-amber-500/10 text-amber-500",
    info: "bg-blue-500/10 text-blue-500",
  }

  return (
    <div className="flex gap-3">
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${colors[type]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">{text}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}

function ContentBuilderView({ isDemo }: { isDemo: boolean }) {
  const [subject, setSubject] = useState("history")
  const [inDevelopment, setInDevelopment] = useState(false)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Конструктор уроків</h1>
        <p className="text-sm text-muted-foreground">
          Універсальна система для створення завдань з будь-якого предмету
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <Card className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Предмет</label>
            <select
              className="w-full p-2 rounded-lg border border-border bg-background"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="informatics">Інформатика</option>
              <option value="history">Історія України</option>
              <option value="physics">Фізика</option>
              <option value="math">Математика</option>
              <option value="english">Англійська мова</option>
            </select>
          </div>

          {subject === "history" && (
            <>
              <div>
                <label className="text-sm font-medium mb-2 block">Назва уроку</label>
                <input
                  type="text"
                  className="w-full p-2 rounded-lg border border-border bg-background"
                  value="Україна в роки Першої світової війни.Галицька битва"
                  readOnly
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Опис завдання</label>
                <textarea
                  className="w-full p-3 rounded-lg border border-border bg-background min-h-[200px]"
                  value="Уявіть, що ви живете у Львові в 1914 році. Почалася Перша світова війна. Опишіть, як ці події вплинули на життя вашої родини. Використайте історичні факти про Галицьку битву."
                  readOnly
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Налаштування ШІ-методології</label>
                <div className="space-y-2 p-3 border border-border rounded-lg bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Prompt Role:</span>
                    <select className="text-sm p-1 rounded border border-border bg-background">
                      <option>Вчитель Історії (Storyteller)</option>
                      <option>Строгий екзаменатор</option>
                      <option>Дослідник</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Strictness:</span>
                    <select className="text-sm p-1 rounded border border-border bg-background">
                      <option>Socratic Mode</option>
                      <option>Hints Allowed</option>
                      <option>Strict (No Help)</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={() => setInDevelopment(true)}>
                Згенерувати тест
              </Button>

              {inDevelopment && (
                <Card className="p-3 border-amber-500/30 bg-amber-500/5">
                  <p className="text-sm text-amber-500 font-medium">🚧 Ще в розробці</p>
                  <p className="text-xs text-muted-foreground mt-1">Ця функція буде доступна в наступній версії</p>
                </Card>
              )}
            </>
          )}

          {subject === "informatics" && (
            <div>
              <label className="text-sm font-medium mb-2 block">Тип завдання</label>
              <select className="w-full p-2 rounded-lg border border-border bg-background">
                <option>Написання коду</option>
                <option>Тест (Quiz)</option>
                <option>Відкрите питання</option>
              </select>
            </div>
          )}
        </Card>

        {/* Right: AI Copilot */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">ШІ-Помічник вчителя</h3>
          </div>
          <div className="space-y-3 mb-4 max-h-[400px] overflow-auto">
            <div className="p-3 rounded-lg bg-secondary">
              <p className="text-sm">
                <span className="font-medium">Ви:</span> Зроби 3 проблемних питання по темі "Галицька битва 1914"
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <p className="text-sm">
                <span className="font-medium text-primary">ШІ:</span> Згенеровано 3 проблемних питання про Гаврила
                Принципа та вплив на Галицьку битву. Питання стимулюють критичне мислення та аналіз причинно-наслідкових
                зв'язків.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Запитайте ШІ про створення завдань..."
              className="flex-1 p-2 rounded-lg border border-border bg-background text-sm"
            />
            <Button size="icon">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

function ClassesView({ isDemo, screenMode }: { isDemo: boolean; screenMode: boolean }) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)

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

  if (selectedStudent) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => setSelectedStudent(null)} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Назад до списку учнів
        </Button>
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {selectedStudent.name.split(" ")[0][0]}
              {selectedStudent.name.split(" ")[1]?.[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{selectedStudent.name}</h2>
              <p className="text-muted-foreground">{selectedStudent.className}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant={selectedStudent.status === "offline" ? "secondary" : "destructive"}>
                  {selectedStudent.status === "offline" ? "Офлайн" : "Потребує допомоги"}
                </Badge>
                <Badge variant="outline">Прогрес: {selectedStudent.progress}%</Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Останнє завдання</h3>
              <Card className="p-4 bg-muted/30">
                <p className="text-sm">{selectedStudent.currentTask}</p>
                <Progress value={selectedStudent.progress} className="mt-2" />
              </Card>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Остання активність</h3>
              <p className="text-sm text-muted-foreground">{selectedStudent.lastActivity}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Досягнення</h3>
              <p className="text-sm text-muted-foreground">{selectedStudent.achievements} відзнак отримано</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (selectedClass) {
    const classData = teacherData.classes.find((c) => c.id === selectedClass)
    if (!classData) return null

    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => setSelectedClass(null)} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Назад до класів
        </Button>
        <Card className="p-6 mb-4">
          <h2 className="text-2xl font-bold mb-1">Клас {classData.name}</h2>
          <p className="text-muted-foreground mb-4">{classData.subject}</p>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Всього учнів</p>
              <p className="text-2xl font-bold">{classData.totalStudents}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Активних</p>
              <p className="text-2xl font-bold text-primary">{classData.activeStudents}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Середній прогрес</p>
              <p className="text-2xl font-bold">{classData.avgProgress}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Середній бал</p>
              <p className="text-2xl font-bold">{classData.avgScore}</p>
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
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.currentTask}</p>
                </div>
                <div className="text-right">
                  <Badge variant={student.status === "offline" ? "secondary" : "destructive"}>
                    {student.status === "offline" ? "Офлайн" : "Допомога"}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">{student.lastActivity}</p>
                </div>
                <div className="w-20">
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

  return (
    <div className="p-6 space-y-4">
      {teacherData.classes.map((cls) => (
        <Card
          key={cls.id}
          className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setSelectedClass(cls.id)}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-xl mb-1">Клас {cls.name}</h3>
              <p className="text-sm text-muted-foreground">{cls.subject}</p>
            </div>
            <Badge variant="outline">{cls.practice}</Badge>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Всього учнів</p>
              <p className="text-2xl font-bold">{cls.totalStudents}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Активних учнів</p>
              <p className="text-2xl font-bold text-primary">{cls.activeStudents}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Зараз онлайн</p>
              <p className="text-2xl font-bold text-muted-foreground">0</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Середній прогрес</p>
              <p className="text-2xl font-bold">{cls.avgProgress}%</p>
            </div>
          </div>

          <Progress value={cls.avgProgress} className="mb-4" />

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedClass(cls.id)
              }}
            >
              Переглянути учнів ({cls.students.length})
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Експорт даних
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

function MonitorView({ isDemo, screenMode }: { isDemo: boolean; screenMode: boolean }) {
  const [selectedClass, setSelectedClass] = useState("10-А")
  const [interceptModal, setInterceptModal] = useState(false)

  const mock10AStudents: Student[] = [
    {
      id: "1",
      name: "Дмитренко А.",
      avatar: "Д",
      course: "Гра 'Робот' - Рівень 3",
      progress: 80,
      status: "offline",
      lastActivity: "21.11, 15:45",
      badges: 12,
    },
    {
      id: "2",
      name: "Ковальчук Н.",
      avatar: "К",
      course: "Гра 'Робот' - Рівень 2",
      progress: 65,
      status: "offline",
      lastActivity: "20.11, 11:20",
      badges: 8,
    },
    {
      id: "3",
      name: "Романенко С.",
      avatar: "Р",
      course: "Гра 'Робот' - Рівень 4",
      progress: 50,
      status: "help",
      lastActivity: "19.11, 16:10",
      badges: 5,
    },
  ]

  const mock11BStudents: Student[] = [
    {
      id: "4",
      name: "Мельник Т.",
      avatar: "М",
      course: "Flexbox - Вирівнювання",
      progress: 68,
      status: "offline",
      lastActivity: "21.11, 14:15",
      badges: 10,
    },
    {
      id: "5",
      name: "Петренко В.",
      avatar: "П",
      course: "Flexbox - Grid комбінація",
      progress: 72,
      status: "offline",
      lastActivity: "21.11, 10:30",
      badges: 11,
    },
    {
      id: "6",
      name: "Сидоренко К.",
      avatar: "С",
      course: "Flexbox - Респонсив",
      progress: 55,
      status: "help",
      lastActivity: "18.11, 13:45",
      badges: 6,
    },
    {
      id: "7",
      name: "Іваненко О.",
      avatar: "І",
      course: "CSS Grid основи",
      progress: 40,
      status: "offline",
      lastActivity: "17.11, 09:20",
      badges: 4,
    },
    {
      id: "8",
      name: "Ткаченко М.",
      avatar: "Т",
      course: "Flexbox практика",
      progress: 85,
      status: "offline",
      lastActivity: "21.11, 16:00",
      badges: 14,
    },
  ]

  const mock7AStudents: Student[] = [
    {
      id: "9",
      name: "Гриценко Д.",
      avatar: "Г",
      course: "Адресація IP - Маска підмережі",
      progress: 75,
      status: "offline",
      lastActivity: "21.11, 12:40",
      badges: 9,
    },
    {
      id: "10",
      name: "Бойко А.",
      avatar: "Б",
      course: "Адресація IP",
      progress: 45,
      status: "offline",
      lastActivity: "19.11, 08:15",
      badges: 3,
    },
    {
      id: "11",
      name: "Коваленко М.",
      avatar: "К",
      course: "DNS Резолюція",
      progress: 60,
      status: "help",
      lastActivity: "20.11, 15:25",
      badges: 7,
    },
    {
      id: "12",
      name: "Франко І.",
      avatar: "Ф",
      course: "DHCP конфігурація",
      progress: 82,
      status: "offline",
      lastActivity: "21.11, 13:50",
      badges: 13,
    },
  ]

  const students =
    selectedClass === "10-А" ? mock10AStudents : selectedClass === "11-Б" ? mock11BStudents : mock7AStudents

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

  const allStudents = teacherData.classes.flatMap((cls) => cls.students)

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Моніторинг учнів</h2>
          <p className="text-sm text-muted-foreground">
            Всього учнів: {allStudents.length} | Онлайн зараз: 0 | Потребують допомоги: 0
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {allStudents.slice(0, 20).map((student) => (
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

      {allStudents.length > 20 && (
        <div className="text-center text-sm text-muted-foreground pt-4">Показано 20 з {allStudents.length} учнів</div>
      )}

      {interceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="p-6 max-w-md">
            <h3 className="font-semibold mb-2">🚧 Ще в розробці</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Функція перехоплення чату буде доступна в наступній версії. Вона дозволить вчителю втрутитися в діалог
              учня з ШІ-тьютором.
            </p>
            <Button onClick={() => setInterceptModal(false)} className="w-full">
              Зрозуміло
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}

function AnalyticsView({ isDemo, screenMode }: { isDemo: boolean; screenMode: boolean }) {
  if (isDemo) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Немає аналітики в демо-режимі</p>
        </div>
      </div>
    )
  }

  const totalStudents = 72
  const activeStudents = 54
  const avgTimePerTask = 12
  const completedTasks = 88
  const offlineSessions = 76

  // Дані по класах (реальні з практики)
  const classesData = [
    {
      name: "7-А (НУШ)",
      topic: "Алгоритми (гра 'Робот')",
      avgGrade: 9.2,
      progress: 94,
      students: 30,
      boys: 16,
      girls: 14,
      quality: 83,
    },
    {
      name: "10-А (Інформатика)",
      topic: "Math Profile",
      avgGrade: 8.7,
      progress: 82,
      students: 22,
      boys: 13,
      girls: 9,
      quality: 77,
    },
    {
      name: "11-Б (Стандарт)",
      topic: "Flexbox (практика)",
      avgGrade: 10.1,
      progress: 100,
      students: 20,
      boys: 9,
      girls: 11,
      quality: 90,
    },
  ]

  // Активність по днях (17-21 листопада 2025 - період практики)
  const activityData = [
    { date: "17.11", online: 28, offline: 26, total: 54 },
    { date: "18.11", online: 15, offline: 31, total: 46 },
    { date: "19.11", online: 18, offline: 24, total: 42 },
    { date: "20.11", online: 22, offline: 18, total: 40 },
    { date: "21.11", online: 30, offline: 22, total: 52 },
  ]

  // AI асистент статистика
  const aiRequestsTotal = 142
  const aiEfficiency = 92
  const aiTopics = [
    { name: "Синтаксис Python", value: 45, percent: 32 },
    { name: "Виправлення помилок", value: 52, percent: 37 },
    { name: "Пояснення умови", value: 30, percent: 21 },
    { name: "Інше", value: 15, percent: 10 },
  ]

  // Географія учнів
  const locationData = [
    { name: "Сумська обл.", value: 65 },
    { name: "ВПО/За кордоном", value: 35 },
  ]

  // Пристрої
  const deviceData = [
    { name: "Mobile (Android/iOS)", value: 85 },
    { name: "Desktop", value: 15 },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Верхня панель - Загальні показники */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={screenMode ? "bg-white border-gray-200" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всього учнів</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Активних: {activeStudents}</p>
          </CardContent>
        </Card>

        <Card className={screenMode ? "bg-white border-gray-200" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Середній час</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTimePerTask} хв</div>
            <p className="text-xs text-green-500">↓ на 15% vs підручник</p>
          </CardContent>
        </Card>

        <Card className={screenMode ? "bg-white border-gray-200" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Завершено</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}%</div>
            <p className="text-xs text-muted-foreground">завдань виконано</p>
          </CardContent>
        </Card>

        <Card className={screenMode ? "bg-white border-gray-200" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Офлайн-режим</CardTitle>
            <WifiOff className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offlineSessions}%</div>
            <p className="text-xs text-muted-foreground">сесій без інтернету</p>
          </CardContent>
        </Card>
      </div>

      {/* Графік активності */}
      <Card className={screenMode ? "bg-white border-gray-200" : ""}>
        <CardHeader>
          <CardTitle>Активність учнів по днях</CardTitle>
          <CardDescription>17-21 листопада 2025 (період практики)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={screenMode ? "#e5e7eb" : "#374151"} />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: screenMode ? "#fff" : "#1f2937",
                  border: `1px solid ${screenMode ? "#e5e7eb" : "#374151"}`,
                }}
              />
              <Legend />
              <Bar dataKey="online" name="Онлайн" fill="#60a5fa" />
              <Bar dataKey="offline" name="Офлайн/Кеш" fill="#6b7280" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-muted-foreground mt-4">
            Пік активності: 17 та 21 листопада (початок і завершення практики)
          </p>
        </CardContent>
      </Card>

      {/* Успішність класів */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classesData.map((cls, idx) => (
          <Card key={idx} className={screenMode ? "bg-white border-gray-200" : ""}>
            <CardHeader>
              <CardTitle className="text-lg">{cls.name}</CardTitle>
              <CardDescription>{cls.topic}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Середній бал</span>
                  <span className="font-bold text-green-500">{cls.avgGrade}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Прогрес</span>
                  <span className="font-bold">{cls.progress}%</span>
                </div>
                <Progress value={cls.progress} className="h-2" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Учнів</span>
                <span>
                  {cls.students} ({cls.boys}Х / {cls.girls}Д)
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Якість знань</span>
                <span className="text-green-500">{cls.quality}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Асистент та Географія */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI Аналітика */}
        <Card className={screenMode ? "bg-white border-gray-200" : ""}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <CardTitle>AI-Асистент Аналітика</CardTitle>
            </div>
            <CardDescription>Статистика використання ШІ-помічника</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">{aiRequestsTotal}</div>
                <div className="text-sm text-muted-foreground">Запитів за тиждень</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{aiEfficiency}%</div>
                <div className="text-sm text-muted-foreground">Ефективність підказок</div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Популярні теми запитів:</p>
              {aiTopics.map((topic, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{topic.name}</span>
                    <span>
                      {topic.value} ({topic.percent}%)
                    </span>
                  </div>
                  <Progress value={topic.percent * 2.5} className="h-1" />
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">92% учнів вирішили задачу після 1-ї підказки від ШІ</p>
          </CardContent>
        </Card>

        {/* Географія та пристрої */}
        <Card className={screenMode ? "bg-white border-gray-200" : ""}>
          <CardHeader>
            <CardTitle>Географія та Технічні дані</CardTitle>
            <CardDescription>Розподіл за локацією та пристроями</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Локація */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-green-500" />
                <p className="text-sm font-medium">Локація учнів</p>
              </div>
              <div className="space-y-2">
                {locationData.map((loc, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{loc.name}</span>
                      <span>{loc.value}%</span>
                    </div>
                    <Progress value={loc.value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Пристрої */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="h-4 w-4 text-blue-500" />
                <p className="text-sm font-medium">Пристрої</p>
              </div>
              <div className="space-y-2">
                {deviceData.map((device, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{device.name}</span>
                      <span>{device.value}%</span>
                    </div>
                    <Progress value={device.value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-lg p-3 text-sm space-y-1 ${screenMode ? "bg-gray-50" : "bg-secondary"}`}>
              <p className="text-muted-foreground">📱 85% Mobile</p>
              <p className="text-muted-foreground">💻 15% Desktop</p>
              <p className="text-muted-foreground">🌍 65% Сумська обл.</p>
              <p className="text-muted-foreground">✈️ 35% ВПО/За кордоном</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Результати опитування */}
      <Card className={screenMode ? "bg-white border-gray-200" : ""}>
        <CardHeader>
          <CardTitle>Результати опитування учнів</CardTitle>
          <CardDescription>33 відповіді з 54 активних учнів (61% response rate)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Зрозумілість інтерфейсу</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Середня оцінка</span>
                  <span className="font-bold text-green-500">4.1 / 5</span>
                </div>
                <Progress value={82} className="h-2" />
                <p className="text-xs text-muted-foreground">82% оцінили на 4-5 балів</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Гейміфікація (мотивація)</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">"Дуже мотивує"</span>
                  <span className="font-bold">48%</span>
                </div>
                <Progress value={48} className="h-2" />
                <p className="text-xs text-muted-foreground">16 з 33 учнів</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Порівняння з підручником</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">"Набагато краще"</span>
                  <span className="font-bold text-green-500">58%</span>
                </div>
                <Progress value={58} className="h-2" />
                <p className="text-xs text-muted-foreground">19 з 33 учнів</p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-3 text-sm space-y-1 ${screenMode ? "bg-gray-50" : "bg-secondary"}`}>
            <h4 className="font-medium text-sm mb-3">Топ коментарі від учнів:</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>"Дмитро Олександрович ви топ чекаємо ще))" - 7-А</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>"зручно шо без інета робить" - 11-Б</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>"Краще ніж з підручника вчити. хоч якась практика" - 10-А</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">⚠</span>
                <span>"ШІ іноді тупить" - 10-А</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span>"Мені не зайшло скучно краще б в скретчі сиділи" - 7-А</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function LogItem({ name, event, severity, time, action }: any) {
  const colors = {
    high: "bg-red-500/10 text-red-500 border-red-500/30",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    low: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  }

  return (
    <div className="flex items-start justify-between p-3 rounded-lg border border-border">
      <div className="flex items-start gap-3 flex-1">
        <Badge variant="outline" className={`${colors[severity]} text-xs shrink-0`}>
          {severity === "high" ? "Критично" : severity === "medium" ? "Попередження" : "Інфо"}
        </Badge>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{event}</p>
          <p className="text-xs text-primary mt-1">→ {action}</p>
        </div>
      </div>
      <span className="text-xs text-muted-foreground shrink-0 ml-2">{time}</span>
    </div>
  )
}

function AISettingsView({ isDemo }: { isDemo: boolean }) {
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(500)
  const [topP, setTopP] = useState(0.9)
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.5)
  const [presencePenalty, setPresencePenalty] = useState(0.5)
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini")

  const models = [
    { id: "gpt-4o", name: "GPT-4o (Найкращий)", speed: "Середній", cost: "Високий" },
    { id: "gpt-4o-mini", name: "GPT-4o Mini (Рекомендовано)", speed: "Швидкий", cost: "Низький" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", speed: "Дуже швидкий", cost: "Дуже низький" },
    { id: "claude-sonnet", name: "Claude 3.5 Sonnet", speed: "Швидкий", cost: "Середній" },
    { id: "gemini-pro", name: "Gemini 1.5 Pro", speed: "Швидкий", cost: "Низький" },
    { id: "llama-3", name: "Llama 3 70B", speed: "Середній", cost: "Безкоштовно" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Налаштування ШІ-Асистента</h1>
        <p className="text-sm text-muted-foreground">Тонке налаштування поведінки ШІ для учнів та вчителя</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Selection */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            Вибір моделі ШІ
          </h3>
          <div className="space-y-2">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedModel === model.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{model.name}</span>
                  {selectedModel === model.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>⚡ {model.speed}</span>
                  <span>💰 {model.cost}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Advanced Parameters */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            Параметри генерації
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Temperature (Креативність)</label>
                <span className="text-sm text-muted-foreground">{temperature.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number.parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">Нижче = точніше, вище = креативніше</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Max Tokens (Довжина відповіді)</label>
                <span className="text-sm text-muted-foreground">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number.parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Top P (Nucleus Sampling)</label>
                <span className="text-sm text-muted-foreground">{topP.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={topP}
                onChange={(e) => setTopP(Number.parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Frequency Penalty</label>
                <span className="text-sm text-muted-foreground">{frequencyPenalty.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={frequencyPenalty}
                onChange={(e) => setFrequencyPenalty(Number.parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Presence Penalty</label>
                <span className="text-sm text-muted-foreground">{presencePenalty.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={presencePenalty}
                onChange={(e) => setPresencePenalty(Number.parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Student AI Persona */}
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Персона ШІ для учнів</h3>
          <p className="text-sm text-muted-foreground mb-4">
            ШІ-тьютор використовує педагогічний підхід: ставить запитання замість надання готових відповідей.
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Заборонити давати готовий код</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Стимулювати самостійне мислення (Socratic Method)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Використовувати українську мову</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Адаптивна складність відповідей</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Дозволити міні-підказки для початківців</span>
            </label>
          </div>
        </Card>

        {/* Teacher AI Persona */}
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Персона ШІ для вчителя</h3>
          <p className="text-sm text-muted-foreground mb-4">
            ШІ-помічник допомагає створювати завдання, аналізувати статистику та надає рекомендації.
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Автоматична аналітика щодня (8:00)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Генерувати індивідуальні завдання</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Виявляти учнів, що потребують уваги</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Режим автопілоту (без підтвердження)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Щоденні email-звіти</span>
            </label>
          </div>
        </Card>
      </div>

      <Card className="p-4 border-amber-500/30 bg-amber-500/5">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-500 mb-1">Етичне використання ШІ</h3>
            <p className="text-sm text-muted-foreground">
              Налаштування спроектовані так, щоб ШІ не давав готових відповідей, а стимулював самостійне мислення учнів.
              Це відповідає сучасним етичним принципам використання ШІ в освіті.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
