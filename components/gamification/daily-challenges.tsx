"use client"

import { useAppState } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Trophy } from "lucide-react"

export function DailyChallenges() {
  const { dailyChallenges } = useAppState()

  return (
    <div className="space-y-3">
      {dailyChallenges.map((challenge) => (
        <Card key={challenge.id} className={challenge.completed ? "border-primary/50 bg-primary/5" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {challenge.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Trophy className="h-5 w-5 text-muted-foreground" />
                )}
                <CardTitle className="text-sm">{challenge.title}</CardTitle>
              </div>
              <Badge variant={challenge.completed ? "default" : "secondary"}>+{challenge.reward} XP</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-2">{challenge.description}</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Прогрес</span>
                <span className="font-mono">
                  {challenge.progress} / {challenge.target}
                </span>
              </div>
              <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
