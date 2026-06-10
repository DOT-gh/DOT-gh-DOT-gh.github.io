"use client"

import { useState } from "react"
import { Check, X, RefreshCw, Trophy, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type Question = {
  question: string
  options: string[]
  correct: number
  explanation: string
}

const QUESTIONS: Question[] = [
  {
    question: "Що виведе console.log(typeof 42)?",
    options: ['"number"', '"int"', '"42"', '"integer"'],
    correct: 0,
    explanation: "У JavaScript усі числа мають тип number — і цілі, і дробові.",
  },
  {
    question: "Скільки разів виконається цикл: for (let i = 0; i < 3; i++)?",
    options: ["2 рази", "3 рази", "4 рази", "Нескінченно"],
    correct: 1,
    explanation: "Цикл працює для i = 0, 1, 2 — тобто рівно 3 ітерації.",
  },
  {
    question: "Який символ використовують для коментаря в JavaScript?",
    options: ["#", "<!-- -->", "//", "**"],
    correct: 2,
    explanation: "Однорядковий коментар у JS починається з //, а багаторядковий — /* */.",
  },
  {
    question: "Що поверне вираз: 5 + '5'?",
    options: ["10", '"55"', "Помилку", "55 (число)"],
    correct: 1,
    explanation: "Число приводиться до рядка, тому відбувається конкатенація: '5' + '5' = '55'.",
  },
]

export function DemoQuiz() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = QUESTIONS[current]

  const handleSelect = (i: number) => {
    if (answered) return
    setSelected(i)
    setAnswered(true)
    if (i === q.correct) setScore((s) => s + 1)
  }

  const next = () => {
    if (current + 1 >= QUESTIONS.length) {
      setFinished(true)
      return
    }
    setCurrent((c) => c + 1)
    setSelected(null)
    setAnswered(false)
  }

  const restart = () => {
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    const pct = Math.round((score / QUESTIONS.length) * 100)
    return (
      <div className="flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Тест завершено!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Ваш результат: <span className="font-semibold text-primary">{score}</span> із{" "}
          {QUESTIONS.length} ({pct}%)
        </p>
        <div className="mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-4 max-w-sm text-sm text-muted-foreground">
          {pct === 100
            ? "Бездоганно! Ви готові до справжніх завдань."
            : pct >= 50
              ? "Гарний результат! Зареєструйтесь, щоб відкрити повний курс."
              : "Початок покладено. На платформі є покрокові уроки для практики."}
        </p>
        <Button onClick={restart} variant="outline" className="mt-5 gap-1.5 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Пройти ще раз
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      {/* Прогресс */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <HelpCircle className="h-4 w-4 text-accent" />
          Питання {current + 1} з {QUESTIONS.length}
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {score} балів
        </span>
      </div>
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${((current + (answered ? 1 : 0)) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <h3 className="mb-4 text-base font-semibold text-foreground text-balance">{q.question}</h3>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct
          const isSelected = i === selected
          let cls =
            "border-border bg-secondary/30 text-foreground hover:border-accent/50 hover:bg-secondary"
          if (answered) {
            if (isCorrect)
              cls = "border-primary/50 bg-primary/10 text-foreground"
            else if (isSelected)
              cls = "border-red-500/50 bg-red-500/10 text-foreground"
            else cls = "border-border bg-secondary/20 text-muted-foreground"
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-all ${cls}`}
            >
              <span className="font-mono">{opt}</span>
              {answered && isCorrect && <Check className="h-4 w-4 text-primary" />}
              {answered && isSelected && !isCorrect && <X className="h-4 w-4 text-red-400" />}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="mt-4 rounded-lg border border-accent/20 bg-accent/5 p-3 text-sm text-muted-foreground">
          <span className="font-medium text-accent">Пояснення: </span>
          {q.explanation}
        </div>
      )}

      {answered && (
        <Button onClick={next} className="mt-4 w-full">
          {current + 1 >= QUESTIONS.length ? "Подивитись результат" : "Наступне питання"}
        </Button>
      )}
    </div>
  )
}
