"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">Сторінка не знайдена</h2>
          <p className="text-muted-foreground">Схоже, ця сторінка пішла на перерву. Можливо вона в укритті?</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              На головну
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>
        </div>

        <div className="pt-8 text-sm text-muted-foreground">
          <p>Підказка: спробуйте натиснути Ctrl+K для швидкої навігації</p>
        </div>
      </div>
    </div>
  )
}
