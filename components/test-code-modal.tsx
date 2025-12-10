"use client"

import type React from "react"

import { useState } from "react"
import { X, Lock, ShieldCheck, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface TestCodeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TestCodeModal({ isOpen, onClose }: TestCodeModalProps) {
  const [code, setCode] = useState("")
  const [error, setError] = useState(false)
  const [attempts, setAttempts] = useState(0)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAttempts((prev) => prev + 1)
    setError(true)
    setCode("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg border border-border bg-card p-6">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <Lock className="h-8 w-8 text-amber-500" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Доступ до тестування</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Введіть код доступу, який надав викладач, для проходження тестів
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Код доступу</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setError(false)
              }}
              className={`font-mono text-center text-lg tracking-widest ${error ? "border-destructive" : ""}`}
            />
            {error && (
              <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span>Невірний код доступу</span>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full gap-2">
            <ShieldCheck className="h-4 w-4" />
            Підтвердити код
          </Button>

          {attempts >= 3 && (
            <p className="text-center text-xs text-muted-foreground">
              Забагато спроб. Зверніться до викладача за новим кодом.
            </p>
          )}
        </form>

        <div className="mt-6 rounded-lg bg-secondary/50 p-3">
          <p className="text-center text-xs text-muted-foreground">
            Тести доступні лише під час контрольних занять.
            <br />
            Код генерується автоматично на початку заняття.
          </p>
        </div>
      </div>
    </div>
  )
}
