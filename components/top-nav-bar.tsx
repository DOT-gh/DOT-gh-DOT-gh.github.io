"use client"

import { Battery, WifiOff, Wifi, User, Terminal, Settings, Home, BookOpen, ChevronDown } from "lucide-react"
import { useAppState } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopNavBar() {
  const {
    currentView,
    setCurrentView,
    isOffline,
    setIsOffline,
    batteryLevel,
    setBatteryLevel,
    setShowSettings,
    setShowProfile,
    selectedCourse,
  } = useAppState()

  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-card px-4">
      {/* Left: Logo + Navigation */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            Edu_Survival_Kit <span className="text-muted-foreground">v.0.4</span>{" "}
            <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs text-primary">Beta</span>
          </span>
        </div>

        {/* Navigation buttons */}
        <nav className="ml-4 flex items-center gap-1">
          <Button
            variant={currentView === "dashboard" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setCurrentView("dashboard")}
          >
            <Home className="h-3.5 w-3.5" />
            Головна
          </Button>
          <Button
            variant={currentView === "learning" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => setCurrentView("learning")}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Навчання
            {selectedCourse && <span className="ml-1 text-muted-foreground">/ {selectedCourse.title}</span>}
          </Button>
        </nav>
      </div>

      {/* Right: Status indicators */}
      <div className="flex items-center gap-3">
        {/* Offline toggle */}
        <button
          onClick={() => setIsOffline(!isOffline)}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-secondary"
        >
          {isOffline ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
              </span>
              <WifiOff className="h-3.5 w-3.5 text-destructive" />
              <span className="font-mono text-xs font-medium text-destructive">OFFLINE</span>
            </>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              <Wifi className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-xs font-medium text-primary">ONLINE</span>
            </>
          )}
        </button>

        {/* Battery dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-secondary">
              <Battery className={`h-4 w-4 ${batteryLevel <= 20 ? "text-amber-500" : "text-primary"}`} />
              <span className={`font-mono text-xs ${batteryLevel <= 20 ? "text-amber-500" : "text-muted-foreground"}`}>
                {batteryLevel}%
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setBatteryLevel(15)}>
              <span className="text-amber-500">15%</span> - Критичний
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setBatteryLevel(45)}>
              <span className="text-amber-500">45%</span> - Середній
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setBatteryLevel(80)}>
              <span className="text-primary">80%</span> - Добрий
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setBatteryLevel(100)}>
              <span className="text-primary">100%</span> - Повний
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowSettings(true)}>
          <Settings className="h-4 w-4" />
        </Button>

        {/* User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-2.5 py-1 transition-colors hover:bg-secondary">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-foreground">Д. Турчін</span>
              <span className="text-xs text-muted-foreground">(Група 433)</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setShowProfile(true)}>
              <User className="mr-2 h-4 w-4" />
              Профіль
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowSettings(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Налаштування
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Вийти</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
