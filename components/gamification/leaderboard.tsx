"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"

interface LeaderboardEntry {
  id: string
  name: string
  xp: number
  level: number
  rank: number
}

const mockLeaderboard: LeaderboardEntry[] = [
  { id: "1", name: "Олександр С.", xp: 3450, level: 4, rank: 1 },
  { id: "2", name: "Марія К.", xp: 3200, level: 4, rank: 2 },
  { id: "3", name: "Іван П.", xp: 2980, level: 3, rank: 3 },
  { id: "4", name: "Анна Л.", xp: 2750, level: 3, rank: 4 },
  { id: "5", name: "Дмитро В.", xp: 2500, level: 3, rank: 5 },
  { id: "6", name: "Софія М.", xp: 2100, level: 2, rank: 6 },
  { id: "7", name: "Максим Г.", xp: 1850, level: 2, rank: 7 },
  { id: "8", name: "Катерина Р.", xp: 1600, level: 2, rank: 8 },
]

export function Leaderboard() {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-amber-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-zinc-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
  }

  return (
    <div className="space-y-2">
      {mockLeaderboard.map((entry) => (
        <Card
          key={entry.id}
          className="border-border transition-colors hover:border-primary/50 hover:bg-accent/5 cursor-pointer"
        >
          <div className="flex items-center gap-3 p-3">
            <div className="flex h-8 w-8 items-center justify-center">{getRankIcon(entry.rank)}</div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{entry.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{entry.name}</p>
              <p className="text-xs text-muted-foreground">Рівень {entry.level}</p>
            </div>
            <Badge variant="secondary" className="font-mono text-xs">
              {entry.xp} XP
            </Badge>
          </div>
        </Card>
      ))}
    </div>
  )
}
