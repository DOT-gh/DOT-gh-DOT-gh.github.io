"use client"

import { useParams, useRouter } from "next/navigation"
import { teacherData } from "@/lib/teacher-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Wifi,
  WifiOff,
  Battery,
  Monitor,
  Smartphone,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string

  // Знайти учня
  let student = null
  let className = ""

  for (const cls of teacherData.classes) {
    const found = cls.students.find((s) => s.id === studentId)
    if (found) {
      student = found
      className = cls.name
      break
    }
  }

  if (!student) {
    return <div className="p-8">Учня не знайдено</div>
  }

  const stats = student.detailedStats

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <p className="text-muted-foreground">
              Клас {className} • {student.status === "offline" ? "Офлайн" : "Потрібна допомога"}
            </p>
          </div>
        </div>

        {/* Загальна статистика */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Прогрес</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.progress}%</div>
              <Progress value={student.progress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Виконано завдань</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.completedTasks}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats?.completedTasksPercent}% від усіх</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Середній бал</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{student.avgScore}</div>
              <p className="text-xs text-muted-foreground mt-1">з 12 балів</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Загальний час</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(student.totalTime / 60)}г {student.totalTime % 60}хв
              </div>
              <p className="text-xs text-muted-foreground mt-1">на платформі</p>
            </CardContent>
          </Card>
        </div>

        {/* Детальна інформація */}
        {stats && (
          <>
            {/* Технічна інформація */}
            <Card>
              <CardHeader>
                <CardTitle>Технічна інформація</CardTitle>
                <CardDescription>Дані про підключення та пристрій</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Останній вхід</p>
                    <p className="text-sm text-muted-foreground">{stats.loginTime}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wifi className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">IP адреса</p>
                    <p className="text-sm text-muted-foreground font-mono">{stats.ip}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Battery className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Заряд батареї</p>
                    <p className="text-sm text-muted-foreground">{stats.batteryLevel}%</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {stats.device === "Mobile" ? (
                    <Smartphone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  ) : (
                    <Monitor className="h-5 w-5 text-muted-foreground mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium">Пристрій</p>
                    <p className="text-sm text-muted-foreground">{stats.device}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Метрики роботи */}
            <Card>
              <CardHeader>
                <CardTitle>Метрики ефективності</CardTitle>
                <CardDescription>Аналіз роботи учня на платформі</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-start gap-3">
                  <WifiOff className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Офлайн-виконання</p>
                    <p className="text-2xl font-bold">{stats.offlineSessionsPercent}%</p>
                    <p className="text-xs text-muted-foreground">від усіх сесій</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Завершені завдання</p>
                    <p className="text-2xl font-bold">{stats.completedTasksPercent}%</p>
                    <p className="text-xs text-muted-foreground">успішність</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Час до рішення</p>
                    <p className="text-2xl font-bold">{stats.avgTimeToSolution} хв</p>
                    <p className="text-xs text-muted-foreground">середній</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Запити до AI</p>
                    <p className="text-2xl font-bold">{stats.aiRequestsCount}</p>
                    <p className="text-xs text-muted-foreground">{stats.hintsRequested} підказок</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Історія сесій */}
            <Card>
              <CardHeader>
                <CardTitle>Історія сесій</CardTitle>
                <CardDescription>Останні 10 сесій роботи</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.sessions.slice(0, 10).map((session, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        {session.offline ? (
                          <WifiOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Wifi className="h-4 w-4 text-green-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{session.date}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.tasksCompleted} завдань • {session.duration} хв
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{session.offline ? "Офлайн" : "Онлайн"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Історія завдань */}
            <Card>
              <CardHeader>
                <CardTitle>Історія завдань</CardTitle>
                <CardDescription>Детальна інформація про виконані завдання</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.taskHistory.map((task, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        {task.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{task.taskName}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.date} • {task.timeSpent} хв • {task.attempts} спроб
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Lightbulb className="h-3 w-3" />
                          {task.hintsUsed} підказок
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
