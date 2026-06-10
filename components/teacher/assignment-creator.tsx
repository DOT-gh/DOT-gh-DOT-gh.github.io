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

const CARD_CLS = "rounded-xl border border-white/5 bg-card/60 shadow-xl backdrop-blur-md"

const SUBJECTS = [
  { id: "math", name: "Математика", icon: Calculator, color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "cs", name: "Інформатика", icon: Code2, color: "text-primary", bg: "bg-primary/10" },
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
  { id: "a1", title: "Квадратні рівняння", subject: "Математика", assigned: "8-А, 8-Б", done: 18, total: 24, status: "active" },
  { id: "a2", title: "Цикли та масиви", subject: "Інформатика", assigned: "9-А", done: 12, total: 12, status: "done" },
  { id: "a3", title: "SQL JOIN практика", subject: "Інформатика", assigned: "11-А", done: 14, total: 24, status: "active" },
  { id: "a4", title: "Гра «Робот» — рівень 5", subject: "Інформатика", assigned: "5-А (1 та 2 підгр.)", done: 9, total: 27, status: "active" },
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
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-card to-card/40 p-6 backdrop-blur-md">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative flex items-center gap-2 mb-1">
          <Plus className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-medium uppercase tracking-widest text-blue-400">Конструктор завдань</span>
        </div>
        <h2 className="relative text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-blue-300 bg-clip-text text-transparent">
          Створення завдань
        </h2>
        <p className="relative mt-1 text-sm text-muted-foreground">
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
            <p className="text-sm font-semibold text-foreground">Згенерувати з AI</p>
            <p className="text-xs text-muted-foreground">Опишіть тему — AI створить завдання</p>
          </div>
        </button>
        <button
          onClick={() => setMode("manual")}
          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
            mode === "manual" ? "border-transparent bg-primary/10 ring-1 ring-primary/30" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <PencilLine className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Скласти вручну</p>
            <p className="text-xs text-muted-foreground">Напишіть завдання самостійно</p>
          </div>
        </button>
      </div>

      {/* Subject picker */}
      <Card className={CARD_CLS}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            Предмет
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Оберіть предмет для завдання</CardDescription>
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
                  <s.icon className={`h-5 w-5 ${active ? s.color : "text-muted-foreground"}`} />
                  <span className={`text-xs ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s.name}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Topic & details */}
      <Card className={CARD_CLS}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground">
            <FileText className="h-4 w-4 text-blue-400" />
            {mode === "ai" ? "Опис теми для AI" : "Зміст завдання"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Назва завдання</label>
            <Input
              placeholder="Напр. Квадратні рівняння"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground/70"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">{mode === "ai" ? "Що має згенерувати AI" : "Текст завдання"}</label>
            <Textarea
              placeholder={mode === "ai" ? "Напр. створи 10 завдань на розв'язання квадратних рівнянь з поступовим ускладненням..." : "Введіть умову завдання..."}
              rows={4}
              className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground/70 resize-none"
            />
          </div>

          {mode === "ai" && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/90">Кількість завдань</span>
                  <span className="text-sm font-mono font-semibold text-foreground">{count[0]}</span>
                </div>
                <Slider value={count} onValueChange={setCount} min={1} max={30} step={1} className="[&_[data-slot=slider-range]]:bg-blue-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground/90">Складність</span>
                  <span className="text-sm font-semibold text-violet-400">{diffLabels[difficulty[0]]}</span>
                </div>
                <Slider value={difficulty} onValueChange={setDifficulty} min={0} max={4} step={1} className="[&_[data-slot=slider-range]]:bg-violet-500" />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] p-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-violet-400" />
                  <div>
                    <p className="text-sm text-foreground">Дозволити AI-підказки учням</p>
                    <p className="text-xs text-muted-foreground">Помічник зможе допомагати з цим завданням</p>
                  </div>
                </div>
                <Switch checked={aiHelp} onCheckedChange={setAiHelp} className="data-[state=checked]:bg-primary" />
              </div>

              <Button onClick={handleGenerate} disabled={generating} className="w-full bg-violet-500 text-foreground hover:bg-violet-600 gap-2">
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {generating ? "AI генерує завдання..." : "Згенерувати з AI"}
              </Button>

              {generated && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Згенеровано {count[0]} завдань (демо)</p>
                  </div>
                  <div className="space-y-1.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ChevronRight className="h-3 w-3 text-primary" />
                        Завдання {i}: розв'яжіть рівняння {i}x² + {i + 1}x − {i} = 0
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground/70 pl-5">...та ще {count[0] - 3} завдань</p>
                  </div>
                </div>
              )}
            </>
          )}

          {mode === "manual" && (
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="h-4 w-4" />
              Додати завдання
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Standard templates */}
      <Card className={CARD_CLS}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground">
            <BookOpen className="h-4 w-4 text-amber-400" />
            Готові шаблони
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Стандартні набори завдань — використайте як основу</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {TEMPLATES.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.05]">
              <div>
                <p className="text-sm font-medium text-foreground">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.subject} · {t.tasks} завдань · {t.difficulty}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                Обрати
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Existing assignments */}
      <Card className={CARD_CLS}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            Активні завдання
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Раніше створені завдання та їх прогрес</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {EXISTING.map((a) => (
            <div key={a.id} className="rounded-lg border border-white/5 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <Badge
                    className={a.status === "done"
                      ? "border-transparent bg-primary/10 text-primary"
                      : "border-transparent bg-blue-500/10 text-blue-400"}
                  >
                    {a.status === "done" ? "Завершено" : "Активне"}
                  </Badge>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{a.done}/{a.total}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span>{a.subject}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{a.assigned}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary"
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