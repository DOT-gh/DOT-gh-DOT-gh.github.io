import type { DemoCourse } from "./demo-types"

export const lockedDemoCourses: Pick<
  DemoCourse,
  "id" | "title" | "description" | "icon" | "completedTasks" | "totalTasks"
>[] = [
  {
    id: "python",
    title: "Python: Основи",
    description: "Базовий курс програмування на Python",
    icon: "python",
    completedTasks: 0,
    totalTasks: 6,
  },
  {
    id: "web",
    title: "Web-розробка",
    description: "HTML, CSS та JavaScript для початківців",
    icon: "web",
    completedTasks: 0,
    totalTasks: 8,
  },
  {
    id: "algorithm",
    title: "Алгоритми та структури даних",
    description: "Поглиблене вивчення логіки програмування",
    icon: "algorithm",
    completedTasks: 0,
    totalTasks: 10,
  },
]
