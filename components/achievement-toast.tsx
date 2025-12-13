"use client"

import { useEffect } from "react"
import { useAppState } from "@/lib/store"
import { toast } from "@/hooks/use-toast"

let confetti: any = null
if (typeof window !== "undefined") {
  import("canvas-confetti").then((module) => {
    confetti = module.default
  })
}

export function AchievementToast() {
  const { achievements } = useAppState()

  useEffect(() => {
    const latestAchievement = achievements.find(
      (a) => a.unlocked && a.unlockedAt && Date.now() - new Date(a.unlockedAt).getTime() < 3000,
    )

    if (latestAchievement) {
      // Confetti animation
      if (confetti) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#4ade80", "#60a5fa", "#f59e0b"],
        })
      }

      // Show toast
      toast({
        variant: "success",
        title: `${latestAchievement.icon} Нова відзнака!`,
        description: `${latestAchievement.title}: ${latestAchievement.description}`,
      })
    }
  }, [achievements])

  return null
}
