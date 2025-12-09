"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/store"
import { CheckCircle2, Circle } from "lucide-react"

export function TaskSidebar() {
  const { tasks, selectedTask, selectedCourse, setSelectedTask } = useApp()
  
  const courseTasks = tasks.filter(t => t.courseId === selectedCourse?.id)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="w-80 border-r bg-card hidden lg:flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Завдання</h2>
        <p className="text-sm text-muted-foreground">
          {selectedCourse?.title}
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {courseTasks.map((task) => (
            <Button
              key={task.id}
              variant={selectedTask?.id === task.id ? "secondary" : "ghost"}
              className="w-full justify-start h-auto py-3 px-3"
              onClick={() => setSelectedTask(task)}
            >
              <div className="flex items-start gap-3 w-full">
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                
                <div className="flex-1 text-left space-y-1">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {task.description}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="outline" 
                      className={`${getDifficultyColor(task.difficulty)} text-white border-0 text-xs`}
                    >
                      {task.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {task.points} pts
                    </span>
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
