"use client"

import { useState } from "react"
import {
  ClipboardCheck,
  MessageSquareText,
  Terminal,
  Trophy,
  Sparkles,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function DemoShowcase() {
  const [quizChecks, setQuizChecks] = useState({ a: true, b: false, c: false })
  const [quizAnswer, setQuizAnswer] = useState("b")
  const [xp] = useState(340)

  return (
    <section className="mb-10 sm:mb-14">
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <Badge variant="outline" className="mb-3 border-primary/30 text-primary">
          <Sparkles className="mr-1 h-3 w-3" />
          Вітрина можливостей
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Спробуйте, як працює платформа
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
          Інтерактивні завдання, тренажери, гейміфікація та офлайн-режим — все в одному місці
        </p>
      </div>

      <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
        {/* Card 1: Interactive tests */}
        <Card className="group border-border/60 bg-card/80 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 transition-transform group-hover:scale-110">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <Badge className="bg-blue-500/15 text-blue-400 hover:bg-blue-500/15">Тести</Badge>
            </div>
            <CardTitle className="text-base sm:text-lg">Інтерактивні тести</CardTitle>
            <CardDescription>Миттєва перевірка знань з підказками</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Оберіть правильні твердження:</p>
            <div className="space-y-2.5 rounded-lg border border-border/50 bg-secondary/20 p-3">
              {[
                { id: "a" as const, label: "Python — мова програмування" },
                { id: "b" as const, label: "HTML — мова програмування" },
                { id: "c" as const, label: "Офлайн-режим зберігає прогрес" },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2.5 text-sm cursor-pointer hover:text-foreground text-muted-foreground transition-colors"
                >
                  <Checkbox
                    checked={quizChecks[item.id]}
                    onCheckedChange={(checked) =>
                      setQuizChecks((prev) => ({ ...prev, [item.id]: checked === true }))
                    }
                  />
                  {item.label}
                </label>
              ))}
            </div>
            <p className="text-xs font-medium text-muted-foreground pt-1">Один правильний варіант:</p>
            <RadioGroup value={quizAnswer} onValueChange={setQuizAnswer} className="gap-2 rounded-lg border border-border/50 bg-secondary/20 p-3">
              {[
                { id: "a", label: "print()" },
                { id: "b", label: "echo()" },
                { id: "c", label: "console.log()" },
              ].map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <RadioGroupItem value={opt.id} id={`quiz-${opt.id}`} />
                  <Label htmlFor={`quiz-${opt.id}`} className="text-sm font-normal cursor-pointer">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Card 2: Open answers */}
        <Card className="group border-border/60 bg-card/80 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400 transition-transform group-hover:scale-110">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <Badge className="bg-violet-500/15 text-violet-400 hover:bg-violet-500/15">Відповіді</Badge>
            </div>
            <CardTitle className="text-base sm:text-lg">Відкриті відповіді</CardTitle>
            <CardDescription>Розгорнуті відповіді з перевіркою вчителем або ШІ</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-xs text-muted-foreground">
              Поясніть, навіщо потрібні змінні в програмуванні:
            </p>
            <div className="relative">
              <Textarea
                readOnly
                disabled
                placeholder="Ваша відповідь з'явиться тут після реєстрації..."
                className="min-h-[120px] resize-none bg-secondary/30 text-muted-foreground cursor-not-allowed opacity-80"
                value=""
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-md bg-background/40 backdrop-blur-[1px]">
                <Badge variant="secondary" className="gap-1 shadow-sm">
                  🔒 Доступно після входу
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Code trainer */}
        <Card className="group border-border/60 bg-card/80 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary transition-transform group-hover:scale-110">
                <Terminal className="h-5 w-5" />
              </div>
              <Badge className="bg-primary/15 text-primary hover:bg-primary/15">Код</Badge>
            </div>
            <CardTitle className="text-base sm:text-lg">Тренажер коду</CardTitle>
            <CardDescription>Редактор з підсвіткою та миттєвим запуском</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border bg-[#0d0d0d] font-mono text-xs shadow-inner">
              <div className="flex items-center gap-1.5 border-b border-border/50 px-3 py-2 bg-secondary/20">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-[10px] text-muted-foreground">main.py</span>
              </div>
              <div className="space-y-0.5 p-3 text-[11px] sm:text-xs leading-relaxed">
                <p>
                  <span className="text-violet-400">def</span>{" "}
                  <span className="text-sky-400">greet</span>
                  <span className="text-foreground">(name):</span>
                </p>
                <p className="pl-4">
                  <span className="text-violet-400">return</span>{" "}
                  <span className="text-emerald-400">f&quot;Привіт, {"{name}"}!&quot;</span>
                </p>
                <p className="pt-2 text-muted-foreground"># ▶ Запуск...</p>
                <p className="text-emerald-400 animate-pulse">{">>> Привіт, студент!"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Gamification */}
        <Card className="group border-border/60 bg-card/80 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 transition-transform group-hover:scale-110">
                <Trophy className="h-5 w-5" />
              </div>
              <Badge className="bg-amber-500/15 text-amber-400 hover:bg-amber-500/15">XP</Badge>
            </div>
            <CardTitle className="text-base sm:text-lg">Гейміфікація</CardTitle>
            <CardDescription>Рівні, бейджі та щоденні виклики</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-muted-foreground">Рівень 2</span>
                <span className="font-mono text-primary">{xp} / 500 XP</span>
              </div>
              <Progress value={(xp / 500) * 100} className="h-2" />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { emoji: "🎯", label: "Перший крок", unlocked: true },
                { emoji: "🔥", label: "7 днів", unlocked: true },
                { emoji: "⭐", label: "Майстер", unlocked: false },
                { emoji: "🏆", label: "Чемпіон", unlocked: false },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs border transition-all",
                    badge.unlocked
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-secondary/30 text-muted-foreground opacity-50 grayscale",
                  )}
                >
                  <span>{badge.emoji}</span>
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
