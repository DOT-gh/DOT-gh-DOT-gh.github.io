"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Plus,
  Sparkles,
  PencilLine,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe,
  Code2,
  Languages,
  Palette,
  Music,
  Wand2,
  Check,
  FileText,
  Clock,
  Users,
  Bot,
  Loader2,
  ChevronRight,
} from "lucide-react"

const CARD_CLS = "rounded-xl border border-white/5 bg-zinc-900/40 shadow-xl backdrop-blur-md"

const SUBJECTS = [
  { id: "math", name: "Математика", icon: Calculator, color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "cs", name: "Інформатика", icon: Code2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "physics", name: "Фізика", icon: FlaskConical, color: "text-violet-400", bg: "bg-violet-500/10" },
  { id: "lang", name: "Мови", icon: Languages, color: "text-amber-400", bg: "bg-amber-500/10" },
  { id: "geo", name: "Географія", icon: Globe, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { id: "lit", name: "Література", icon: BookOpen, color: "text-pink-400", bg: "bg-pink-500/10" },
  { id: "art", name: "Мистецтво", icon: Palette, color: "text-orange-400", bg: "bg-orange-500/10" },
  { id: "music", name: "Музика", icon: Music, color: "text-rose-400", bg: "bg-rose-500/10" },
]

const TEMPLATES = [
  { id: "t1", title: "Лінійні рівняння", subject: "Математика", tasks: 12, difficulty: "Середня" },
  { id: "t2", title: "Основи алгоритмів", subject: "Інформатика", tasks: 8, difficulty: "Легка" },
  { id: "t3", title: "Закони Ньютона", subject: "Фізика", tasks: 10, difficulty: "Складна" },
  { id: "t4", title: "Частини мови", subject: "Мови", tasks: 15, difficulty: "Легка" },
]

const EXISTING = [
  { id: "a1", title: "Квадратні рівняння", subject: "Математика", assigned: "7-А, 8-Б", done: 18, total: 24, status: "active" },
  { id: "a2", title: "Цикли та масиви", subject: "Інформатика", assigned: "9-В", done: 12, total: 12, status: "done" },
  { id: "a3", title: "Механічний рух", subject: "Фізика", assigned: "8-Б", done: 4, total: 20, status: "active" },
]

export function AssignmentCreator() {
  const [mode, setMode] = useState<"ai" | "manual">("ai")
  const [subject, setSubject] = useState("math")
  const [topic, setTopic] = useState("")
  const [count, setCount] = useState([10])
  const [difficulty, setDifficulty] = useState([2])
  const [aiHelp, setAiHelp] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const diffLabels = ["Дуже легка", "Легка", "Середня", "Складна", "Експертна"]

  const handleGenerate = () => {
    setGenerating(true)
    setGenerated(false)
    setTimeout(() => {
      setGenerating(false)
      setGenerated(true)
    }, 1800)
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900/80 to-zinc-900/30 p-6 backdrop-blur-md">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative flex items-center gap-2 mb-1">
          <Plus className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-medium uppercase tracking-widest text-blue-400">Конструктор завдань</span>
        </div>
        <h2 className="relative text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-blue-300 bg-clip-text text-transparent">
          Створення завдань
        </h2>
        <p className="relative mt-1 text-sm text-zinc-400">
          Згенеруйте завдання за допомогою AI або складіть власноруч, оберіть предмет, складність і налаштування
        </p>
      </div>

      {/* Mode switch */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setMode("ai")}
          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
            mode === "ai" ? "border-transparent bg-violet-500/10 ring-1 ring-violet-500/30" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Згенерувати з AI</p>
            <p className="text-xs text-zinc-500">Опишіть тему — AI створить завдання</p>
          </div>
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
            mode === "manual" ? "border-transparent bg-emerald-500/10 ring-1 ring-emerald-500/30" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
            <PencilLine className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Скласти вручну</p>
            <p className="text-xs text-zinc-500">Напишіть завдання самостійно</p>
          </div>
        </button>
      </div>

      {/* Subject picker */}
      <Card className={CARD_CLS}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            Предмет
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">Оберіть предмет для завдання</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUBJECTS.map((s) => {
              const active = subject === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setSubject(s.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-all ${
                    active ? `${s.bg} border-transparent ring-1 ring-white/10` : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <s.icon className={`h-5 w-5 ${active ? s.color : "text-zinc-500"}`} />
                  <span className={`text-xs ${active ? "text-white font-medium" : "text-zinc-500"}`}>{s.name}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Topic & details */}
      <Card className={CARD_CLS}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <FileText className="h-4 w-4 text-blue-400" />
            {mode === "ai" ? "Опис теми для AI" : "Зміст завдання"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">Назва завдання</label>
            <Input
              placeholder="Напр. Квадратні рівняння"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400">{mode === "ai" ? "Що має згенерувати AI" : "Текст завдання"}</label>
            <Textarea
              placeholder={mode === "ai" ? "Напр. створи 10 завдань на розв'язання квадратних рівнянь з поступовим ускладненням..." : "Введіть умову завдання..."}
              rows={4}
              className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 resize-none"
            />
          </div>

          {mode === "ai" && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300">Кількість завдань</span>
                  <span className="text-sm font-mono font-semibold text-white">{count[0]}</span>
                </div>
                <Slider value={count} onValueChange={setCount} min={1} max={30} step={1} className="[&_[data-slot=slider-range]]:bg-blue-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300">Складність</span>
                  <span className="text-sm font-semibold text-violet-400">{diffLabels[difficulty[0]]}</span>
                </div>
                <Slider value={difficulty} onValueChange={setDifficulty} min={0} max={4} step={1} className="[&_[data-slot=slider-range]]:bg-violet-500" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] p-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-violet-400" />
                  <div>
                    <p className="text-sm text-white">Дозволити AI-підказки учням</p>
                    <p className="text-xs text-zinc-500">Помічник зможе допомагати з цим завданням</p>
                  </div>
                </div>
                <Switch checked={aiHelp} onCheckedChange={setAiHelp} className="data-[state=checked]:bg-emerald-500" />
              </div>

              <Button onClick={handleGenerate} disabled={generating} className="w-full bg-violet-500 text-white hover:bg-violet-600 gap-2">
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {generating ? "AI генерує завдання..." : "Згенерувати з AI"}
              </Button>

              {generated && (
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <p className="text-sm font-medium text-white">Згенеровано {count[0]} завдань (демо)</p>
                  </div>
                  <div className="space-y-1.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                        <ChevronRight className="h-3 w-3 text-emerald-400" />
                        Завдання {i}: розв'яжіть рівняння {i}x² + {i + 1}x − {i} = 0
                      </div>
                    ))}
                    <p className="text-xs text-zinc-600 pl-5">...та ще {count[0] - 3} завдань</p>
                  </div>
                </div>
              )}
            </>
          )}

          {mode === "manual" && (
            <Button className="w-full bg-emerald-500 text-white hover:bg-emerald-600 gap-2">
              <Plus className="h-4 w-4" />
              Додати завдання
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Standard templates */}
      <Card className={CARD_CLS}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <BookOpen className="h-4 w-4 text-amber-400" />
            Готові шаблони
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">Стандартні набори завдань — використайте як основу</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {TEMPLATES.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.05]">
              <div>
                <p className="text-sm font-medium text-white">{t.title}</p>
                <p className="text-xs text-zinc-500">{t.subject} · {t.tasks} завдань · {t.difficulty}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                Обрати
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Existing assignments */}
      <Card className={CARD_CLS}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-white">
            <Clock className="h-4 w-4 text-emerald-400" />
            Активні завдання
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">Раніше створені завдання та їх прогрес</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {EXISTING.map((a) => (
            <div key={a.id} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{a.title}</p>
                  <Badge
                    className={a.status === "done"
                      ? "border-transparent bg-emerald-500/10 text-emerald-400"
                      : "border-transparent bg-blue-500/10 text-blue-400"}
                  >
                    {a.status === "done" ? "Завершено" : "Активне"}
                  </Badge>
                </div>
                <span className="text-xs font-mono text-zinc-400">{a.done}/{a.total}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2">
                <span>{a.subject}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{a.assigned}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  style={{ width: `${(a.done / a.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
