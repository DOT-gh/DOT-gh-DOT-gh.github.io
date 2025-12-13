"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Snowflake, Flame, Shield } from "lucide-react"
import { useAppState } from "@/lib/store"
import { toast } from "@/hooks/use-toast"

export function StreakFreeze() {
  const { streak, xp } = useAppState()
  const [freezesAvailable, setFreezesAvailable] = useState(() => {
    const saved = localStorage.getItem("streak_freezes")
    return saved ? Number.parseInt(saved) : 1
  })

  const handleUseFreeze = () => {
    if (freezesAvailable > 0) {
      setFreezesAvailable((prev) => {
        const newCount = prev - 1
        localStorage.setItem("streak_freezes", newCount.toString())
        return newCount
      })

      toast({
        variant: "success",
        title: "Заморозку активовано!",
        description: "Твоя серія захищена на 1 день",
      })
    }
  }

  const handleBuyFreeze = () => {
    if (xp >= 500) {
      // Deduct XP (would need to implement in store)
      setFreezesAvailable((prev) => {
        const newCount = prev + 1
        localStorage.setItem("streak_freezes", newCount.toString())
        return newCount
      })

      toast({
        variant: "success",
        title: "Заморозку куплено!",
        description: "Витрачено 500 XP",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Недостатньо XP",
        description: "Потрібно 500 XP для покупки заморозки",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Snowflake className="h-4 w-4 text-blue-400" />
          Заморозка серії
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Поточна серія</p>
            <div className="flex items-center gap-2 mt-1">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">{streak} днів</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Доступно заморозок</p>
            <div className="flex items-center justify-end gap-2 mt-1">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-2xl font-bold">{freezesAvailable}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button className="w-full" size="sm" disabled={freezesAvailable === 0} onClick={handleUseFreeze}>
            Використати заморозку
          </Button>
          <Button className="w-full" variant="secondary" size="sm" onClick={handleBuyFreeze}>
            Купити заморозку (500 XP)
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">Заморозка дозволяє пропустити 1 день без збивання серії</p>
      </CardContent>
    </Card>
  )
}
