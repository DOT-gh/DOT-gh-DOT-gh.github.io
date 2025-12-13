"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Gift, Star } from "lucide-react"
import { useAppState } from "@/lib/store"

interface Milestone {
  streak: number
  reward: string
  icon: string
}

const milestones: Milestone[] = [
  { streak: 7, reward: "Бронзова відзнака", icon: "🥉" },
  { streak: 14, reward: "1 заморозка серії", icon: "❄️" },
  { streak: 30, reward: "Срібна відзнака", icon: "🥈" },
  { streak: 50, reward: "Тема Ocean", icon: "🌊" },
  { streak: 100, reward: "Золота відзнака", icon: "🥇" },
  { streak: 365, reward: "Платинова відзнака", icon: "💎" },
]

export function MilestoneRewards() {
  const { streak } = useAppState()

  const nextMilestone = milestones.find((m) => m.streak > streak) || milestones[milestones.length - 1]
  const progress = (streak / nextMilestone.streak) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Gift className="h-4 w-4" />
          Milestone нагороди
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Поточний прогрес</span>
            <span className="font-medium">
              {streak} / {nextMilestone.streak} днів
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Наступні віхи:</p>
          {milestones
            .filter((m) => m.streak > streak)
            .slice(0, 3)
            .map((milestone) => (
              <div
                key={milestone.streak}
                className="flex items-center justify-between p-2 rounded bg-secondary/50 border border-border"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{milestone.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{milestone.reward}</p>
                    <p className="text-xs text-muted-foreground">{milestone.streak} днів</p>
                  </div>
                </div>
                <Star className="h-4 w-4 text-amber-500" />
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
