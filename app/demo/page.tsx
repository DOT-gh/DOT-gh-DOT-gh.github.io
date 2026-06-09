"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { DemoNavBar } from "@/components/demo/demo-nav-bar"
import { DemoDashboard } from "@/components/demo/demo-dashboard"
import { DemoLearning } from "@/components/demo/demo-learning"
import { initialDemoCourses } from "@/components/demo/demo-data"
import type { DemoCourse } from "@/components/demo/demo-types"
import { signInWithGoogle } from "@/lib/auth/google-login"
import { Button } from "@/components/ui/button"

const DEMO_STORAGE_KEY = "edu-demo-progress"

function loadDemoCourses(): DemoCourse[] {
  if (typeof window === "undefined") return initialDemoCourses

  try {
    const saved = sessionStorage.getItem(DEMO_STORAGE_KEY)
    if (saved) return JSON.parse(saved) as DemoCourse[]
  } catch {
    /* ignore */
  }
  return initialDemoCourses
}

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<"dashboard" | "learning">("dashboard")
  const [courses, setCourses] = useState<DemoCourse[]>(initialDemoCourses)
  const [selectedCourse, setSelectedCourse] = useState<DemoCourse | null>(null)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  useEffect(() => {
    setCourses(loadDemoCourses())
    const timer = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const persistCourses = useCallback((next: DemoCourse[]) => {
    setCourses(next)
    try {
      sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }, [])

  const handleStartCourse = (course: DemoCourse) => {
    setSelectedCourse(course)
    setCurrentView("learning")
  }

  const handleCompleteTask = (taskId: string) => {
    if (!selectedCourse) return

    const updated = courses.map((course) => {
      if (course.id !== selectedCourse.id) return course

      const tasks = course.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task,
      )
      const completedTasks = tasks.filter((t) => t.completed).length

      return {
        ...course,
        tasks,
        completedTasks,
        progress: Math.round((completedTasks / course.totalTasks) * 100),
      }
    })

    persistCourses(updated)
    const fresh = updated.find((c) => c.id === selectedCourse.id) ?? null
    setSelectedCourse(fresh)
  }

  const handleLogin = async () => {
    setIsLoginLoading(true)
    const { error } = await signInWithGoogle("/dashboard")
    if (error) {
      setIsLoginLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Завантаження демо...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <DemoNavBar
        currentView={currentView}
        onGoDashboard={() => setCurrentView("dashboard")}
        onGoLearning={() => selectedCourse && setCurrentView("learning")}
        selectedCourse={selectedCourse}
        onLogin={handleLogin}
        isLoginLoading={isLoginLoading}
      />

      {currentView === "dashboard" && (
        <DemoDashboard
          courses={courses}
          onStartCourse={handleStartCourse}
          onLogin={handleLogin}
          isLoginLoading={isLoginLoading}
        />
      )}

      {currentView === "learning" && selectedCourse && (
        <DemoLearning
          course={selectedCourse}
          onBack={() => setCurrentView("dashboard")}
          onCompleteTask={handleCompleteTask}
        />
      )}

      <div className="border-t border-border bg-card px-4 py-2 text-center">
        <p className="text-xs text-muted-foreground">
          Демо-режим · прогрес не синхронізується з хмарою ·{" "}
          <Button variant="link" className="h-auto p-0 text-xs" asChild>
            <Link href="/">На головну</Link>
          </Button>
        </p>
      </div>
    </div>
  )
}
