"use client"

import { Card } from "@/components/ui/card"
import { TrendingDown } from "lucide-react"

interface FunnelStage {
  name: string
  value: number
  color: string
}

export default function FunnelChart() {
  const stages: FunnelStage[] = [
    { name: "Відкрили завдання", value: 100, color: "bg-blue-500" },
    { name: "Почали виконувати", value: 85, color: "bg-cyan-500" },
    { name: "Попросили підказку", value: 62, color: "bg-teal-500" },
    { name: "Здали спробу", value: 78, color: "bg-emerald-500" },
    { name: "Склали успішно", value: 71, color: "bg-green-500" },
  ]

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <TrendingDown className="h-4 w-4 text-primary" />
        Воронка виконання завдань
      </h3>
      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const width = stage.value
          const prevValue = idx > 0 ? stages[idx - 1].value : 100
          const dropRate = idx > 0 ? Math.round(((prevValue - stage.value) / prevValue) * 100) : 0

          return (
            <div key={stage.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{stage.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stage.value}%</span>
                  {idx > 0 && <span className="text-xs text-red-500">-{dropRate}%</span>}
                </div>
              </div>
              <div className="relative h-8 bg-muted rounded overflow-hidden">
                <div
                  className={`h-full ${stage.color} transition-all duration-500 flex items-center justify-center text-white text-xs font-medium`}
                  style={{ width: `${width}%` }}
                >
                  {stage.value}%
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <p className="text-sm text-amber-300">
          <strong>Рекомендація:</strong> 15% учнів відкривають але не виконують завдання. Спробуйте додати більш
          захоплюючі описи.
        </p>
      </div>
    </Card>
  )
}
