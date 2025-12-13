"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Home,
  BookOpen,
  Users,
  BarChart3,
  Bot,
  ChevronLeft,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Sparkles,
  Plus,
  Eye,
  MessageSquare,
  Shield,
  Award,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type View = "dashboard" | "classes" | "builder" | "monitor" | "analytics" | "ai-settings"

export default function TeacherDashboard() {
  const router = useRouter()
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const teacherAccess = localStorage.getItem("edu_teacher_access")
    if (teacherAccess !== "true") {
      router.push("/")
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Перевірка доступу...</p>
      </div>
    )
  }

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
              <p className="text-xs text-muted-foreground">Панель вчителя</p>
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
            className="w-full justify-start gap-2"
            onClick={() => {
              localStorage.removeItem("edu_teacher_access")
              router.push("/")
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            Повернутись до учнівського режиму
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {currentView === "dashboard" && <DashboardView />}
        {currentView === "builder" && <ContentBuilderView />}
        {currentView === "classes" && <ClassesView />}
        {currentView === "monitor" && <MonitorView />}
        {currentView === "analytics" && <AnalyticsView />}
        {currentView === "ai-settings" && <AISettingsView />}
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

function DashboardView() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Вітаємо, Олександр Сергійович!</h1>
        <p className="text-muted-foreground">Система працює стабільно. Ось огляд активності.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Активні учні</p>
              <p className="text-2xl font-bold">28 / 32</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Потрібна допомога</p>
              <p className="text-2xl font-bold text-red-500">3 учні</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ефективність ШІ</p>
              <p className="text-2xl font-bold">94%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Briefing */}
      <Card className="p-4 border-primary/30 bg-primary/5">
        <div className="flex gap-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold mb-1">ШІ-Аналіз за сьогодні</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Клас 10-Б має труднощі з темою <span className="text-foreground font-medium">"Цикли в Python"</span>. 40%
              учнів не змогли виконати завдання з першої спроби. Рекомендую повторити матеріал або створити додаткові
              практичні вправи.
            </p>
            <div className="flex gap-2">
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
        <h3 className="font-semibold mb-4">Останні події</h3>
        <div className="space-y-3">
          <ActivityItem
            icon={Award}
            text="Шевченко Т. завершив курс 'Python: Основи'"
            time="5 хв тому"
            type="success"
          />
          <ActivityItem
            icon={MessageSquare}
            text="Франко І. запитав допомогу в ШІ-тьютора (завдання: Рекурсія)"
            time="12 хв тому"
            type="info"
          />
          <ActivityItem
            icon={Shield}
            text="Сидоренко О. - виявлена спроба вставки коду (заблоковано)"
            time="1 год тому"
            type="warning"
          />
          <ActivityItem icon={Target} text="Клас 11-А завершив 89% завдань цього тижня" time="2 год тому" type="info" />
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

function ContentBuilderView() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Універсальний конструктор завдань</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <Card className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Предмет</label>
            <select className="w-full p-2 rounded-lg border border-border bg-background">
              <option>Інформатика</option>
              <option>Історія України</option>
              <option>Фізика</option>
              <option>Англійська мова</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Тип завдання</label>
            <select className="w-full p-2 rounded-lg border border-border bg-background">
              <option>Написання коду</option>
              <option>Тест (Quiz)</option>
              <option>Відкрите питання</option>
              <option>Співставлення</option>
              <option>Перегляд відео + Есе</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Опис завдання</label>
            <textarea
              className="w-full p-3 rounded-lg border border-border bg-background min-h-[200px]"
              placeholder="Введіть опис завдання..."
            />
          </div>

          <Button className="w-full">Створити завдання</Button>
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
                <span className="font-medium">Ви:</span> Зроби тест на 5 питань по темі "Бази даних" для 11 класу,
                середньої складності.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <p className="text-sm">
                <span className="font-medium text-primary">ШІ:</span> Створюю тест з наступними питаннями: 1) Що таке
                первинний ключ? 2) Різниця між SQL і NoSQL... [Apply to Editor]
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Запитайте ШІ..."
              className="flex-1 p-2 rounded-lg border border-border bg-background"
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

function ClassesView() {
  const classes = [
    { name: "9-А", students: 28, activeNow: 12, avgProgress: 67 },
    { name: "10-Б", students: 32, activeNow: 28, avgProgress: 54 },
    { name: "11-А", students: 25, activeNow: 3, avgProgress: 89 },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Мої класи</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <Card key={cls.name} className="p-4">
            <h3 className="font-semibold text-lg mb-3">Клас {cls.name}</h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Всього учнів:</span>
                <span className="font-medium">{cls.students}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Онлайн зараз:</span>
                <span className="font-medium text-emerald-500">{cls.activeNow}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Середній прогрес:</span>
                <span className="font-medium">{cls.avgProgress}%</span>
              </div>
              <Progress value={cls.avgProgress} />
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Переглянути деталі
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

function MonitorView() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Моніторинг учнів (Live)</h1>
      <Card className="p-4">
        <div className="mb-4">
          <div className="flex gap-2">
            <Button size="sm" variant="default">
              9-А
            </Button>
            <Button size="sm" variant="outline">
              10-Б
            </Button>
            <Button size="sm" variant="outline">
              11-А
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          {["Шевченко Т.", "Франко І.", "Коваленко Д.", "Сидоренко О."].map((name, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                  {name[0]}
                </div>
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">Завдання: Python - Цикли</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500">Online</span>
                <Button size="sm" variant="outline">
                  Перехопити чат
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function AnalyticsView() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Аналітика та Анти-чіт</h1>
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Лог подій безпеки</h3>
        <div className="space-y-2">
          <LogItem name="Сидоренко І." event="Paste Event (>50 chars/sec)" severity="high" time="14:23" />
          <LogItem name="Петренко О." event="DevTools Opened" severity="medium" time="13:45" />
          <LogItem name="Іваненко М." event="Right Click Blocked" severity="low" time="12:10" />
        </div>
      </Card>

      <Card className="p-4 mt-6 border-primary/30 bg-primary/5">
        <div className="flex gap-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Рекомендації ШІ</h3>
            <p className="text-sm text-muted-foreground">
              На основі статистики класу 11-А: 40% учнів не впоралися з модулем "Рекурсія". Рекомендується створити
              спрощений посібник або провести додатковий урок.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function LogItem({ name, event, severity, time }: any) {
  const colors = {
    high: "bg-red-500/10 text-red-500 border-red-500/30",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    low: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
      <div className="flex items-center gap-3 flex-1">
        <span className={`text-xs px-2 py-1 rounded-full border ${colors[severity]}`}>
          {severity === "high" ? "Критично" : severity === "medium" ? "Попередження" : "Інфо"}
        </span>
        <span className="font-medium">{name}</span>
        <span className="text-sm text-muted-foreground">{event}</span>
      </div>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  )
}

function AISettingsView() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Налаштування ШІ-Асистента</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Персона ШІ для учнів</h3>
          <p className="text-sm text-muted-foreground mb-4">
            ШІ-тьютор використовує педагогічний підхід: ставить запитання замість надання готових відповідей.
          </p>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Заборонити давати готовий код</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Стимулювати самостійне мислення</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Використовувати українську мову</span>
            </label>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold mb-3">Персона ШІ для вчителя</h3>
          <p className="text-sm text-muted-foreground mb-4">
            ШІ-помічник допомагає створювати завдання, аналізувати статистику та надає рекомендації.
          </p>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Автоматична аналітика щодня</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm">Генерувати індивідуальні завдання</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Режим автопілоту (без підтвердження)</span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  )
}
