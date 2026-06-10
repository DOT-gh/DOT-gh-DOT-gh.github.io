"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DemoNavBar } from "@/components/demo/demo-nav-bar"
import { DemoShowcase } from "@/components/demo/demo-showcase"
import { DemoCoursesPaywall } from "@/components/demo/demo-courses-paywall"
import { DemoGoalSetter } from "@/components/demo/demo-goal-setter"
import { DemoTour } from "@/components/demo/demo-tour"
import { DemoLiveStats } from "@/components/demo/demo-live-stats"
import { DemoCodePlayground } from "@/components/demo/demo-code-playground"
import { DemoQuiz } from "@/components/demo/demo-quiz"
import { DemoFlashcards } from "@/components/demo/demo-flashcards"
import { signInWithGoogle } from "@/lib/auth/google-login"
import { Button } from "@/components/ui/button"
import { Sparkles, Play, HelpCircle, Layers } from "lucide-react"

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  desc,
}: {
  icon: typeof Play
  eyebrow: string
  title: string
  desc: string
}) {
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
        <Icon className="h-4 w-4" />
        {eyebrow}
      </div>
      <h2 className="text-xl font-bold text-foreground sm:text-2xl text-balance">{title}</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground text-pretty">{desc}</p>
    </div>
  )
}

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
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Декоративні елементи */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <DemoNavBar onLogin={handleLogin} isLoginLoading={isLoginLoading} />

      <main className="relative z-10 flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
          {/* Hero */}
          <div className="mb-8 text-center sm:mb-10">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              Гостьовий режим
            </div>
            <h1 className="text-2xl font-bold text-foreground text-balance sm:text-4xl">
              Ласкаво просимо, <span className="text-primary">Гість</span>!
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base text-pretty">
              Це не просто опис — спробуйте все прямо тут. Пишіть код, проходьте тести й гортайте
              картки. Повний доступ — після безкоштовної реєстрації.
            </p>
          </div>

          {/* Живая статистика платформы */}
          <section className="mb-10">
            <DemoLiveStats />
          </section>

          {/* Тур + цель в две колонки */}
          <section className="mb-10 grid gap-4 lg:grid-cols-2">
            <DemoTour />
            <DemoGoalSetter />
          </section>

          {/* Песочница кода */}
          <section className="mb-10">
            <SectionHeader
              icon={Play}
              eyebrow="Спробуйте самі"
              title="Пишіть і запускайте код прямо тут"
              desc="Справжній редактор з виконанням у браузері. Оберіть приклад або напишіть свій код і натисніть «Запустити»."
            />
            <DemoCodePlayground />
          </section>

          {/* Квиз */}
          <section className="mb-10">
            <SectionHeader
              icon={HelpCircle}
              eyebrow="Перевірте знання"
              title="Інтерактивний міні-тест"
              desc="Чотири питання з миттєвою перевіркою та поясненнями. Так виглядають завдання на платформі."
            />
            <div className="mx-auto max-w-2xl">
              <DemoQuiz />
            </div>
          </section>

          {/* Флеш-карточки */}
          <section className="mb-10">
            <SectionHeader
              icon={Layers}
              eyebrow="Вчіть терміни"
              title="Картки понять — натисни, щоб перевернути"
              desc="Швидке повторення ключових термінів програмування. На платформі картки генеруються під ваш курс."
            />
            <DemoFlashcards />
          </section>

          {/* Витрина возможностей */}
          <DemoShowcase />

          {/* Курсы / paywall */}
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