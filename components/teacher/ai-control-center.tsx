"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Bot,
  Sparkles,
  Brain,
  Zap,
  Shield,
  Eye,
  MessageSquare,
  Lightbulb,
  Lock,
  Gauge,
  Cpu,
  Wand2,
  GraduationCap,
  AlertTriangle,
  Check,
} from "lucide-react"

const CARD_CLS = "rounded-xl border border-white/5 bg-card/60 shadow-xl backdrop-blur-md"

const AI_MODELS = [
  { id: "edu-mini", name: "EDU Mini", desc: "Швидка модель для простих підказок", tier: "Базова", speed: 5, smart: 2, icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10", ring: "ring-blue-500/30", bar: "bg-blue-400" },
  { id: "edu-standard", name: "EDU Standard", desc: "Збалансована модель для більшості задач", tier: "Стандарт", speed: 4, smart: 3, icon: Cpu, color: "text-primary", bg: "bg-primary/10", ring: "ring-primary/30", bar: "bg-primary" },
  { id: "edu-pro", name: "EDU Pro", desc: "Глибокі пояснення та складні теми", tier: "Профі", speed: 3, smart: 5, icon: Brain, color: "text-violet-400", bg: "bg-violet-500/10", ring: "ring-violet-500/30", bar: "bg-violet-400" },
  { id: "edu-tutor-x", name: "EDU Tutor X", desc: "Максимальна якість пояснень крок-за-кроком", tier: "Експерт", speed: 2, smart: 5, icon: Sparkles, color: "text-amber-400", bg: "bg-amber-500/10", ring: "ring-amber-500/30", bar: "bg-amber-400" },
]

const HELP_LEVELS = [
  { id: 1, name: "Мінімум", desc: "Тільки натяки, без готових відповідей", color: "text-red-400" },
  { id: 2, name: "Помірний", desc: "Підказки + навідні питання", color: "text-amber-400" },
  { id: 3, name: "Збалансований", desc: "Пояснення з прикладами", color: "text-primary" },
  { id: 4, name: "Активний", desc: "Детальні пояснення крок за кроком", color: "text-blue-400" },
  { id: 5, name: "Максимум", desc: "Повний розбір із готовими розв'язками", color: "text-violet-400" },
]

function StatBars({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-1.5 w-3 rounded-full ${i <= value ? color : "bg-white/10"}`} />
      ))}
    </div>
  )
}

function ToggleRow({
  icon: Icon,
  label,
  desc,
  defaultChecked = false,
  iconColor = "text-primary",
}: {
  icon: any
  label: string
  desc: string
  defaultChecked?: boolean
  iconColor?: string
}) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.05]">
      <div className="flex items-start gap-3 min-w-0">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ${iconColor}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Switch checked={on} onCheckedChange={setOn} className="data-[state=checked]:bg-primary" />
    </div>
  )
}

export function AIControlCenter() {
  const [selectedModel, setSelectedModel] = useState("edu-standard")
  const [helpLevel, setHelpLevel] = useState([3])
  const [creativity, setCreativity] = useState([40])
  const [responseLength, setResponseLength] = useState([60])
  const [strictness, setStrictness] = useState([50])
  const [dailyLimit, setDailyLimit] = useState([25])
  const [saved, setSaved] = useState(false)

  const currentLevel = HELP_LEVELS.find((l) => l.id === helpLevel[0]) ?? HELP_LEVELS[2]

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-card to-card/40 p-6 backdrop-blur-md">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="relative flex items-center gap-2 mb-1">
          <Bot className="h-4 w-4 text-violet-400" />
          <span className="text-xs font-medium uppercase tracking-widest text-violet-400">Центр керування AI</span>
        </div>
        <h2 className="relative text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-violet-300 bg-clip-text text-transparent">
          Налаштування штучного інтелекту
        </h2>
        <p className="relative mt-1 text-sm text-muted-foreground">
          Керуйте поведінкою AI-помічника: оберіть модель, рівень допомоги та десятки параметрів роботи
        </p>
      </div>

      {/* Model selection */}
      <Card className={CARD_CLS}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground">
            <Cpu className="h-4 w-4 text-violet-400" />
            Вибір моделі AI
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Оберіть модель, яку використовуватиме помічник для всіх учнів</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {AI_MODELS.map((m) => {
              const active = selectedModel === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`group text-left rounded-xl border p-4 transition-all ${
                    active
                      ? `${m.bg} border-transparent ring-1 ${m.ring}`
                      : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${m.bg} ${m.color}`}>
                      <m.icon className="h-5 w-5" />
                    </div>
                    {active ? (
                      <Badge className={`${m.bg} ${m.color} border-transparent gap-1`}>
                        <Check className="h-3 w-3" /> Активна
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-white/10 bg-white/5 text-muted-foreground">{m.tier}</Badge>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground mb-3">{m.desc}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Zap className="h-3 w-3" /> Швидкість
                      <StatBars value={m.speed} color={m.bar} />
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Brain className="h-3 w-3" /> Розум
                      <StatBars value={m.smart} color={m.bar} />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Help level */}
      <Card className={CARD_CLS}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground">
            <GraduationCap className="h-4 w-4 text-primary" />
            Рівень допомоги учням
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Наскільки активно AI допомагає під час виконання завдань</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-lg font-bold ${currentLevel.color}`}>{currentLevel.name}</p>
              <p className="text-xs text-muted-foreground">{currentLevel.desc}</p>
            </div>
            <span className="text-3xl font-bold text-foreground">{helpLevel[0]}<span className="text-muted-foreground/70 text-lg">/5</span></span>
          </div>
          <Slider value={helpLevel} onValueChange={setHelpLevel} min={1} max={5} step={1} className="[&_[data-slot=slider-range]]:bg-primary" />
          <div className="flex justify-between text-[10px] text-muted-foreground/70">
            {HELP_LEVELS.map((l) => <span key={l.id}>{l.name}</span>)}
          </div>
        </CardContent>
      </Card>

      {/* Fine-tune sliders */}
      <Card className={CARD_CLS}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground">
            <Gauge className="h-4 w-4 text-blue-400" />
            Тонке налаштування
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Регулюйте поведінку моделі в деталях</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { label: "Креативність відповідей", icon: Wand2, value: creativity, set: setCreativity, hint: "Вище = більш творчі, нижче = більш точні", range: "[&_[data-slot=slider-range]]:bg-violet-500" },
            { label: "Довжина відповідей", icon: MessageSquare, value: responseLength, set: setResponseLength, hint: "Від коротких підказок до розгорнутих пояснень", range: "[&_[data-slot=slider-range]]:bg-blue-500" },
            { label: "Суворість перевірки", icon: Shield, value: strictness, set: setStrictness, hint: "Наскільки прискіпливо AI оцінює відповіді", range: "[&_[data-slot=slider-range]]:bg-amber-500" },
          ].map((s) => (
            <div key={s.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-foreground/90">
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                  {s.label}
                </div>
                <span className="text-sm font-mono font-semibold text-foreground">{s.value[0]}%</span>
              </div>
              <Slider value={s.value} onValueChange={s.set} min={0} max={100} step={5} className={s.range} />
              <p className="text-xs text-muted-foreground/70">{s.hint}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Behaviour toggles */}
      <Card className={CARD_CLS}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground">
            <Lightbulb className="h-4 w-4 text-amber-400" />
            Поведінка помічника
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Увімкніть або вимкніть окремі можливості</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2 lg:grid-cols-2">
          <ToggleRow icon={Lightbulb} label="Покрокові підказки" desc="Розбивати рішення на маленькі кроки" defaultChecked iconColor="text-amber-400" />
          <ToggleRow icon={MessageSquare} label="Навідні питання" desc="Замість відповіді ставити питання" defaultChecked iconColor="text-blue-400" />
          <ToggleRow icon={Eye} label="Показувати джерела" desc="Додавати посилання на матеріал теми" iconColor="text-primary" />
          <ToggleRow icon={Sparkles} label="Емоційна підтримка" desc="Мотивувати та підбадьорювати учня" defaultChecked iconColor="text-pink-400" />
          <ToggleRow icon={Brain} label="Адаптація до рівня" desc="Підлаштовувати складність під учня" defaultChecked iconColor="text-violet-400" />
          <ToggleRow icon={Zap} label="Швидкі відповіді" desc="Пріоритет швидкості над деталізацією" iconColor="text-cyan-400" />
        </CardContent>
      </Card>

      {/* Safety & limits */}
      <Card className={CARD_CLS}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm text-foreground">
            <Shield className="h-4 w-4 text-red-400" />
            Безпека та обмеження
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Захист та контроль використання</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 lg:grid-cols-2">
            <ToggleRow icon={Lock} label="Блокувати готові відповіді на тестах" desc="Під час контрольних AI лише підказує" defaultChecked iconColor="text-red-400" />
            <ToggleRow icon={Shield} label="Фільтр недоречного контенту" desc="Блокувати запити поза темою навчання" defaultChecked iconColor="text-primary" />
            <ToggleRow icon={AlertTriangle} label="Сповіщати про списування" desc="Позначати підозрілу активність" defaultChecked iconColor="text-amber-400" />
            <ToggleRow icon={Eye} label="Журнал усіх запитів" desc="Зберігати історію діалогів учнів" defaultChecked iconColor="text-blue-400" />
          </div>
          <div className="space-y-2 rounded-lg border border-white/5 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-foreground/90">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                Ліміт AI-запитів на учня (на день)
              </div>
              <span className="text-sm font-mono font-semibold text-foreground">{dailyLimit[0]}</span>
            </div>
            <Slider value={dailyLimit} onValueChange={setDailyLimit} min={5} max={100} step={5} className="[&_[data-slot=slider-range]]:bg-red-500" />
            <p className="text-xs text-muted-foreground/70">Після досягнення ліміту помічник тимчасово недоступний</p>
          </div>
        </CardContent>
      </Card>

      {/* Save bar */}
      <div className="flex items-center justify-between rounded-xl border border-white/5 bg-card/60 p-4 backdrop-blur-md">
        <p className="text-xs text-muted-foreground">
          {saved ? "Налаштування збережено (демо-режим)" : "Зміни застосуються до всіх учнів після збереження"}
        </p>
        <Button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          {saved ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          {saved ? "Збережено" : "Зберегти налаштування"}
        </Button>
      </div>
    </div>
  )
}