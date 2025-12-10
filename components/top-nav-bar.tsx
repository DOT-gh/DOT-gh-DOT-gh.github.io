"use client"

import {
  WifiOff,
  Wifi,
  User,
  Terminal,
  Settings,
  Home,
  BookOpen,
  ChevronDown,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
} from "lucide-react"
import { useAppState } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

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

  const [isAutoDetected, setIsAutoDetected] = useState(false)

  useEffect(() => {
    const detectBattery = async () => {
      try {
        // @ts-expect-error - Battery API is not in TypeScript types
        const battery = await navigator.getBattery?.()
        if (battery) {
          const updateBattery = () => {
            const level = Math.round(battery.level * 100)
            setBatteryLevel(level)
            setIsAutoDetected(true)
          }
          updateBattery()
          battery.addEventListener("levelchange", updateBattery)
          return () => battery.removeEventListener("levelchange", updateBattery)
        }
      } catch {
        // Battery API not supported
      }
    }
    detectBattery()
  }, [setBatteryLevel])

  // Get battery icon based on level
  const getBatteryIcon = () => {
    if (batteryLevel <= 20) return <BatteryLow className="h-4 w-4 text-destructive" />
    if (batteryLevel <= 50) return <BatteryMedium className="h-4 w-4 text-amber-500" />
    return <BatteryFull className="h-4 w-4 text-primary" />
  }

  const getBatteryColor = () => {
    if (batteryLevel <= 20) return "text-destructive"
    if (batteryLevel <= 50) return "text-amber-500"
    return "text-primary"
  }

  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-card px-2 sm:px-4">
      {/* Left: Logo + Navigation */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-5 w-5 text-primary" />
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            <span className="hidden sm:inline">Edu_Survival_Kit</span>
            <span className="sm:hidden">ESK</span>
            <span className="hidden sm:inline text-muted-foreground"> v.0.4</span>{" "}
            <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs text-primary">Beta</span>
          </span>
        </div>

        {/* Navigation buttons */}
        <nav className="ml-2 sm:ml-4 flex items-center gap-1">
          <Button
            variant={currentView === "dashboard" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 gap-1.5 text-xs px-2 sm:px-3"
            onClick={() => setCurrentView("dashboard")}
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Головна</span>
          </Button>
          <Button
            variant={currentView === "learning" ? "secondary" : "ghost"}
            size="sm"
            className="h-8 gap-1.5 text-xs px-2 sm:px-3"
            onClick={() => setCurrentView("learning")}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Навчання</span>
            {selectedCourse && (
              <span className="hidden lg:inline ml-1 text-muted-foreground">/ {selectedCourse.title}</span>
            )}
          </Button>
        </nav>
      </div>

      {/* Right: Status indicators */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Offline toggle */}
        <button
          onClick={() => setIsOffline(!isOffline)}
          className="flex items-center gap-1 sm:gap-1.5 rounded-md px-1.5 sm:px-2 py-1 transition-colors hover:bg-secondary"
        >
          {isOffline ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
              </span>
              <WifiOff className="h-3.5 w-3.5 text-destructive" />
              <span className="hidden sm:inline font-mono text-xs font-medium text-destructive">OFFLINE</span>
            </>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              <Wifi className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline font-mono text-xs font-medium text-primary">ONLINE</span>
            </>
          )}
        </button>

        {/* Battery dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 rounded-md px-1.5 sm:px-2 py-1 transition-colors hover:bg-secondary">
              {getBatteryIcon()}
              <span className={`font-mono text-xs ${getBatteryColor()}`}>{batteryLevel}%</span>
              {!isAutoDetected && <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:inline" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {isAutoDetected && (
              <>
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  Автовизначено з пристрою
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={() => {
                setBatteryLevel(15)
                setIsAutoDetected(false)
              }}
            >
              <BatteryLow className="mr-2 h-4 w-4 text-destructive" />
              <span className="text-destructive">15%</span>
              <span className="ml-2 text-muted-foreground">- Критичний</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setBatteryLevel(45)
                setIsAutoDetected(false)
              }}
            >
              <BatteryMedium className="mr-2 h-4 w-4 text-amber-500" />
              <span className="text-amber-500">45%</span>
              <span className="ml-2 text-muted-foreground">- Середній</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setBatteryLevel(80)
                setIsAutoDetected(false)
              }}
            >
              <BatteryFull className="mr-2 h-4 w-4 text-primary" />
              <span className="text-primary">80%</span>
              <span className="ml-2 text-muted-foreground">- Добрий</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setBatteryLevel(100)
                setIsAutoDetected(false)
              }}
            >
              <BatteryFull className="mr-2 h-4 w-4 text-primary" />
              <span className="text-primary">100%</span>
              <span className="ml-2 text-muted-foreground">- Повний</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowSettings(true)}>
          <Settings className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 sm:gap-2 rounded-md border border-border bg-secondary/50 px-1.5 sm:px-2.5 py-1 transition-colors hover:bg-secondary">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground hidden sm:inline">Гість</span>
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
