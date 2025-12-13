"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertTriangle, Star } from "lucide-react"

interface Prediction {
  studentName: string
  prediction: string
  confidence: number
  type: "success" | "warning" | "info"
  recommendation: string
}

export default function PredictionsPanel({ screenMode }: { screenMode: boolean }) {
  const predictions: Prediction[] = [
    {
      studentName: screenMode ? "████████" : "Коваленко",
      prediction: "Досягне 100% виконання до кінця місяця",
      confidence: 92,
      type: "success",
      recommendation: "Дайте складніші завдання для розвитку",
    },
    {
      studentName: screenMode ? "████████" : "Сидоренко",
      prediction: "Може втратити мотивацію через складність",
      confidence: 78,
      type: "warning",
      recommendation: "Зверніть увагу, запропонуйте індивідуальну консультацію",
    },
    {
      studentName: screenMode ? "████████" : "Петренко",
      prediction: "Покращить результат на 20% з додатковою підтримкою ШІ",
      confidence: 85,
      type: "info",
      recommendation: "Увімкніть адаптивні підказки",
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Star className="h-4 w-4 text-emerald-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      default:
        return <TrendingUp className="h-4 w-4 text-blue-500" />
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-emerald-500/30 bg-emerald-500/5"
      case "warning":
        return "border-amber-500/30 bg-amber-500/5"
      default:
        return "border-blue-500/30 bg-blue-500/5"
    }
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Brain className="h-4 w-4 text-primary" />
        Прогнози ШІ (ML Predictions)
      </h3>
      <div className="space-y-3">
        {predictions.map((pred, idx) => (
          <div key={idx} className={`p-4 rounded-lg border ${getColor(pred.type)}`}>
            <div className="flex items-start gap-3">
              {getIcon(pred.type)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{pred.studentName}</span>
                  <Badge variant="outline" className="text-xs">
                    {pred.confidence}% впевненість
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{pred.prediction}</p>
                <p className="text-xs text-muted-foreground italic">{pred.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
