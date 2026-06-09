'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { DemoNavBar } from "@/components/demo/demo-nav-bar"
import { DemoShowcase } from "@/components/demo/demo-showcase"
import { DemoCoursesPaywall } from "@/components/demo/demo-courses-paywall"
import { DemoGoalSetter } from "@/components/demo/demo-goal-setter"
import { signInWithGoogle } from "@/lib/auth/google-login"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350)
    return () => clearTimeout(timer)
  }, [])

  const handleLogin = async () => {
    setIsLoginLoading(true)
    const { error } = await signInWithGoogle("/dashboard")
    if (error) setIsLoginLoading(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Завантаження вітрини...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Декоративные элементы */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <DemoNavBar onLogin={handleLogin} isLoginLoading={isLoginLoading} />

      <main className="relative z-10 flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
          <div className="mb-8 sm:mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              Гостьовий режим
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-foreground text-balance">
              Ласкаво просимо, <span className="text-primary">Гість</span>!
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-muted-foreground">
              Ознайомтесь з можливостями платформи. Повний доступ — після безкоштовної реєстрації.
            </p>
          </div>

          {/* Наша новая "память" приложения */}
          <div className="mx-auto max-w-xl">
             <DemoGoalSetter />
          </div>

          <DemoShowcase />
          <DemoCoursesPaywall onLogin={handleLogin} isLoginLoading={isLoginLoading} />
        </div>
      </main>

      <footer className="relative z-10 border-t border-border bg-card/80 px-4 py-3 text-center backdrop-blur-sm">
        <p className="text-xs text-muted-foreground">
          Демо-режим · без синхронізації з хмарою ·{" "}
          <Button variant="link" className="h-auto p-0 text-xs" asChild>
            <Link href="/">На головну</Link>
          </Button>
        </p>
      </footer>
    </div>
  )
}