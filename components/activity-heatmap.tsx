"use client"

import { Card } from "./ui/card"
import { Activity } from "lucide-react"

interface HeatmapData {
  date: string
  hour: number
  value: number
}

const generateHeatmapData = (): HeatmapData[] => {
  // Дати практики 17.11 (Пн) - 21.11 (Пт)
  const dates = [
    { date: "17", day: "Пн" },
    { date: "18", day: "Вт" },
    { date: "19", day: "Ср" },
    { date: "20", day: "Чт" },
    { date: "21", day: "Пт" },
  ]
  const data: HeatmapData[] = []

  dates.forEach(({ date }, dayIdx) => {
    for (let hour = 8; hour <= 20; hour++) {
      // Більша активність в робочі години (9-15)
      let value = 0
      if (hour >= 9 && hour <= 15) {
        value = Math.floor(Math.random() * 30) + 10 // 10-40
      } else if (hour >= 16 && hour <= 18) {
        value = Math.floor(Math.random() * 15) + 5 // 5-20
      } else {
        value = Math.floor(Math.random() * 5) // 0-5
      }

      // В останній день (21.11) зменшуємо активність після обіду
      if (dayIdx === 4 && hour > 14) {
        value = Math.floor(value * 0.3)
      }

      data.push({ date, hour, value })
    }
  })

  return data
}

export default function ActivityHeatmap() {
  const data = generateHeatmapData()

  const getColor = (value: number) => {
    if (value === 0) return "bg-gray-800"
    if (value < 5) return "bg-emerald-950"
    if (value < 10) return "bg-emerald-900"
    if (value < 20) return "bg-emerald-700"
    if (value < 30) return "bg-emerald-500"
    return "bg-emerald-400"
  }

  const hours = Array.from({ length: 13 }, (_, i) => i + 8) // 8-20
  const dates = [
    { date: "17", day: "Пн" },
    { date: "18", day: "Вт" },
    { date: "19", day: "Ср" },
    { date: "20", day: "Чт" },
    { date: "21", day: "Пт" },
  ]

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        Heatmap активності (останній тиждень)
      </h3>

      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-1 min-w-max">
          {/* Заголовок з годинами */}
          <div className="flex gap-1 ml-10">
            {hours.map((hour) => (
              <div key={hour} className="w-6 h-5 text-[10px] text-muted-foreground text-center">
                {hour}
              </div>
            ))}
          </div>

          {/* Ряди з днями */}
          {dates.map(({ date, day }) => (
            <div key={date} className="flex items-center gap-1">
              <div className="w-8 text-xs text-muted-foreground text-right">{day}</div>
              {hours.map((hour) => {
                const cell = data.find((d) => d.date === date && d.hour === hour)
                return (
                  <div
                    key={`${date}-${hour}`}
                    className={cn("w-6 h-6 rounded-sm transition-colors", getColor(cell?.value || 0))}
                    title={`${date}.11 ${hour}:00 - ${cell?.value || 0} учнів`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <span>Менше</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded-sm bg-gray-800" />
          <div className="w-4 h-4 rounded-sm bg-emerald-950" />
          <div className="w-4 h-4 rounded-sm bg-emerald-900" />
          <div className="w-4 h-4 rounded-sm bg-emerald-700" />
          <div className="w-4 h-4 rounded-sm bg-emerald-500" />
          <div className="w-4 h-4 rounded-sm bg-emerald-400" />
        </div>
        <span>Більше</span>
      </div>

      <p className="text-xs text-muted-foreground mt-3">Пік активності: Вівторок 10:00-12:00 (урок інформатики)</p>
    </Card>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
