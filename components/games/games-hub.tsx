"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { MazeGame } from "@/components/games/maze-game"
import { BinaryGame } from "@/components/games/binary-game"
import { MemoryGame } from "@/components/games/memory-game"
import { Binary, Gamepad2, Grid3x3, Layers, Play } from "lucide-react"

type GameId = "maze" | "binary" | "memory"

const GAMES: {
  id: GameId
  title: string
  description: string
  icon: React.ReactNode
  reward: string
}[] = [
  {
    id: "maze",
    title: "Лабіринт кодера",
    description: "Проведи біт від старту до прапорця. 3 рівні складності, керування стрілками.",
    icon: <Grid3x3 className="h-6 w-6" />,
    reward: "до 125 XP",
  },
  {
    id: "binary",
    title: "Бінарний вибух",
    description: "Переводь числа у двійкову систему на швидкість. 60 секунд на максимум очок.",
    icon: <Binary className="h-6 w-6" />,
    reward: "10 XP за очко",
  },
  {
    id: "memory",
    title: "Пам'ять програміста",
    description: "Знайди всі пари термінів інформатики за мінімум ходів.",
    icon: <Layers className="h-6 w-6" />,
    reward: "до 120 XP",
  },
]

export function GamesHub() {
  const [openGame, setOpenGame] = useState<GameId | null>(null)
  const gameStats = useAppStore((s) => s.gameStats)

  const bestLine: Record<GameId, string | null> = {
    maze:
      gameStats.mazeLevelsCompleted.length > 0
        ? `Пройдено рівнів: ${gameStats.mazeLevelsCompleted.length}/3`
        : null,
    binary: gameStats.binaryBestScore > 0 ? `Рекорд: ${gameStats.binaryBestScore} очок` : null,
    memory: gameStats.memoryBestMoves !== null ? `Рекорд: ${gameStats.memoryBestMoves} ходів` : null,
  }

  const activeGame = GAMES.find((g) => g.id === openGame)

  return (
    <section aria-labelledby="games-heading">
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <h3 id="games-heading" className="flex items-center gap-2 text-base sm:text-lg font-semibold text-foreground">
          <Gamepad2 className="h-5 w-5 text-primary" />
          Ігрова зона
        </h3>
        {gameStats.totalGamesPlayed > 0 && (
          <span className="font-mono text-xs text-muted-foreground">
            Зіграно ігор: {gameStats.totalGamesPlayed}
          </span>
        )}
      </div>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <Card key={game.id} className="border-border bg-card transition-colors hover:border-accent/50 flex flex-col">
            <CardHeader className="pb-2 sm:pb-3">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  {game.icon}
                </div>
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-accent">
                  {game.reward}
                </span>
              </div>
              <CardTitle className="mt-2 sm:mt-3 text-sm sm:text-base">{game.title}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{game.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end gap-2">
              {bestLine[game.id] && (
                <p className="font-mono text-xs text-primary">{bestLine[game.id]}</p>
              )}
              <Button size="sm" className="w-full gap-2" onClick={() => setOpenGame(game.id)}>
                <Play className="h-4 w-4" />
                Грати
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={openGame !== null} onOpenChange={(open) => !open && setOpenGame(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeGame?.icon}
              {activeGame?.title}
            </DialogTitle>
          </DialogHeader>
          {openGame === "maze" && <MazeGame />}
          {openGame === "binary" && <BinaryGame />}
          {openGame === "memory" && <MemoryGame />}
        </DialogContent>
      </Dialog>
    </section>
  )
}
