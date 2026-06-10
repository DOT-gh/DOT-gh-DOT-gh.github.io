"use client"

import { useEffect, useRef, useState } from "react"
import { Users, BookOpen, CheckCircle2, Code2, Trophy, Clock } from "lucide-react"

type Stat = {
  icon: typeof Users
  value: number
  suffix: string
  label: string
  color: string
}

const STATS: Stat[] = [
  { icon: Users, value: 1240, suffix: "+", label: "Учнів навчається", color: "text-primary" },
  { icon: BookOpen, value: 86, suffix: "", label: "Інтерактивних уроків", color: "text-accent" },
  { icon: CheckCircle2, value: 14500, suffix: "+", label: "Виконаних завдань", color: "text-primary" },
  { icon: Code2, value: 320, suffix: "k", label: "Рядків коду написано", color: "text-accent" },
  { icon: Trophy, value: 97, suffix: "%", label: "Завершують курс", color: "text-primary" },
  { icon: Clock, value: 24, suffix: "/7", label: "Доступ до платформи", color: "text-accent" },
]

function useCountUp(target: number, run: boolean, duration = 1400) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run, duration])
  return val
}

function StatCard({ stat, run }: { stat: Stat; run: boolean }) {
  const val = useCountUp(stat.value, run)
  const Icon = stat.icon
  const display = val >= 1000 ? (val / 1000).toFixed(1).replace(".0", "") + "k" : val.toString()
  const shown = stat.value >= 1000 ? display : val.toString()
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30">
      <Icon className={`mb-2 h-5 w-5 ${stat.color}`} />
      <div className="text-2xl font-bold text-foreground sm:text-3xl">
        {shown}
        <span className={stat.color}>{stat.suffix}</span>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
    </div>
  )
}

export function DemoLiveStats() {
  const ref = useRef<HTMLDivElement>(null)
  const [run, setRun] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {STATS.map((s) => (
        <StatCard key={s.label} stat={s} run={run} />
      ))}
    </div>
  )
}
