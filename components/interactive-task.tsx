"use client"

import { useState, useMemo } from "react"
import { useAppState } from "@/lib/store"
import type { Task } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { dataLayer } from "@/lib/data-layer"
import {
  Check,
  X,
  GripVertical,
  ArrowUp,
  ArrowDown,
  BookOpen,
  CheckCircle2,
  Upload,
  FileCheck,
  Link2,
  RotateCcw,
} from "lucide-react"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function InteractiveTask() {
  const { selectedTask, selectedCourse, completeTask } = useAppState()

  if (!selectedTask) {
    return (
      <main className="flex flex-1 items-center justify-center bg-background p-6">
        <p className="text-sm text-muted-foreground">Оберіть завдання зі списку зліва</p>
      </main>
    )
  }

  const xp = selectedTask.xpReward ?? 100

  const finish = () => {
    if (selectedCourse && selectedTask && !selectedTask.completed) {
      completeTask(selectedCourse.id, selectedTask.id)
      void dataLayer.saveProgress({
        courseId: selectedCourse.id,
        taskId: selectedTask.id,
        completed: true,
        xpEarned: xp,
      })
      toast({
        variant: "success",
        title: "Завдання виконано!",
        description: `Ви отримали +${xp} XP`,
      })
    } else {
      toast({ variant: "success", title: "Завдання вже виконано" })
    }
  }

  return (
    <main className="flex flex-1 flex-col overflow-auto bg-background">
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:py-10">
        <div className="mb-6">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary">{selectedCourse?.title}</p>
          <h1 className="text-2xl font-bold text-foreground text-balance">{selectedTask.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{selectedTask.description}</p>
        </div>

        {selectedTask.type === "quiz" && <QuizTask task={selectedTask} onSolved={finish} />}
        {selectedTask.type === "truefalse" && <TrueFalseTask task={selectedTask} onSolved={finish} />}
        {selectedTask.type === "dragdrop" && <DragDropTask task={selectedTask} onSolved={finish} />}
        {selectedTask.type === "matching" && <MatchingTask task={selectedTask} onSolved={finish} />}
        {selectedTask.type === "info" && <InfoTask task={selectedTask} onSolved={finish} />}
        {selectedTask.type === "fileupload" && <FileUploadTask task={selectedTask} onSolved={finish} />}
      </div>
    </main>
  )
}

/* ---------------- QUIZ ---------------- */
function QuizTask({ task, onSolved }: { task: Task; onSolved: () => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const options = task.options ?? []
  const isCorrect = selected !== null && options[selected]?.correct

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{task.question ?? task.content}</CardTitle>
        <CardDescription>Оберіть правильну відповідь</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((opt, i) => {
          const showState = submitted && (i === selected || opt.correct)
          return (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                selected === i && !submitted && "border-primary bg-primary/10",
                !showState && selected !== i && "border-border hover:border-primary/50 hover:bg-secondary/50",
                showState && opt.correct && "border-primary bg-primary/15 text-foreground",
                showState && !opt.correct && i === selected && "border-destructive bg-destructive/15 text-foreground",
              )}
            >
              <span>{opt.text}</span>
              {showState && opt.correct && <Check className="h-4 w-4 text-primary" />}
              {showState && !opt.correct && i === selected && <X className="h-4 w-4 text-destructive" />}
            </button>
          )
        })}

        <div className="flex gap-3 pt-2">
          {!submitted ? (
            <Button className="flex-1" disabled={selected === null} onClick={() => setSubmitted(true)}>
              Перевірити
            </Button>
          ) : isCorrect ? (
            <Button className="flex-1" onClick={onSolved}>
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Зарахувати завдання
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                setSubmitted(false)
                setSelected(null)
              }}
            >
              <RotateCcw className="mr-1 h-4 w-4" />
              Спробувати ще раз
            </Button>
          )}
        </div>
        {submitted && (
          <p className={cn("text-sm font-medium", isCorrect ? "text-primary" : "text-destructive")}>
            {isCorrect ? "Правильно!" : "Неправильно. Подумай ще раз."}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

/* ---------------- TRUE / FALSE ---------------- */
function TrueFalseTask({ task, onSolved }: { task: Task; onSolved: () => void }) {
  const statements = task.statements ?? []
  const [answers, setAnswers] = useState<Record<number, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = statements.every((_, i) => answers[i] !== undefined)
  const allCorrect = statements.every((s, i) => answers[i] === s.answer)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{task.question ?? "Правда чи неправда?"}</CardTitle>
        <CardDescription>Познач кожне твердження</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {statements.map((s, i) => {
          const correct = submitted && answers[i] === s.answer
          const wrong = submitted && answers[i] !== undefined && answers[i] !== s.answer
          return (
            <div
              key={i}
              className={cn(
                "rounded-lg border p-3",
                correct && "border-primary/60 bg-primary/10",
                wrong && "border-destructive/60 bg-destructive/10",
                !submitted && "border-border",
              )}
            >
              <p className="mb-2 text-sm text-foreground">{s.text}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={answers[i] === true ? "default" : "outline"}
                  className={answers[i] === true ? "" : "bg-transparent"}
                  disabled={submitted}
                  onClick={() => setAnswers((p) => ({ ...p, [i]: true }))}
                >
                  Правда
                </Button>
                <Button
                  size="sm"
                  variant={answers[i] === false ? "default" : "outline"}
                  className={answers[i] === false ? "" : "bg-transparent"}
                  disabled={submitted}
                  onClick={() => setAnswers((p) => ({ ...p, [i]: false }))}
                >
                  Неправда
                </Button>
              </div>
            </div>
          )
        })}

        <div className="flex gap-3 pt-1">
          {!submitted ? (
            <Button className="flex-1" disabled={!allAnswered} onClick={() => setSubmitted(true)}>
              Перевірити
            </Button>
          ) : allCorrect ? (
            <Button className="flex-1" onClick={onSolved}>
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Зарахувати завдання
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                setSubmitted(false)
                setAnswers({})
              }}
            >
              <RotateCcw className="mr-1 h-4 w-4" />
              Спробувати ще раз
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- DRAG / REORDER BLOCKS ---------------- */
function DragDropTask({ task, onSolved }: { task: Task; onSolved: () => void }) {
  const correctOrder = task.blocks ?? []
  const [order, setOrder] = useState<string[]>(() => {
    let s = shuffle(correctOrder)
    // гарантуємо що не випадково правильний
    if (correctOrder.length > 1 && s.join("|") === correctOrder.join("|")) s = shuffle(correctOrder)
    return s
  })
  const [submitted, setSubmitted] = useState(false)
  const isCorrect = order.join("|") === correctOrder.join("|")

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= order.length) return
    const next = [...order]
    ;[next[i], next[j]] = [next[j], next[i]]
    setOrder(next)
    setSubmitted(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{task.question ?? "Склади алгоритм у правильному порядку"}</CardTitle>
        <CardDescription>Переставляй блоки стрілками, доки порядок не стане правильним</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {order.map((block, i) => (
            <div
              key={block}
              className={cn(
                "flex items-center gap-2 rounded-lg border bg-secondary/40 px-3 py-2.5 font-mono text-sm",
                submitted && isCorrect && "border-primary/60 bg-primary/10",
              )}
            >
              <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 text-foreground">{block}</span>
              <div className="flex shrink-0 gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={i === 0} onClick={() => move(i, -1)}>
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  disabled={i === order.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-1">
          {!submitted || !isCorrect ? (
            <Button className="flex-1" onClick={() => setSubmitted(true)}>
              Перевірити порядок
            </Button>
          ) : (
            <Button className="flex-1" onClick={onSolved}>
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Зарахувати завдання
            </Button>
          )}
        </div>
        {submitted && (
          <p className={cn("text-sm font-medium", isCorrect ? "text-primary" : "text-destructive")}>
            {isCorrect ? "Порядок правильний!" : "Поки не так. Спробуй переставити блоки."}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

/* ---------------- MATCHING PAIRS ---------------- */
function MatchingTask({ task, onSolved }: { task: Task; onSolved: () => void }) {
  const pairs = task.pairs ?? []
  const rights = useMemo(() => shuffle(pairs.map((p, i) => ({ i, text: p.right }))), [pairs])
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [matches, setMatches] = useState<Record<number, number>>({}) // leftIndex -> rightOriginalIndex
  const allMatched = pairs.length > 0 && Object.keys(matches).length === pairs.length

  const pickRight = (rightOrigIndex: number) => {
    if (selectedLeft === null) return
    setMatches((p) => {
      const next = { ...p }
      // прибрати попереднє призначення цього right
      for (const k of Object.keys(next)) {
        if (next[Number(k)] === rightOrigIndex) delete next[Number(k)]
      }
      next[selectedLeft] = rightOrigIndex
      return next
    })
    setSelectedLeft(null)
  }

  const correctCount = Object.entries(matches).filter(([l, r]) => Number(l) === r).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{task.question ?? "Зістав пари"}</CardTitle>
        <CardDescription>Обери термін зліва, потім його визначення справа</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            {pairs.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelectedLeft(i)}
                className={cn(
                  "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                  selectedLeft === i && "border-primary bg-primary/10",
                  matches[i] !== undefined && "border-primary/40 bg-secondary/40",
                  selectedLeft !== i && matches[i] === undefined && "border-border hover:border-primary/50",
                )}
              >
                <span className="text-foreground">{p.left}</span>
                {matches[i] !== undefined && (
                  <span className="mt-1 block text-xs text-muted-foreground">→ {pairs[matches[i]].right}</span>
                )}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {rights.map((r) => {
              const used = Object.values(matches).includes(r.i)
              return (
                <button
                  key={r.i}
                  onClick={() => pickRight(r.i)}
                  disabled={selectedLeft === null}
                  className={cn(
                    "w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:opacity-50",
                    used ? "border-primary/30 bg-secondary/30 text-muted-foreground" : "border-border hover:border-primary/50",
                  )}
                >
                  {r.text}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3">
          {allMatched && correctCount === pairs.length ? (
            <Button className="flex-1" onClick={onSolved}>
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Зарахувати завдання
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              disabled={!allMatched}
              onClick={() => {
                if (correctCount !== pairs.length) {
                  toast({ variant: "destructive", title: `Правильних пар: ${correctCount}/${pairs.length}` })
                  setMatches({})
                }
              }}
            >
              <Link2 className="mr-1 h-4 w-4" />
              {allMatched ? "Перевірити пари" : `Зіставлено ${Object.keys(matches).length}/${pairs.length}`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/* ---------------- INFO BLOCK ---------------- */
function InfoTask({ task, onSolved }: { task: Task; onSolved: () => void }) {
  const [read, setRead] = useState(false)
  const body = task.infoBody ?? task.content
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Теорія</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm leading-relaxed text-foreground/90">
          {body.split("\n\n").map((para, i) => (
            <p key={i} className="text-pretty">
              {para}
            </p>
          ))}
        </div>
        {!read ? (
          <Button className="w-full" onClick={() => setRead(true)}>
            Я прочитав(ла)
          </Button>
        ) : (
          <Button className="w-full" onClick={onSolved}>
            <CheckCircle2 className="mr-1 h-4 w-4" />
            Зрозуміло, далі
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

/* ---------------- FILE UPLOAD ---------------- */
function FileUploadTask({ task, onSolved }: { task: Task; onSolved: () => void }) {
  const [fileName, setFileName] = useState<string | null>(null)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{task.question ?? "Завантаж свою роботу"}</CardTitle>
        <CardDescription>{task.uploadPrompt ?? task.content}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-10 text-center transition-colors",
            fileName ? "border-primary/60 bg-primary/5" : "border-border hover:border-primary/50",
          )}
        >
          {fileName ? (
            <>
              <FileCheck className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-foreground">{fileName}</span>
              <span className="text-xs text-muted-foreground">Файл прикріплено</span>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-foreground">Натисни, щоб обрати файл</span>
              <span className="text-xs text-muted-foreground">{task.acceptedFormats ?? "Будь-який формат"}</span>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept={task.acceptedFormats}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) setFileName(f.name)
            }}
          />
        </label>

        <Button className="w-full" disabled={!fileName} onClick={onSolved}>
          <CheckCircle2 className="mr-1 h-4 w-4" />
          Здати роботу
        </Button>
      </CardContent>
    </Card>
  )
}
