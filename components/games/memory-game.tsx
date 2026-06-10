"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { RotateCcw, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

// Пари: термін інформатики + його позначення
const PAIRS = [
  ["HTML", "HTML"],
  ["CSS", "CSS"],
  ["if/else", "if/else"],
  ["for", "for"],
  ["print()", "print()"],
  ["RAM", "RAM"],
  ["SQL", "SQL"],
  ["bit", "bit"],
] as const

interface CardState {
  id: number
  label: string
  flipped: boolean
  matched: boolean
}

function buildDeck(): CardState[] {
  const labels = PAIRS.flatMap(([a]) => [a, a])
  return labels
    .map((label, i) => ({ id: i, label, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5)
}

export function MemoryGame() {
  const recordGameResult = useAppStore((s) => s.recordGameResult)
  const bestMoves = useAppStore((s) => s.gameStats.memoryBestMoves)

  const [deck, setDeck] = useState<CardState[]>([])
  const [openIds, setOpenIds] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [won, setWon] = useState(false)
  const [locked, setLocked] = useState(false)

  const reset = useCallback(() => {
    setDeck(buildDeck())
    setOpenIds([])
    setMoves(0)
    setWon(false)
    setLocked(false)
  }, [])

  useEffect(() => {
    reset()
  }, [reset])

  const flip = (id: number) => {
    if (locked || won) return
    const card = deck.find((c) => c.id === id)
    if (!card || card.flipped || card.matched) return

    const newOpen = [...openIds, id]
    setDeck((d) => d.map((c) => (c.id === id ? { ...c, flipped: true } : c)))
    setOpenIds(newOpen)

    if (newOpen.length === 2) {
      setMoves((m) => m + 1)
      setLocked(true)
      const [a, b] = newOpen.map((oid) => deck.find((c) => c.id === oid)!)
      const first = deck.find((c) => c.id === newOpen[0])!
      const second = { ...card }
      const isMatch = first.label === second.label

      setTimeout(() => {
        setDeck((d) => {
          const next = d.map((c) =>
            newOpen.includes(c.id)
              ? isMatch
                ? { ...c, matched: true, flipped: true }
                : { ...c, flipped: false }
              : c,
          )
          if (isMatch && next.every((c) => c.matched)) {
            setWon(true)
            setMoves((m) => {
              recordGameResult({ game: "memory", moves: m })
              return m
            })
          }
          return next
        })
        setOpenIds([])
        setLocked(false)
      }, 650)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4 text-sm">
        <span className="font-mono text-muted-foreground">
          Ходи: <span className="text-foreground">{moves}</span>
        </span>
        {bestMoves !== null && (
          <span className="font-mono text-muted-foreground">
            Рекорд: <span className="text-primary">{bestMoves}</span>
          </span>
        )}
      </div>

      <div className="relative grid grid-cols-4 gap-2">
        {deck.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => flip(card.id)}
            aria-label={card.flipped || card.matched ? card.label : "Закрита картка"}
            className={cn(
              "flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-lg border font-mono text-xs sm:text-sm font-bold transition-all",
              card.matched
                ? "border-primary/50 bg-primary/15 text-primary"
                : card.flipped
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border bg-secondary hover:border-primary/40 text-transparent",
            )}
          >
            {card.flipped || card.matched ? card.label : "?"}
          </button>
        ))}

        {won && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg bg-background/90 backdrop-blur-sm">
            <Trophy className="h-10 w-10 text-amber-500" />
            <p className="text-lg font-bold text-foreground">Перемога за {moves} ходів!</p>
            <p className="text-sm text-primary">+{Math.max(120 - moves * 2, 40)} XP</p>
            <Button size="sm" onClick={reset} className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" />
              Грати ще
            </Button>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">Знайди всі пари термінів інформатики</p>
    </div>
  )
}
