"use client"

import { useState } from "react"
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Code2,
  Bot,
  WifiOff,
  TrendingUp,
  Award,
  Users,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const STEPS = [
  {
    icon: Code2,
    title: "Пиши й запускай код у браузері",
    text: "Жодних встановлень. Відкрив урок — одразу пишеш код і бачиш результат, як у професійному редакторі.",
    badge: "Редактор коду",
  },
  {
    icon: Bot,
    title: "AI-помічник пояснить помилку",
    text: "Застряг? Вбудований помічник підкаже, де помилка, і пояснить тему простими словами — без осуду.",
    badge: "AI підказки",
  },
  {
    icon: WifiOff,
    title: "Навчайся навіть офлайн",
    text: "Зник інтернет? Уроки та завдання залишаються доступними, а прогрес синхронізується пізніше.",
    badge: "Офлайн режим",
  },
  {
    icon: TrendingUp,
    title: "Відстежуй свій прогрес",
    text: "Графіки, бали та досягнення показують, як ти ростеш від уроку до уроку.",
    badge: "Аналітика",
  },
  {
    icon: Award,
    title: "Отримуй досягнення",
    text: "За виконані завдання та серії занять відкриваються бейджі — навчання як гра.",
    badge: "Гейміфікація",
  },
  {
    icon: Users,
    title: "Вчитель бачить твій клас",
    text: "Окрема панель для вчителя зі статистикою по кожному учню та групі. Усе під контролем.",
    badge: "Для вчителів",
  },
]

export function DemoTour() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  const s = STEPS[step]
  const Icon = s.icon

  if (!open) {
    return (
      <button
        onClick={() => {
          setOpen(true)
          setStep(0)
        }}
        className="group flex w-full items-center gap-3 rounded-xl border border-dashed border-primary/30 bg-primary/[0.04] p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/[0.07]"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Що тут можна робити?</p>
          <p className="text-xs text-muted-foreground">
            Швидкий тур по можливостях платформи — 6 кроків
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-0.5" />
      </button>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-card p-5 shadow-sm sm:p-6">
      <button
        onClick={() => setOpen(false)}
        className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Закрити тур"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
          {s.badge}
        </span>
      </div>

      <h3 className="text-lg font-bold text-foreground text-balance">{s.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>

      {/* Точки прогресса */}
      <div className="mt-5 flex items-center gap-1.5">
        {STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            aria-label={`Крок ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? "w-6 bg-primary" : "w-1.5 bg-secondary hover:bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep((p) => Math.max(0, p - 1))}
          disabled={step === 0}
          className="gap-1 text-muted-foreground disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Назад
        </Button>
        <span className="text-xs text-muted-foreground">
          {step + 1} / {STEPS.length}
        </span>
        {step + 1 < STEPS.length ? (
          <Button size="sm" onClick={() => setStep((p) => p + 1)} className="gap-1">
            Далі
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm" onClick={() => setOpen(false)} className="gap-1">
            Готово
          </Button>
        )}
      </div>
    </div>
  )
}
