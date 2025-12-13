"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react"

interface TourStep {
  target: string
  title: string
  description: string
  position: "top" | "bottom" | "left" | "right"
}

const tourSteps: TourStep[] = [
  {
    target: "[data-tour='dashboard']",
    title: "Панель керування",
    description: "Тут ти бачиш свій прогрес, статистику та доступні курси. Починай свою подорож в програмування!",
    position: "bottom",
  },
  {
    target: "[data-tour='courses']",
    title: "Курси",
    description: "Вибери курс для навчання. Python - чудовий вибір для початківців!",
    position: "top",
  },
  {
    target: "[data-tour='xp-progress']",
    title: "Твій рівень",
    description: "За кожне виконане завдання ти отримуєш XP. Збирай досвід і підвищуй рівень!",
    position: "left",
  },
  {
    target: "[data-tour='challenges']",
    title: "Щоденні завдання",
    description: "Виконуй щоденні челенджі для додаткових бонусів. Не збивай свою серію!",
    position: "left",
  },
  {
    target: "[data-tour='ai-tutor']",
    title: "ШІ-тьютор",
    description: "Твій персональний помічник. Запитуй про все, що не розумієш - він завжди готовий допомогти!",
    position: "left",
  },
]

interface OnboardingTourProps {
  onComplete: () => void
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const target = document.querySelector(tourSteps[currentStep].target)
    if (target) {
      const rect = target.getBoundingClientRect()
      setTargetRect(rect)
      target.classList.add("onboarding-highlight")

      return () => {
        target.classList.remove("onboarding-highlight")
      }
    }
  }, [currentStep])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    localStorage.setItem("onboarding_completed", "true")
    onComplete()
  }

  const handleSkip = () => {
    handleComplete()
  }

  if (!isVisible) return null

  const step = tourSteps[currentStep]
  const progress = ((currentStep + 1) / tourSteps.length) * 100

  const getTooltipPosition = () => {
    if (!targetRect) return {}

    const padding = 16
    const tooltipWidth = 320
    const tooltipHeight = 200

    switch (step.position) {
      case "bottom":
        return {
          top: targetRect.bottom + padding,
          left: Math.max(padding, Math.min(targetRect.left, window.innerWidth - tooltipWidth - padding)),
        }
      case "top":
        return {
          top: targetRect.top - tooltipHeight - padding,
          left: Math.max(padding, Math.min(targetRect.left, window.innerWidth - tooltipWidth - padding)),
        }
      case "left":
        return {
          top: targetRect.top,
          left: targetRect.left - tooltipWidth - padding,
        }
      case "right":
        return {
          top: targetRect.top,
          left: targetRect.right + padding,
        }
      default:
        return {}
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 z-[999]" onClick={handleSkip} />

      {/* Tooltip */}
      <Card className="fixed z-[1001] w-80 border-primary/50 bg-card shadow-2xl" style={getTooltipPosition()}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">
                Крок {currentStep + 1} з {tourSteps.length}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Progress value={progress} className="h-1 mb-4" />

          <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{step.description}</p>

          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handlePrev} disabled={currentStep === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Назад
            </Button>

            <Button size="sm" onClick={handleNext}>
              {currentStep === tourSteps.length - 1 ? "Завершити" : "Далі"}
              {currentStep < tourSteps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
