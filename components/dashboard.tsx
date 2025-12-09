"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/store"
import { BookOpen, Code, Trophy } from "lucide-react"

export function Dashboard() {
  const { courses, tasks, setSelectedCourse, setSelectedTask, userProfile } = useApp()

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Привіт, {userProfile.name}! 👋</h2>
          <p className="text-muted-foreground">
            Готовий продовжити навчання? Вибери курс або завдання.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Загальний прогрес</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userProfile.points} pts</div>
              <p className="text-xs text-muted-foreground">Рівень {userProfile.level}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активні курси</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
              <p className="text-xs text-muted-foreground">Доступно для вивчення</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Виконані завдання</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter(t => t.completed).length}/{tasks.length}
              </div>
              <p className="text-xs text-muted-foreground">Завершено</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Мої курси</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <div className={`h-32 bg-gradient-to-br ${course.color}`} />
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Прогрес</span>
                      <span className="font-semibold">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      setSelectedCourse(course)
                      const courseTask = tasks.find(t => t.courseId === course.id && !t.completed)
                      if (courseTask) setSelectedTask(courseTask)
                    }}
                  >
                    Продовжити навчання
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
