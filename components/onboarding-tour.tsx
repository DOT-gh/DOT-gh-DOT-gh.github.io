"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, ArrowRight, Lightbulb, Code, Bot, Trophy } from "lucide-react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Progress } from "./ui/progress"
import { useStore } from "@/lib/store"

interface TourStep {
  target: string
  title: string
  description: string
  icon: React.ReactNode
  position: "top" | "bottom" | "left" | "right"
}

const TOUR_STEPS: TourStep[] = [
  {
    target: "dashboard",
    title: "Вітаємо в Edu Survival Kit!",
    description: "Це твоя головна панель. Тут ти бачиш свій прогрес, досягнення та завдання.",
    icon: <Lightbulb className="h-5 w-5" />,
    position: "bottom",
  },
  {
    target: "code-editor",
    title: "Редактор коду",
    description:
      "Тут ти пишеш код на Python. Використовуй Tab для відступів та Ctrl+/ для коментарів. Autocomplete допоможе писати швидше!",
    icon: <Code className="h-5 w-5" />,
    position: "left",
  },
  {
    target: "ai-tutor",
    title: "ШІ-тьютор",
    description:
      "Якщо застряг - запитай у ШІ! Він не дасть готову відповідь, але підкаже напрямок. Вибери рівень підказки та характер тьютора в налаштуваннях.",
    icon: <Bot className="h-5 w-5" />,
    position: "left",
  },
  {
    target: "gamification",
    title: "Геймфікація",
    description:
      "За кожне завдання отримуєш XP та прогресуєш рівні! Виконуй щоденні челенджі, збирай досягнення та змагайся з однокласниками в таблиці лідерів.",
    icon: <Trophy className="h-5 w-5" />,
    position: "bottom",
  },
]

export default function OnboardingTour() {
  const { completedTour, markTourComplete } = useStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Показати тур тільки новим користувачам
    if (!completedTour) {
      setTimeout(() => setVisible(true), 500)
    }
  }, [completedTour])

  if (!visible || completedTour) return null

  const step = TOUR_STEPS[currentStep]
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleSkip = () => {
    setVisible(false)
    markTourComplete()
  }

  const handleComplete = () => {
    setVisible(false)
    markTourComplete()
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40 animate-in fade-in duration-300" />

      {/* Tour Card */}
      <Card className="fixed z-50 max-w-md p-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">{step.icon}</div>
            <div>
              <p className="text-xs text-muted-foreground">
                Крок {currentStep + 1} з {TOUR_STEPS.length}
              </p>
              <h3 className="font-semibold text-lg">{step.title}</h3>
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={handleSkip}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">{step.description}</p>

        <Progress value={progress} className="mb-4" />

        <div className="flex items-center justify-between gap-2">
          <Button variant="ghost" onClick={handleSkip}>
            Пропустити тур
          </Button>
          <Button onClick={handleNext}>
            {currentStep < TOUR_STEPS.length - 1 ? (
              <>
                Далі
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            ) : (
              "Почати навчання!"
            )}
          </Button>
        </div>
      </Card>
    </>
  )
}
