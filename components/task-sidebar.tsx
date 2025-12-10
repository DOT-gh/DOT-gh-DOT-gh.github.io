"use client"

import { Check, Circle, Database, BookOpen, ChevronLeft, Info, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppState, type Task } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"

export function TaskSidebar() {
  const { selectedCourse, selectedTask, setSelectedTask, setCurrentView, setCode } = useAppState()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const safeTasks = selectedCourse?.tasks || []

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setCode(task.content)
    setMobileOpen(false)
  }

  const getTaskStatus = (task: Task, index: number) => {
    if (task.completed) return "completed"
    // First incomplete task is available, rest are locked
    const firstIncompleteIndex = safeTasks.findIndex((t) => !t.completed)
    if (index === firstIncompleteIndex) return "available"
    if (index < firstIncompleteIndex || firstIncompleteIndex === -1) return "completed"
    return "available" // All tasks available for demo
  }

  const MobileToggle = () => (
    <div className="lg:hidden flex items-center justify-between border-b border-border bg-card px-4 py-2">
      <Button variant="ghost" size="sm" className="gap-2" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        <span className="text-xs">Завдання</span>
      </Button>
      {selectedTask && (
        <span className="text-xs text-muted-foreground truncate max-w-[200px]">{selectedTask.title}</span>
      )}
    </div>
  )

  if (collapsed) {
    return (
      <>
        <MobileToggle />
        <aside className="hidden lg:flex w-12 flex-col border-r border-border bg-sidebar">
          <Button variant="ghost" size="icon" className="m-2 h-8 w-8" onClick={() => setCollapsed(false)}>
            <BookOpen className="h-4 w-4" />
          </Button>
          <div className="flex-1 flex flex-col items-center gap-1 p-2">
            {safeTasks.map((task, index) => {
              const status = getTaskStatus(task, index)
              return (
                <TooltipProvider key={task.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleTaskClick(task)}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                          task.id === selectedTask?.id && "bg-primary/20 text-primary",
                          status === "completed" &&
                            task.id !== selectedTask?.id &&
                            "text-primary/70 hover:bg-sidebar-accent",
                          status === "available" &&
                            task.id !== selectedTask?.id &&
                            "text-muted-foreground hover:bg-sidebar-accent",
                        )}
                      >
                        {status === "completed" ? <Check className="h-4 w-4" /> : <Circle className="h-3.5 w-3.5" />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        </aside>
      </>
    )
  }

  const SidebarContent = () => (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-sidebar",
        "hidden lg:flex lg:w-64",
        mobileOpen && "fixed inset-0 z-50 flex w-full sm:w-80 lg:relative lg:w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-sidebar-foreground">Завдання</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden" onClick={() => setMobileOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 hidden lg:flex" onClick={() => setCollapsed(true)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
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
          {safeTasks.map((task, index) => {
            const status = getTaskStatus(task, index)
            return (
              <li key={task.id}>
                <button
                  onClick={() => handleTaskClick(task)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                    task.id === selectedTask?.id && "bg-primary/20 text-primary ring-1 ring-primary/30",
                    status === "available" &&
                      task.id !== selectedTask?.id &&
                      "text-sidebar-foreground hover:bg-sidebar-accent",
                    status === "completed" &&
                      task.id !== selectedTask?.id &&
                      "text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                    {status === "completed" ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-xs block">{task.title}</span>
                    {task.id === selectedTask?.id && (
                      <span className="text-[10px] text-muted-foreground truncate block mt-0.5">
                        {task.description}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Current task info */}
      {selectedTask && (
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-start gap-2 rounded-lg bg-secondary/50 p-2">
            <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-medium text-foreground">Поточне завдання</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{selectedTask.description}</p>
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
          onClick={() => {
            setCurrentView("dashboard")
            setMobileOpen(false)
          }}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Повернутися до курсів
        </Button>
      </div>
    </aside>
  )

  return (
    <>
      <MobileToggle />
      <SidebarContent />
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />}
    </>
  )
}
