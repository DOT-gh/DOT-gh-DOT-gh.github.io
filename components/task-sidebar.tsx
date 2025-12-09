"use client"

import { Check, Lock, AlertTriangle, Database, BookOpen, ChevronLeft, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppState } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"

export function TaskSidebar() {
  const { tasks, currentTask, setCurrentTask, setCode, setCurrentView, selectedCourse } = useAppState()
  const [collapsed, setCollapsed] = useState(false)

  const handleTaskClick = (task: (typeof tasks)[0]) => {
    if (task.status === "locked") return
    setCurrentTask(task)
    setCode(task.code)
  }

  if (collapsed) {
    return (
      <aside className="flex w-12 flex-col border-r border-border bg-sidebar">
        <Button variant="ghost" size="icon" className="m-2 h-8 w-8" onClick={() => setCollapsed(false)}>
          <BookOpen className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex flex-col items-center gap-1 p-2">
          {tasks.map((task) => (
            <TooltipProvider key={task.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleTaskClick(task)}
                    disabled={task.status === "locked"}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                      task.id === currentTask?.id && "bg-primary/20 text-primary",
                      task.status === "completed" &&
                        task.id !== currentTask?.id &&
                        "text-primary/70 hover:bg-sidebar-accent",
                      task.status === "in-progress" &&
                        task.id !== currentTask?.id &&
                        "text-amber-500 hover:bg-sidebar-accent",
                      task.status === "locked" && "cursor-not-allowed text-muted-foreground opacity-50",
                    )}
                  >
                    {task.status === "completed" && <Check className="h-4 w-4" />}
                    {task.status === "in-progress" && <AlertTriangle className="h-4 w-4" />}
                    {task.status === "locked" && <Lock className="h-3.5 w-3.5" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-medium">
                    {task.id}. {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {task.status === "locked" ? "Заблоковано" : task.description}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </aside>
    )
  }

  return (
    <aside className="flex w-64 flex-col border-r border-border bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-sidebar-foreground">Лабораторні роботи</h2>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCollapsed(true)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Course info */}
      {selectedCourse && (
        <div className="border-b border-sidebar-border px-4 py-2">
          <p className="text-xs text-muted-foreground">Курс</p>
          <p className="text-sm font-medium text-sidebar-foreground">{selectedCourse.title}</p>
        </div>
      )}

      {/* Task list */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {tasks.map((task) => (
            <li key={task.id}>
              <button
                onClick={() => handleTaskClick(task)}
                disabled={task.status === "locked"}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                  task.id === currentTask?.id && "bg-primary/20 text-primary ring-1 ring-primary/30",
                  task.status === "in-progress" &&
                    task.id !== currentTask?.id &&
                    "text-amber-500 hover:bg-sidebar-accent",
                  task.status === "completed" &&
                    task.id !== currentTask?.id &&
                    "text-sidebar-foreground hover:bg-sidebar-accent",
                  task.status === "locked" && "cursor-not-allowed text-muted-foreground opacity-60",
                )}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {task.status === "completed" && <Check className="h-4 w-4 text-primary" />}
                  {task.status === "in-progress" && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  {task.status === "locked" && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-xs block">
                    {task.id}. {task.title}
                  </span>
                  {task.id === currentTask?.id && (
                    <span className="text-[10px] text-muted-foreground truncate block mt-0.5">{task.description}</span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Current task info */}
      {currentTask && (
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-start gap-2 rounded-lg bg-secondary/50 p-2">
            <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-medium text-foreground">Поточне завдання</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{currentTask.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Storage indicator */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Database className="h-3.5 w-3.5" />
          <span className="font-mono">Local Storage: 4.2 MB</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-[42%] rounded-full bg-primary/70" />
        </div>
      </div>

      {/* Back to dashboard */}
      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-xs"
          onClick={() => setCurrentView("dashboard")}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Повернутися до курсів
        </Button>
      </div>
    </aside>
  )
}
