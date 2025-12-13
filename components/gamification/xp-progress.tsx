"use client"

import { useAppState } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Zap, Trophy } from "lucide-react"

export function XPProgress() {
  const { xp, level, streak } = useAppState()

  const xpForNextLevel = level * 1000
  const currentLevelXP = xp % 1000
  const progressPercent = (currentLevelXP / 1000) * 100

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Рівень {level}</CardTitle>
          <Badge variant="default" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            {xp} XP
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">До наступного рівня</span>
            <span className="font-mono">
              {currentLevelXP} / {1000} XP
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">Серія</span>
            </div>
            <p className="text-xl font-bold">{streak} днів</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Ранг</span>
            </div>
            <p className="text-xl font-bold">#{Math.floor(Math.random() * 50) + 1}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
