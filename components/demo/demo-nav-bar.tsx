"use client"

import { Terminal, Home, BookOpen, User, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DemoCourse } from "./demo-types"

type DemoNavBarProps = {
  currentView: "dashboard" | "learning"
  onGoDashboard: () => void
  onGoLearning: () => void
  selectedCourse: DemoCourse | null
  onLogin: () => void
  isLoginLoading: boolean
}

export function DemoNavBar({
  currentView,
  onGoDashboard,
  onGoLearning,
  selectedCourse,
  onLogin,
  isLoginLoading,
}: DemoNavBarProps) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-card px-2 sm:px-4">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            <span className="hidden sm:inline">Edu_Survival_Kit</span>
            <span className="sm:hidden">ESK</span>
            <span className="ml-1.5 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-500">
              DEMO
            </span>
          </span>
        </div>

        <nav className="ml-2 sm:ml-4 flex items-center gap-1">
          <Button
            variant={currentView === "dashboard" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 gap-1.5 text-xs px-2 sm:px-3"
            onClick={onGoDashboard}
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Головна</span>
          </Button>
          <Button
            variant={currentView === "learning" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 gap-1.5 text-xs px-2 sm:px-3"
            onClick={onGoLearning}
            disabled={!selectedCourse}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Навчання</span>
            {selectedCourse && (
              <span className="hidden lg:inline ml-1 text-muted-foreground">/ {selectedCourse.title}</span>
            )}
          </Button>
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-primary">
          <Wifi className="h-3.5 w-3.5" />
          <span className="font-mono">DEMO MODE</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2 py-1">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Гість</span>
        </div>

        <Button size="sm" onClick={onLogin} disabled={isLoginLoading}>
          {isLoginLoading ? "Завантаження..." : "Увійти"}
        </Button>
      </div>
    </header>
  )
}
