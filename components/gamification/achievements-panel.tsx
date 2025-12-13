"use client"

import { useAppState } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"

export function AchievementsPanel() {
  const { achievements } = useAppState()

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-zinc-500"
      case "rare":
        return "bg-blue-500"
      case "epic":
        return "bg-purple-500"
      case "legendary":
        return "bg-amber-500"
      default:
        return "bg-zinc-500"
    }
  }

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {achievements.map((achievement) => (
        <Card
          key={achievement.id}
          className={cn(
            "border-border transition-all",
            achievement.unlocked && "border-primary/50 bg-primary/5",
            !achievement.unlocked && "opacity-60",
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg text-2xl",
                    achievement.unlocked ? getRarityColor(achievement.rarity) + "/20" : "bg-secondary",
                  )}
                >
                  {achievement.unlocked ? achievement.icon : <Lock className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div>
                  <CardTitle className="text-sm">{achievement.title}</CardTitle>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {achievement.rarity}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-xs">{achievement.description}</CardDescription>
            {achievement.unlocked && achievement.unlockedAt && (
              <p className="mt-2 text-xs text-muted-foreground">
                Отримано: {new Date(achievement.unlockedAt).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
