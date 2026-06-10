"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Binary, Play, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

const ROUND_SECONDS = 60

function toBinary(n: number): string {
  return n.toString(2)
}

export function BinaryGame() {
  const recordGameResult = useAppStore((s) => s.recordGameResult)
  const bestScore = useAppStore((s) => s.gameStats.binaryBestScore)

  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [target, setTarget] = useState(5)
  const [options, setOptions] = useState<string[]>([])
  const [feedback, setFeedback] = useState<"right" | "wrong" | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const nextQuestion = useCallback((currentScore: number) => {
    // Складність росте з рахунком
    const max = currentScore < 5 ? 15 : currentScore < 10 ? 31 : 63
    const n = 1 + Math.floor(Math.random() * max)
    const correct = toBinary(n)
    const opts = new Set<string>([correct])
    while (opts.size < 4) {
      const off = 1 + Math.floor(Math.random() * max)
      opts.add(toBinary(off))
    }
    setTarget(n)
    setOptions([...opts].sort(() => Math.random() - 0.5))
  }, [])

  const start = useCallback(() => {
    setScore(0)
    setTimeLeft(ROUND_SECONDS)
    setPhase("playing")
    setFeedback(null)
    nextQuestion(0)
  }, [nextQuestion])

  useEffect(() => {
    if (phase !== "playing") return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPhase("done")
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase])

  // Записати результат коли гра закінчилась
  const recordedRef = useRef(false)
  useEffect(() => {
    if (phase === "done" && !recordedRef.current) {
      recordedRef.current = true
      recordGameResult({ game: "binary", score })
    }
    if (phase === "playing") recordedRef.current = false
  }, [phase, score, recordGameResult])

  const answer = (opt: string) => {
    if (phase !== "playing") return
    if (opt === toBinary(target)) {
      setScore((s) => {
        const ns = s + 1
        nextQuestion(ns)
        return ns
      })
      setFeedback("right")
    } else {
      setFeedback("wrong")
      setTimeLeft((t) => Math.max(t - 5, 1))
    }
    setTimeout(() => setFeedback(null), 350)
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {phase === "idle" && (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <Binary className="h-12 w-12 text-primary" />
          <div>
            <p className="font-medium text-foreground">Переведи число у двійкову систему!</p>
            <p className="mt-1 text-sm text-muted-foreground">
              60 секунд. Правильна відповідь: +1 очко. Помилка: -5 секунд.
            </p>
            {bestScore > 0 && (
              <p className="mt-2 font-mono text-sm text-primary">Твій рекорд: {bestScore}</p>
            )}
          </div>
          <Button onClick={start} className="gap-2">
            <Play className="h-4 w-4" />
            Почати
          </Button>
        </div>
      )}

      {phase === "playing" && (
        <>
          <div className="flex w-full items-center justify-between text-sm">
            <span className="font-mono text-foreground">
              Очки: <span className="text-primary">{score}</span>
            </span>
            <span
              className={cn(
                "flex items-center gap-1.5 font-mono",
                timeLeft <= 10 ? "text-destructive" : "text-muted-foreground",
              )}
            >
              <Timer className="h-4 w-4" />
              {timeLeft}с
            </span>
          </div>

          <div
            className={cn(
              "flex h-24 w-full items-center justify-center rounded-lg border text-5xl font-bold font-mono transition-colors",
              feedback === "right" && "border-primary bg-primary/10 text-primary",
              feedback === "wrong" && "border-destructive bg-destructive/10 text-destructive",
              !feedback && "border-border bg-secondary/30 text-foreground",
            )}
          >
            {target}
          </div>

          <div className="grid w-full grid-cols-2 gap-2">
            {options.map((opt) => (
              <Button
                key={opt}
                variant="outline"
                className="h-12 font-mono text-base bg-transparent"
                onClick={() => answer(opt)}
              >
                {opt}
              </Button>
            ))}
          </div>
        </>
      )}

      {phase === "done" && (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="text-4xl font-bold text-primary">{score}</p>
          <div>
            <p className="font-medium text-foreground">
              {score >= 10 ? "Неймовірно! Двійковий мозок!" : score >= 5 ? "Гарний результат!" : "Непогано для початку!"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">+{score * 10} XP зараховано</p>
          </div>
          <Button onClick={start} className="gap-2">
            <Play className="h-4 w-4" />
            Грати ще
          </Button>
        </div>
      )}
    </div>
  )
}
