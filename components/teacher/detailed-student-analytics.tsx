"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, Target, Zap } from "lucide-react"

interface StudentStats {
  name: string
  tasksCompleted: number
  totalTasks: number
  averageTime: string
  streakDays: number
  accuracy: number
  hintsUsed: number
  lastActive: string
}

export default function DetailedStudentAnalytics({ screenMode }: { screenMode: boolean }) {
  const students: StudentStats[] = [
    {
      name: screenMode ? "██████" : "Коваленко В.",
      tasksCompleted: 28,
      totalTasks: 30,
      averageTime: "12 хв",
      streakDays: 14,
      accuracy: 95,
      hintsUsed: 3,
      lastActive: "21.11, 14:30",
    },
    {
      name: screenMode ? "██████" : "Сидоренко М.",
      tasksCompleted: 22,
      totalTasks: 30,
      averageTime: "18 хв",
      streakDays: 7,
      accuracy: 78,
      hintsUsed: 12,
      lastActive: "20.11, 16:45",
    },
    {
      name: screenMode ? "██████" : "Петренко О.",
      tasksCompleted: 25,
      totalTasks: 30,
      averageTime: "15 хв",
      streakDays: 10,
      accuracy: 88,
      hintsUsed: 7,
      lastActive: "21.11, 11:20",
    },
  ]

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        Детальна аналітика учнів
      </h3>
      <div className="space-y-4">
        {students.map((student) => (
          <div key={student.name} className="p-4 border border-border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{student.name}</h4>
                <p className="text-xs text-muted-foreground">Остання активність: {student.lastActive}</p>
              </div>
              <Badge variant={student.accuracy >= 90 ? "default" : student.accuracy >= 75 ? "secondary" : "outline"}>
                {student.accuracy}% точність
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Прогрес</span>
                <span className="font-medium">
                  {student.tasksCompleted}/{student.totalTasks}
                </span>
              </div>
              <Progress value={(student.tasksCompleted / student.totalTasks) * 100} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Сер. час</p>
                  <p className="font-medium">{student.averageTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Streak</p>
                  <p className="font-medium">{student.streakDays} дн</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Підказок</p>
                  <p className="font-medium">{student.hintsUsed}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
