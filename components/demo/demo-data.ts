import type { DemoCourse } from "./demo-types"

export const initialDemoCourses: DemoCourse[] = [
  {
    id: "demo-overview",
    title: "Демо-курс: Огляд платформи",
    description: "Спробуйте редактор коду, завдання та інтерфейс без реєстрації",
    icon: "demo",
    progress: 0,
    completedTasks: 0,
    totalTasks: 3,
    locked: false,
    tasks: [
      {
        id: "demo-1",
        title: "Перше завдання",
        description: "Напишіть програму, яка виводить привітання",
        completed: false,
        content: `# Демо-завдання 1
# Виведіть "Привіт, Edu Survival Kit!"

`,
        hint: 'print("Привіт, Edu Survival Kit!")',
      },
      {
        id: "demo-2",
        title: "Змінні",
        description: "Створіть змінну з вашим ім'ям",
        completed: false,
        content: `# Демо-завдання 2
# Створіть змінну name і виведіть її

`,
        hint: 'name = "Гість"\nprint(name)',
      },
      {
        id: "demo-3",
        title: "Цикл for",
        description: "Виведіть числа від 1 до 3",
        completed: false,
        content: `# Демо-завдання 3
# Використайте цикл for

`,
        hint: "for i in range(1, 4):\n    print(i)",
      },
    ],
  },
  {
    id: "python",
    title: "Python: Основи",
    description: "Базовий курс програмування на Python",
    icon: "python",
    progress: 0,
    completedTasks: 0,
    totalTasks: 6,
    locked: true,
    tasks: [],
  },
  {
    id: "web",
    title: "Web-розробка",
    description: "HTML, CSS та JavaScript для початківців",
    icon: "web",
    progress: 0,
    completedTasks: 0,
    totalTasks: 8,
    locked: true,
    tasks: [],
  },
  {
    id: "algorithm",
    title: "Алгоритми та структури даних",
    description: "Поглиблене вивчення логіки програмування",
    icon: "algorithm",
    progress: 0,
    completedTasks: 0,
    totalTasks: 10,
    locked: true,
    tasks: [],
  },
]
