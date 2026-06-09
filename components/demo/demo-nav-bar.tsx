"use client"

import Link from "next/link"
import { Terminal, User, Wifi, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

type DemoNavBarProps = {
  onLogin: () => void
  isLoginLoading: boolean
}

export function DemoNavBar({ onLogin, isLoginLoading }: DemoNavBarProps) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-card px-2 sm:px-4 sticky top-0 z-50">
      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
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
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-primary">
          <Wifi className="h-3.5 w-3.5" />
          <span className="font-mono">SHOWCASE</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2 py-1">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Гість</span>
        </div>

        <Button size="sm" onClick={onLogin} disabled={isLoginLoading}>
          {isLoginLoading ? "..." : "Увійти"}
        </Button>
      </div>
    </header>
  )
}
