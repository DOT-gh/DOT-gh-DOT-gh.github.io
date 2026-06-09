'use client'
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { Input } from "@/components/ui/input"
import { Target } from "lucide-react"

export function DemoGoalSetter() {
  const [goal, setGoal] = useLocalStorage("guest-daily-goal", "")

  return (
    <div className="mb-8 rounded-xl border border-primary/20 bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          <Target className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Твоя ціль на сьогодні</h3>
          <p className="text-xs text-muted-foreground">Зберігається локально на твоєму пристрої</p>
        </div>
      </div>
      
      <Input 
        value={goal} 
        onChange={(e) => setGoal(e.target.value)} 
        placeholder="Наприклад: Вивчити цикли в Python..."
        className="w-full bg-background"
      />
    </div>
  )
}