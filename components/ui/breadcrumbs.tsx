"use client"

import { ChevronRight, Home } from "lucide-react"
import { useAppState } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  onClick?: () => void
  active?: boolean
}

export function Breadcrumbs() {
  const { currentView, selectedCourse, selectedTask, setCurrentView, setSelectedCourse, setSelectedTask } =
    useAppState()

  const items: BreadcrumbItem[] = [
    {
      label: "Головна",
      onClick: () => {
        setCurrentView("dashboard")
        setSelectedCourse(null)
        setSelectedTask(null)
      },
      active: currentView === "dashboard",
    },
  ]

  if (currentView === "learning" && selectedCourse) {
    items.push({
      label: selectedCourse.title,
      onClick: () => {
        setSelectedTask(null)
      },
      active: !selectedTask,
    })

    if (selectedTask) {
      items.push({
        label: selectedTask.title,
        active: true,
      })
    }
  }

  if (items.length <= 1) return null

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground px-4 py-2 bg-card/50 border-b border-border">
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={items[0].onClick}>
        <Home className="h-4 w-4" />
      </Button>

      {items.slice(1).map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4" />
          {item.onClick ? (
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-auto py-0.5 px-1.5 text-sm", item.active && "text-foreground font-medium")}
              onClick={item.onClick}
            >
              {item.label}
            </Button>
          ) : (
            <span className={cn("px-1.5", item.active && "text-foreground font-medium")}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
