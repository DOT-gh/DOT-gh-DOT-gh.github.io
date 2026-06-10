"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppState } from "@/lib/store"
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Flag, RotateCcw, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

const MAZES: { name: string; grid: string[] }[] = [
  {
    name: "Рівень 1: Новачок",
    grid: ["1111111", "1S10001", "1010101", "1010101", "1010101", "10001F1", "1111111"],
  },
  {
    name: "Рівень 2: Кодер",
    grid: [
      "111111111",
      "1S1000101",
      "101010101",
      "101010001",
      "101011101",
      "100010001",
      "111110111",
      "1000000F1",
      "111111111",
    ],
  },
  {
    name: "Рівень 3: Хакер",
    grid: [
      "1111111111111",
      "1S10000000101",
      "1010111110101",
      "1010001010001",
      "1011101011101",
      "1010001000001",
      "1010111011111",
      "1000101010001",
      "1111101011101",
      "1000001000101",
      "1011111110101",
      "10000000000F1",
      "1111111111111",
    ],
  },
]

type Pos = { y: number; x: number }

function findCell(grid: string[], char: string): Pos {
  for (let y = 0; y < grid.length; y++) {
    const x = grid[y].indexOf(char)
    if (x !== -1) return { y, x }
  }
  return { y: 1, x: 1 }
}

export function MazeGame() {
  const recordGameResult = useAppState((s) => s.recordGameResult)
  const mazeLevelsCompleted = useAppState((s) => s.gameStats.mazeLevelsCompleted)
  const mazeBestMoves = useAppState((s) => s.gameStats.mazeBestMoves)

  const [level, setLevel] = useState(0)
  const maze = MAZES[level]
  const start = useMemo(() => findCell(maze.grid, "S"), [maze])
  const finish = useMemo(() => findCell(maze.grid, "F"), [maze])

  const [pos, setPos] = useState<Pos>(start)
  const [moves, setMoves] = useState(0)
  const [trail, setTrail] = useState<Set<string>>(new Set())
  const [won, setWon] = useState(false)

  const reset = useCallback(
    (lvl: number = level) => {
      const s = findCell(MAZES[lvl].grid, "S")
      setPos(s)
      setMoves(0)
      setTrail(new Set([`${s.y},${s.x}`]))
      setWon(false)
    },
    [level],
  )

  useEffect(() => {
    reset(level)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level])

  const tryMove = useCallback(
    (dy: number, dx: number) => {
      if (won) return
      setPos((p) => {
        const ny = p.y + dy
        const nx = p.x + dx
        const row = maze.grid[ny]
        if (!row || row[nx] === "1" || row[nx] === undefined) return p
        setMoves((m) => {
          const newMoves = m + 1
          if (ny === finish.y && nx === finish.x) {
            setWon(true)
            recordGameResult({ game: "maze", level: level + 1, moves: newMoves })
          }
          return newMoves
        })
        setTrail((t) => new Set(t).add(`${ny},${nx}`))
        return { y: ny, x: nx }
      })
    },
    [maze, finish, won, level, recordGameResult],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w") {
        e.preventDefault()
        tryMove(-1, 0)
      } else if (e.key === "ArrowDown" || e.key === "s") {
        e.preventDefault()
        tryMove(1, 0)
      } else if (e.key === "ArrowLeft" || e.key === "a") {
        e.preventDefault()
        tryMove(0, -1)
      } else if (e.key === "ArrowRight" || e.key === "d") {
        e.preventDefault()
        tryMove(0, 1)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [tryMove])

  const cellSize = maze.grid.length > 9 ? "h-5 w-5 sm:h-6 sm:w-6" : "h-7 w-7 sm:h-8 sm:w-8"

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Вибір рівня */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {MAZES.map((m, i) => (
          <Button
            key={m.name}
            size="sm"
            variant={i === level ? "default" : "outline"}
            className="gap-1.5 text-xs"
            onClick={() => setLevel(i)}
          >
            {mazeLevelsCompleted.includes(i + 1) && <Trophy className="h-3 w-3 text-amber-500" />}
            {m.name}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="font-mono text-muted-foreground">
          Ходи: <span className="text-foreground">{moves}</span>
        </span>
        {mazeBestMoves[level + 1] && (
          <span className="font-mono text-muted-foreground">
            Рекорд: <span className="text-primary">{mazeBestMoves[level + 1]}</span>
          </span>
        )}
      </div>

      {/* Поле */}
      <div className="relative rounded-lg border border-border bg-secondary/30 p-2">
        {maze.grid.map((row, y) => (
          <div key={y} className="flex">
            {row.split("").map((cell, x) => {
              const isPlayer = pos.y === y && pos.x === x
              const isFinish = cell === "F"
              const isWall = cell === "1"
              const visited = trail.has(`${y},${x}`)
              return (
                <div
                  key={x}
                  className={cn(
                    cellSize,
                    "flex items-center justify-center",
                    isWall ? "bg-secondary" : "bg-background",
                    visited && !isWall && !isPlayer && "bg-primary/10",
                  )}
                >
                  {isPlayer && (
                    <div className="h-3/5 w-3/5 rounded-full bg-primary shadow-[0_0_8px] shadow-primary" />
                  )}
                  {isFinish && !isPlayer && <Flag className="h-3.5 w-3.5 text-amber-500" />}
                </div>
              )
            })}
          </div>
        ))}

        {won && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg bg-background/90 backdrop-blur-sm">
            <Trophy className="h-10 w-10 text-amber-500" />
            <p className="text-lg font-bold text-foreground">Пройдено за {moves} ходів!</p>
            <p className="text-sm text-primary">+{50 + (level + 1) * 25} XP</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => reset()} className="gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                Ще раз
              </Button>
              {level < MAZES.length - 1 && (
                <Button size="sm" onClick={() => setLevel(level + 1)}>
                  Наступний рівень
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Кнопки керування (мобільні + миша) */}
      <div className="flex flex-col items-center gap-1">
        <Button size="icon" variant="outline" aria-label="Вгору" onClick={() => tryMove(-1, 0)}>
          <ArrowUp className="h-4 w-4" />
        </Button>
        <div className="flex gap-1">
          <Button size="icon" variant="outline" aria-label="Вліво" onClick={() => tryMove(0, -1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" aria-label="Вниз" onClick={() => tryMove(1, 0)}>
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" aria-label="Вправо" onClick={() => tryMove(0, 1)}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Стрілки або WASD на клавіатурі</p>
      </div>
    </div>
  )
}
