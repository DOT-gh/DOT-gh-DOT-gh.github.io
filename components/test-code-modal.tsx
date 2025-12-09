"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import { useApp } from "@/lib/store"

interface TestCodeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  code: string
}

export function TestCodeModal({ open, onOpenChange, code }: TestCodeModalProps) {
  const { selectedTask, updateTaskCompletion, userProfile, updateUserProfile } = useApp()
  
  // Симуляція тестів (в реальності тут був би sandboxed runner)
  const tests = [
    { id: 1, name: 'Тест 1: Базова функціональність', passed: true },
    { id: 2, name: 'Тест 2: Граничні значення', passed: true },
    { id: 3, name: 'Тест 3: Обробка помилок', passed: Math.random() > 0.3 },
  ]

  const allPassed = tests.every(t => t.passed)

  const handleComplete = () => {
    if (selectedTask && allPassed) {
      updateTaskCompletion(selectedTask.id, true)
      updateUserProfile({ points: userProfile.points + selectedTask.points })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Результати тестування</DialogTitle>
          <DialogDescription>
            Перевірка вашого коду
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            {tests.map((test) => (
              <div
                key={test.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  test.passed ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
                }`}
              >
                {test.passed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
                <span className="flex-1">{test.name}</span>
                <span className={`text-sm font-medium ${
                  test.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {test.passed ? 'Пройдено' : 'Помилка'}
                </span>
              </div>
            ))}
          </div>

          {allPassed ? (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <h3 className="font-semibold text-lg mb-1">Вітаємо! 🎉</h3>
              <p className="text-sm text-muted-foreground">
                Всі тести пройдено успішно. Ви отримаєте {selectedTask?.points} очок!
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Деякі тести не пройдено. Перевірте свій код та спробуйте ще раз.
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              {allPassed ? 'Закрити' : 'Повернутися до коду'}
            </Button>
            {allPassed && (
              <Button onClick={handleComplete} className="flex-1">
                Завершити завдання
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
