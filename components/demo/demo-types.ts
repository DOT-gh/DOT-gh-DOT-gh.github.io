export type DemoTask = {
  id: string
  title: string
  description: string
  completed: boolean
  content: string
  hint?: string
}

export type DemoCourse = {
  id: string
  title: string
  description: string
  icon: "demo" | "python" | "web" | "algorithm"
  progress: number
  completedTasks: number
  totalTasks: number
  locked: boolean
  tasks: DemoTask[]
}
