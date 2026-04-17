"use client"

import { useAppState } from "@/lib/store"
import {
  X,
  User,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  Check,
  Star,
  Zap,
  Target,
  BookOpen,
  Code,
  Trophy,
  Flame,
  Clock,
  Heart,
  Shield,
  Rocket,
  Brain,
  Sparkles,
  Crown,
  Medal,
  Key,
  Info,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"

type Achievement = {
  id: number
  icon: any
  name: string
  description: string
  howTo: string
  unlocked: boolean
}

const baseAchievements: Omit<Achievement, "unlocked">[] = [
  { id: 1, icon: Award, name: "Перший крок", description: "Почав свій шлях у програмуванні", howTo: "Виконай перше завдання на платформі" },
  { id: 2, icon: TrendingUp, name: "7 днів поспіль", description: "Тиждень безперервного навчання", howTo: "Заходь на платформу 7 днів підряд" },
  { id: 3, icon: Star, name: "Без помилок", description: "Ідеальне виконання", howTo: "Виконай завдання з першої спроби без помилок" },
  { id: 4, icon: Zap, name: "Швидкий старт", description: "Блискавичне виконання", howTo: "Виконай завдання швидше за 2 хвилини" },
  { id: 5, icon: Target, name: "Снайпер", description: "Точність понад усе", howTo: "Пройди 10 завдань без жодної помилки" },
  { id: 6, icon: BookOpen, name: "Книжковий черв'як", description: "Теорія — твій друг", howTo: "Прочитай усі теоретичні матеріали одного курсу" },
  { id: 7, icon: Code, name: "Кодер", description: "Сотні рядків коду", howTo: "Напиши у редакторі понад 500 рядків коду" },
  { id: 8, icon: Trophy, name: "Чемпіон", description: "Завершив цілий курс", howTo: "Пройди один курс на 100%" },
  { id: 9, icon: Flame, name: "У вогні", description: "Серія успіхів", howTo: "Виконай 5 завдань підряд без помилок" },
  { id: 10, icon: Clock, name: "Ранній птах", description: "Практика зранку", howTo: "Виконай завдання до 8:00 ранку" },
  { id: 11, icon: Heart, name: "Відданий", description: "Ти з нами надовго", howTo: "Використовуй платформу понад 30 днів" },
  { id: 12, icon: Shield, name: "Захисник", description: "Офлайн-воїн", howTo: "Вчись офлайн під час блекауту 3 рази" },
  { id: 13, icon: Rocket, name: "Ракета", description: "Стрімкий прогрес", howTo: "Виконай 10 завдань за один день" },
  { id: 14, icon: Brain, name: "Геній", description: "Майстер логіки", howTo: "Вирішуй складні завдання без AI-підказок" },
  { id: 15, icon: Sparkles, name: "Майстер", description: "Справжня майстерність", howTo: "Отримай середній бал 9+ за всі завдання" },
  { id: 16, icon: Crown, name: "Король", description: "Топ класу", howTo: "Увійди в топ-3 свого класу за прогресом" },
  { id: 17, icon: Medal, name: "Медаліст", description: "Визнання зусиль", howTo: "Отримай 10 інших досягнень" },
  { id: 18, icon: Star, name: "Зірка", description: "Легенда платформи", howTo: "Отримай усі інші 17 досягнень" },
]

// Які медалі отримує "Дмитро" у демо-режимі
const DMYTRO_UNLOCKED_IDS = [1, 3, 4, 7, 9, 13]

// Демо-статистика "Дмитра"
const DMYTRO_STATS = {
  completed: 16,
  total: 24,
  registeredAt: "03.04.2025",
  daysActive: 9,
  currentStreak: 4,
  totalTime: "7г 42хв",
  avgScore: 8.6,
}

export function ProfileModal() {
  const { setShowProfile, courses, setUserRole } = useAppState()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [saved, setSaved] = useState(false)
  const [teacherCode, setTeacherCode] = useState("")
  const [codeError, setCodeError] = useState(false)
  const [googleAvatar, setGoogleAvatar] = useState<string | null>(null)
  const [registeredAt, setRegisteredAt] = useState<string>("Сьогодні")
  const [showAchievements, setShowAchievements] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  // Режим "Дмитро" — заповнюємо демо-дані, якщо ім'я === "Дмитро"
  const isDmytroMode = name.trim().toLowerCase() === "дмитро"

  const achievements = useMemo<Achievement[]>(
    () =>
      baseAchievements.map((a) => ({
        ...a,
        unlocked: isDmytroMode && DMYTRO_UNLOCKED_IDS.includes(a.id),
      })),
    [isDmytroMode],
  )

  const unlockedCount = achievements.filter((a) => a.unlocked).length

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const meta = data.user.user_metadata
        const googleName = meta?.full_name || meta?.name || ""
        const googleEmail = data.user.email || ""
        const avatar = meta?.avatar_url || meta?.picture || null
        const createdAt = data.user.created_at
          ? new Date(data.user.created_at).toLocaleDateString("uk-UA")
          : "Сьогодні"

        setGoogleAvatar(avatar)
        setRegisteredAt(createdAt)

        const savedProfile = localStorage.getItem("edu_profile")
        if (savedProfile) {
          try {
            const stored = JSON.parse(savedProfile)
            setName(stored.name || googleName)
            setEmail(stored.email || googleEmail)
          } catch {
            setName(googleName)
            setEmail(googleEmail)
          }
        } else {
          setName(googleName)
          setEmail(googleEmail)
        }
      } else {
        const savedProfile = localStorage.getItem("edu_profile")
        if (savedProfile) {
          try {
            const data = JSON.parse(savedProfile)
            setName(data.name || "")
            setEmail(data.email || "")
          } catch {
            /* ignore */
          }
        }
      }
    })
  }, [])

  const handleSave = () => {
    localStorage.setItem("edu_profile", JSON.stringify({ name, email }))
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setShowProfile(false)
    }, 1000)
  }

  const handleTeacherAccess = () => {
    if (teacherCode === "Teacher443" || teacherCode === "Teacher123") {
      setUserRole("teacher")
      localStorage.setItem("edu_teacher_access", "true")
      localStorage.setItem("edu_teacher_code", teacherCode)
      localStorage.setItem("teacherAccessCode", teacherCode)
      setShowProfile(false)
      window.location.href = `/teacher?code=${teacherCode}`
    } else {
      setCodeError(true)
      setTimeout(() => setCodeError(false), 2000)
    }
  }

  // Справжні дані з courses, плюс демо-оверрайд для "Дмитра"
  const realCompleted = courses.reduce((acc, c) => acc + c.completedTasks, 0)
  const realTotal = courses.reduce((acc, c) => acc + c.totalTasks, 0)

  const totalCompleted = isDmytroMode ? DMYTRO_STATS.completed : realCompleted
  const totalTasks = isDmytroMode ? DMYTRO_STATS.total : realTotal || 24
  const progressPercent = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0

  const displayRegisteredAt = isDmytroMode ? DMYTRO_STATS.registeredAt : registeredAt

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-auto rounded-lg border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sticky top-0 bg-card z-10">
          <h2 className="text-lg font-semibold text-foreground">Профіль студента</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowProfile(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Avatar and name */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/20 overflow-hidden">
              {googleAvatar ? (
                <img src={googleAvatar || "/placeholder.svg"} alt="avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Input
                placeholder="Введіть ваше ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg font-semibold mb-1 bg-secondary/30"
              />
            </div>
          </div>

          {/* Demo mode indicator */}
          {isDmytroMode && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <p className="text-xs text-primary">Демо-профіль активовано · статистика заповнена</p>
            </div>
          )}

          {/* Info cards */}
          <div className="mb-6 grid gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-7 text-sm bg-transparent border-0 p-0 focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Зареєстрований</p>
                <p className="text-sm text-foreground">{displayRegisteredAt}</p>
              </div>
            </div>
          </div>

          {/* Demo stats grid — shown only for Дмитро */}
          {isDmytroMode && (
            <div className="mb-6 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                <Flame className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                <p className="text-lg font-bold">{DMYTRO_STATS.currentStreak}</p>
                <p className="text-[11px] text-muted-foreground">Днів підряд</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                <Clock className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold">{DMYTRO_STATS.totalTime}</p>
                <p className="text-[11px] text-muted-foreground">Загальний час</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto mb-1" />
                <p className="text-lg font-bold">{DMYTRO_STATS.daysActive}</p>
                <p className="text-[11px] text-muted-foreground">Активних днів</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 p-3 text-center">
                <TrendingUp className="h-4 w-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold">{DMYTRO_STATS.avgScore}</p>
                <p className="text-[11px] text-muted-foreground">Середній бал</p>
              </div>
            </div>
          )}

          {/* Teacher code input */}
          <div className="mb-6 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-medium text-primary">Доступ для вчителя</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Введіть код доступу щоб перейти до панелі вчителя</p>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Код доступу"
                value={teacherCode}
                onChange={(e) => setTeacherCode(e.target.value)}
                className={`flex-1 ${codeError ? "border-red-500" : ""}`}
              />
              <Button onClick={handleTeacherAccess} variant="default" className="shrink-0">
                Увійти
              </Button>
            </div>
            {codeError && <p className="text-xs text-red-500 mt-2">Невірний код доступу</p>}
          </div>

          {/* Achievements — collapsible + clickable */}
          <div className="mb-6">
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className="w-full flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2.5 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Досягнення</span>
                <span className="text-xs text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
                  {unlockedCount}/{achievements.length}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{showAchievements ? "Сховати" : "Показати"}</span>
            </button>
            {showAchievements && (
              <div className="mt-2 space-y-2">
                <p className="text-[11px] text-muted-foreground italic px-1">Натисни на медаль щоб дізнатися як її отримати</p>
                <div className="flex flex-wrap gap-2 p-3 border border-border rounded-lg bg-secondary/10">
                  {achievements.map((achievement) => (
                    <button
                      key={achievement.id}
                      onClick={() => setSelectedAchievement(achievement)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-all hover:scale-105 cursor-pointer ${
                        achievement.unlocked
                          ? "bg-primary/20 text-primary hover:bg-primary/30"
                          : "bg-secondary/50 text-muted-foreground/60 hover:bg-secondary"
                      }`}
                    >
                      <achievement.icon className="h-3.5 w-3.5" />
                      <span className="text-xs">{achievement.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Progress */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-muted-foreground">Загальний прогрес</h4>
            <div className="rounded-lg border border-border bg-secondary/30 p-3">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Виконано завдань</span>
                <span className="font-mono text-foreground">
                  {totalCompleted} / {totalTasks}
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-3 sticky bottom-0 bg-card">
          <Button className="w-full gap-2" onClick={handleSave} variant={saved ? "secondary" : "default"}>
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Збережено!
              </>
            ) : (
              "Зберегти профіль"
            )}
          </Button>
        </div>
      </div>

      {/* Achievement details modal */}
      {selectedAchievement && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedAchievement(null)}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-border bg-card shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                  selectedAchievement.unlocked ? "bg-primary/20" : "bg-secondary"
                }`}
              >
                <selectedAchievement.icon
                  className={`h-7 w-7 ${selectedAchievement.unlocked ? "text-primary" : "text-muted-foreground/50"}`}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setSelectedAchievement(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">{selectedAchievement.name}</h3>
                {selectedAchievement.unlocked && (
                  <span className="text-[10px] font-medium uppercase tracking-wide bg-primary/20 text-primary rounded px-1.5 py-0.5">
                    Отримано
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{selectedAchievement.description}</p>
            </div>

            <div className="rounded-lg border border-border bg-secondary/30 p-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">Як отримати:</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedAchievement.howTo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
