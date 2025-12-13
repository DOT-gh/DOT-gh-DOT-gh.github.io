"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Courses grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-5 w-32 mt-3" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-2 w-full mb-3" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function CodeEditorSkeleton() {
  return (
    <div className="flex-1 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
      <div className="border border-border rounded-lg p-4 space-y-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4" style={{ width: `${Math.random() * 60 + 20}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ChatSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[80%] space-y-2 ${i % 2 === 0 ? "items-end" : "items-start"}`}>
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-16 w-64 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

const funnyLoadingMessages = [
  "Готуємо компілятор...",
  "Будимо ШІ-тьютора...",
  "Заварюємо каву для коду...",
  "Шукаємо зниклу крапку з комою...",
  "Перевіряємо синтаксис всесвіту...",
  "Завантажуємо мудрість Python...",
  "Калібруємо нейронні зв'язки...",
  "Оптимізуємо алгоритми навчання...",
]

export function FunnyLoadingMessage() {
  const message = funnyLoadingMessages[Math.floor(Math.random() * funnyLoadingMessages.length)]

  return (
    <div className="loading-message">
      <div className="loading-spinner" />
      <span>{message}</span>
    </div>
  )
}
