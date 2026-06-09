"use client"

import { useState } from "react"
import { Check, Play, Save, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import type { DemoCourse, DemoTask } from "./demo-types"

type DemoLearningProps = {
  course: DemoCourse
  onBack: () => void
  onCompleteTask: (taskId: string) => void
}

export function DemoLearning({ course, onBack, onCompleteTask }: DemoLearningProps) {
  const [selectedTask, setSelectedTask] = useState<DemoTask>(course.tasks[0])
  const [code, setCode] = useState(course.tasks[0]?.content ?? "")
  const [output, setOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const handleSelectTask = (task: DemoTask) => {
    setSelectedTask(task)
    setCode(task.content)
    setOutput([])
  }

  const handleRun = () => {
    setIsRunning(true)
    setTimeout(() => {
      const hasSyntaxError = code.includes("SyntaxError") || (code.includes("if ") && !code.includes(":"))

      if (hasSyntaxError) {
        setOutput([">>> Помилка синтаксису", ">>> Перевірте код"])
        toast({ variant: "destructive", title: "Помилка", description: "Виправте код і спробуйте знову" })
      } else {
        setOutput([">>> Демо-режим: код виконано локально", ">>> Прогрес зберігається лише в цій сесії"])
        if (!selectedTask.completed) {
          onCompleteTask(selectedTask.id)
          toast({ variant: "success", title: "Завдання виконано!", description: "Демо-прогрес збережено локально" })
        }
      }
      setIsRunning(false)
    }, 800)
  }

  const handleSave = () => {
    try {
      sessionStorage.setItem(`demo-code-${selectedTask.id}`, code)
      setOutput((prev) => [...prev, "", "[Локально] Код збережено в сесії"])
      toast({ title: "Збережено", description: "Код збережено локально (без хмари)" })
    } catch {
      toast({ variant: "destructive", title: "Помилка збереження" })
    }
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0 hidden md:flex">
        <div className="p-3 border-b border-border">
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-1" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
            До курсів
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">{course.title}</p>
        </div>
        <div className="flex-1 overflow-auto p-2 space-y-1">
          {course.tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => handleSelectTask(task)}
              className={cn(
                "w-full text-left rounded-md px-3 py-2 text-sm transition-colors",
                selectedTask.id === task.id
                  ? "bg-primary/15 text-primary"
                  : "hover:bg-secondary text-foreground",
              )}
            >
              <div className="flex items-center gap-2">
                {task.completed ? (
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                ) : (
                  <span className="h-3.5 w-3.5 rounded-full border border-muted-foreground shrink-0" />
                )}
                <span className="truncate">{task.title}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-border px-4 py-2 bg-card">
          <h2 className="text-sm font-medium">{selectedTask.title}</h2>
          <p className="text-xs text-muted-foreground">{selectedTask.description}</p>
        </div>

        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
          <div className="flex-1 flex flex-col min-h-0">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 resize-none bg-background p-4 font-mono text-sm text-foreground outline-none"
              spellCheck={false}
            />
            <div className="flex gap-2 border-t border-border p-2 bg-card">
              <Button size="sm" className="gap-1.5" onClick={handleRun} disabled={isRunning}>
                <Play className="h-3.5 w-3.5" />
                {isRunning ? "Виконання..." : "Запустити"}
              </Button>
              <Button size="sm" variant="secondary" className="gap-1.5" onClick={handleSave}>
                <Save className="h-3.5 w-3.5" />
                Зберегти
              </Button>
            </div>
          </div>

          <Card className="w-full lg:w-80 rounded-none border-0 border-t lg:border-t-0 lg:border-l border-border shrink-0">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Консоль</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap min-h-[120px]">
                {output.length ? output.join("\n") : ">>> Натисніть «Запустити»"}
              </pre>
              {selectedTask.hint && (
                <p className="mt-3 text-xs text-primary/80 border-t border-border pt-3">
                  Підказка: {selectedTask.hint}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
