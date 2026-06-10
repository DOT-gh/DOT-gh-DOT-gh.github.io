// Межі навчального періоду (для підписів у дашборді)
export const PERIOD_START = "03.03"
export const PERIOD_END = "26.05"
export const PERIOD_LABEL = "3 березня — 26 травня 2026"
export const PERIOD_LABEL_SHORT = "03.03 — 26.05"

export type StudentSession = {
  date: string
  duration: number
  device: string
  city: string
}

export type Student = {
  id: string
  name: string
  progress: number
  lastActivity: string
  lastActivityTs: number
  currentTask: string
  totalTime: string
  totalMinutes: number
  tasksCompleted: number
  totalTasks: number
  aiRequestsCount: number
  offlineSessions: number
  className: string
  sessions: StudentSession[]
  avgTimePerTask: number
  hintsUsed: number
  errorRate: number
  invited: boolean
}

export type ClassInfo = {
  id: string
  name: string
  topic: string
  totalStudents: number
  activeStudents: number
  avgScore: number
  avgProgress: number
  students: Student[]
}

// ── Детермінований генератор (seeded PRNG) ──────────────────────────────────
function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ── Довідники ───────────────────────────────────────────────────────────────
const DEVICES_WEIGHTED = [
  "Android", "Android", "Android", "Android",
  "Windows", "Windows", "Windows",
  "iOS", "iOS",
  "Chrome OS",
  "macOS",
]

const CITIES_WEIGHTED = [
  "м. Шостка", "м. Шостка", "м. Шостка", "м. Шостка", "м. Шостка", "м. Шостка",
  "с. Вороніж",
  "с. Ямпіль",
]

// Дати занять/сесій рівномірно по навчальному періоду 03.03 — 26.05 2026
const SESSION_DATES = [
  "03.03", "06.03", "10.03", "13.03", "17.03", "20.03", "24.03", "27.03",
  "31.03", "03.04", "07.04", "10.04", "14.04", "17.04", "21.04", "24.04",
  "28.04", "05.05", "08.05", "12.05", "15.05", "19.05", "22.05", "26.05",
]

const LAST_DATES = ["15.05", "19.05", "22.05", "26.05"]

// Завдання за темами (currentTask вибирається за прогресом)
const TASKS: Record<string, string[]> = {
  robot: [
    "Знайомство з середовищем",
    "Виконавець Робот — рух",
    "Команди повороту — рівень 2",
    "Цикли повторення — рівень 3",
    "Умови та перешкоди — рівень 4",
    "Складений алгоритм — рівень 5",
    "Гра «Лабіринт» — фінал",
  ],
  graphics: [
    "Інтерфейс графічного редактора",
    "Інструменти малювання",
    "Робота з кольором",
    "Шари зображення — завдання 4",
    "Виділення та трансформація",
    "Колаж — завдання 6",
    "Фінальний проєкт — листівка",
  ],
  algo: [
    "Поняття алгоритму",
    "Лінійні алгоритми",
    "Розгалуження — завдання 3",
    "Цикли — завдання 4",
    "Складені умови — завдання 5",
    "Виконавець Робот — рівень 4",
    "Підсумковий проєкт",
  ],
  coding: [
    "Системи числення",
    "Двійкове кодування — завдання 2",
    "Кодування тексту",
    "Растрова графіка — завдання 4",
    "Кодування звуку",
    "Стиснення даних — завдання 6",
    "Підсумкова робота",
  ],
  sheets: [
    "Інтерфейс електронних таблиць",
    "Введення даних та формати",
    "Формули та функції — завдання 3",
    "Абсолютні посилання",
    "Сортування та фільтри",
    "Діаграми — завдання 6",
    "Зведені таблиці — фінал",
  ],
  python: [
    "Перша програма на Python",
    "Змінні та типи даних",
    "Введення / виведення",
    "Умовні оператори — завдання 4",
    "Цикли while / for — завдання 5",
    "Функції — завдання 6",
    "Списки та словники",
    "Підсумковий проєкт",
  ],
  web: [
    "Структура HTML-документа",
    "Текст і списки",
    "Зображення та посилання",
    "Основи CSS — завдання 4",
    "Селектори CSS — завдання 5",
    "Блокова модель",
    "Flexbox-верстка — завдання 7",
    "Фінальний сайт-портфоліо",
  ],
  sql: [
    "Поняття бази даних",
    "Таблиці та типи полів",
    "Запити SELECT — завдання 3",
    "Фільтрація WHERE",
    "Сортування та групування",
    "Агрегатні функції — завдання 6",
    "JOIN таблиць — завдання 7",
    "Фінальний проєкт БД",
  ],
  js: [
    "Основи JavaScript",
    "Змінні та оператори",
    "Умови та цикли — завдання 3",
    "Функції — завдання 4",
    "Масиви та методи — завдання 5",
    "DOM — пошук елементів",
    "DOM-події — завдання 7",
    "Інтерактивний застосунок — фінал",
  ],
}

// ── Опис класів зі справжніми списками ──────────────────────────────────────
type ClassSeed = {
  id: string
  name: string
  topic: string
  topicKey: keyof typeof TASKS
  totalTasks: number
  // повний список (порядок як у журналі); ім'я з суфіксом «(запрошено)» = неактивний
  roster: string[]
}

const CLASS_SEEDS: ClassSeed[] = [
  {
    id: "5a",
    name: "5-А",
    topic: "Алгоритми. Виконавець Робот",
    topicKey: "robot",
    totalTasks: 7,
    roster: [
      "Буйницька Аріна", "Патлах Аріна", "Вуйцик Варвара", "Сидорова Вероніка",
      "Семенюк Владислав", "Хоменко Кіра", "Дейкало Михайло", "Івашин Нікіта (запрошено)",
      "Карабут Олександра", "Мокренко Олександра", "Сидоренко Радіон",
      "Семенушкова Софія", "Бойко Уляна", "Макогон Ясміна",
    ],
  },
  {
    id: "5b1",
    name: "5-Б (1 група)",
    topic: "Графічний редактор",
    topicKey: "graphics",
    totalTasks: 7,
    roster: [
      "Ісаєнко Алісія", "Драчова Анастасія", "Кудрявцева Вікторія", "Бондаренко Гліб",
      "Лазаренко Євгенія", "Ганцева Єсенія", "Юсенок Ілля", "Матвієнко Кіріл",
      "Алекса Максим", "Кошелєв Максим", "Козаченко Маріанна", "Брідель Марія",
      "Ігнатнєв Нікіта", "Гой Олександр", "Загорулько Олександр", "Денисенко Роман",
      "Глушко Уляна",
    ],
  },
  {
    id: "5b2",
    name: "5-Б (2 група)",
    topic: "Графічний редактор",
    topicKey: "graphics",
    totalTasks: 7,
    roster: [
      "Романько Аліна", "Терехов Арсеній", "Осіпова Валерія", "Пулатова Вікторія",
      "Цит Владислав", "Мацуй Дар'я", "Мороз Єлизавета", "Овсієнко Іван",
      "Черних Ілля", "Радченко Кіра", "Новіков Марк", "Солоха Матвій",
      "Никлонський Михайло", "Овсепян Міланія", "Найдьонова Олександра",
      "Якименко Соломія", "Паламаренко Софія",
    ],
  },
  {
    id: "5v",
    name: "5-В",
    topic: "Графічний редактор",
    topicKey: "graphics",
    totalTasks: 7,
    roster: [
      "Шумей Аліна", "Савченко Анастасія", "Сидорченко Анастасія", "Хамбардзумян Анна",
      "Свіріденко Артем", "Пєшкова Владислава", "Хоминич Дмитро", "Корж Єгор",
      "Черкаська Єлизавета", "Маменко Кирило", "Чухно Кирило", "Таранова Ксенія",
      "Харченко Лілія", "Черновол Назар", "Шаповал Олександр", "Шугаєва Олександра",
    ],
  },
  {
    id: "8a",
    name: "8-А (ІІ група)",
    topic: "Алгоритми та програми",
    topicKey: "algo",
    totalTasks: 7,
    roster: [
      "Савченко Аліса", "Черкай Андрій", "Петровці Вікторія", "Роговий Гліб",
      "Шевцов Даниїл", "Роботько Денис", "Удалой Дмитро", "Ткач Емілія",
      "Печко Євгеній", "Сенченко Кирило", "Разумова Кіра", "Хоменко Максим",
      "Радюк Матвій", "Щур Микола", "Стариков Олександр", "Сорбат Олексій",
      "Поповченко Поліна",
    ],
  },
  {
    id: "8b",
    name: "8-Б (ІІ група)",
    topic: "Кодування даних та графіка",
    topicKey: "coding",
    totalTasks: 7,
    roster: [
      "Сорбат Анастасія", "Марків Ангеліна", "Шемет Вероніка", "Шевцова Вероніка",
      "Симонець Владислава", "Мкртчян Давид", "Нечота Діана", "Тіщенко Дмитро",
      "Макута Єгор", "Токарєв Єгор", "Школьний Матвій", "Шибицький Михайло",
      "Юрченко Михайло", "Цвєтков Савелій",
    ],
  },
  {
    id: "8v",
    name: "8-В (ІІ група)",
    topic: "Електронні таблиці",
    topicKey: "sheets",
    totalTasks: 7,
    roster: [
      "Рибакова Алісія", "Самохвалова Альона", "Проноза Андрій", "Петренко Артем",
      "Петренко Артем (запрошено)", "Щербань Варвара", "Марченко Вероніка",
      "Петренко Вікторія", "Фатальчук Дамір", "Клус Дар'я", "Нерсісян Дінара",
      "Мороз Євген", "Дюндін Ілля", "Тимошин Кирило", "Сугоняко Марія",
      "Цьомка Марія", "Ротунда Матвій", "Шишков Тимур", "Іванова Юлія",
      "Ракул Ярослав",
    ],
  },
  {
    id: "9a",
    name: "9-А (2 група)",
    topic: "Основи програмування Python",
    topicKey: "python",
    totalTasks: 8,
    roster: [
      "Боровик Владислав (запрошено)", "Леонтенко Владислав", "Ковбаса Даниїл",
      "Багута Данило", "Базилевич Дарина", "Банташ Денис", "Аносов Іван",
      "Зиморой Максим", "Герасимова Мілана", "Литвин Олександр (запрошено)",
      "Нікіта Орел", "Мозгова Поліна", "Коворотний Семен",
    ],
  },
  {
    id: "9b1",
    name: "9-Б (1 група)",
    topic: "Створення вебсайтів: HTML/CSS",
    topicKey: "web",
    totalTasks: 8,
    roster: [
      "Дідух Аліса", "Будик Андрій", "Удалая Анна", "Петрушов Антон",
      "Макаренко Аріна", "Могила Валерія", "Мельник Всеволод", "Бондаренко Дар'я",
      "Колодко Ілля", "Захарченко Ірина", "Бородієнко Каріна", "Даніленко Кирило",
      "Бандуріна Марія", "Гончар Марія", "Грушевська Марія", "Бутиркін Матвій",
      "Атрошко Олександр", "Копа Олександра",
    ],
  },
  {
    id: "9b2",
    name: "9-Б (2 група)",
    topic: "Створення вебсайтів: HTML/CSS",
    topicKey: "web",
    totalTasks: 8,
    roster: [
      "Белясник Анастасія", "Яременко Анастасія", "Осадна Варвара", "Охременко Владислав",
      "Шульженко Владислава", "Рябикіна Діана", "Нощенко Катерина", "Привалова Марія",
      "Шкурат Марія", "Нікіфоров Олександр", "Таїсія Пилипець", "Мозговий Семен",
      "Мартиненко Софія", "Ткаченко Софія", "Цьомка Софія", "Плашко Тетяна",
      "Дорошенко Юлія",
    ],
  },
  {
    id: "10a",
    name: "10-А (2 група)",
    topic: "Бази даних та SQL",
    topicKey: "sql",
    totalTasks: 8,
    roster: [
      "Іллєнко Арсеній", "Вареник Артем", "Гайдукова Валерія", "Киричко Данило (запрошено)",
      "Горбачов Денис", "Кирута Ігор", "Бондар Микола", "Ліфіренко Михайло",
      "Лукашов Нікіта (запрошено)", "Кожедуб Олександр", "Ігнатенко Софія",
      "Зінкевич Тарас", "Корж Ян-Олександр",
    ],
  },
  {
    id: "10b",
    name: "10-Б (2 група)",
    topic: "Опрацювання табличних даних",
    topicKey: "sheets",
    totalTasks: 8,
    roster: [
      "Карнаух Валерія", "Афанасенко Вероніка", "Василенко Віктор", "Амелін Всеволод (запрошено)",
      "Дяченко Дар'я", "Бондаренко Дмитро", "Борисенко Єгор", "Берестовська Ірина",
      "Ваніна Кіра", "Бацура Марія", "Хоновненко Мирослав", "Дупліна Мілана",
      "Калиновський Олександр", "Коваль Олександра", "Білобородова Софія", "Аревян Тимур",
    ],
  },
  {
    id: "11v",
    name: "11-В (1 група)",
    topic: "Веб-розробка: JavaScript",
    topicKey: "js",
    totalTasks: 8,
    roster: [
      "Мазнєва Анна", "Щербак Валерія", "Красовська Вікторія", "Сугоняко Данило",
      "Роговой Єрмак", "Власков Ігор", "Тімошик Кирило", "Родітєлєва Ольга",
      "Ситая Поліна",
    ],
  },
]

// ── Допоміжні ────────────────────────────────────────────────────────────────
function pick<T>(arr: T[], r: number): T {
  return arr[Math.floor(r * arr.length) % arr.length]
}
function intRange(r: number, min: number, max: number): number {
  return min + Math.floor(r * (max - min + 1))
}
function fmtTime(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m}хв`
  return `${h}г ${String(m).padStart(2, "0")}хв`
}

function buildStudent(seed: ClassSeed, rawName: string, index: number): Student {
  const invited = /\(запрошено\)/i.test(rawName)
  const name = rawName.replace(/\s*\(запрошено\)\s*/i, "").trim()
  const id = `${seed.id}-${String(index + 1).padStart(2, "0")}`
  const tasks = TASKS[seed.topicKey]
  const totalTasks = seed.totalTasks

  if (invited) {
    return {
      id,
      name,
      progress: 0,
      lastActivity: "Не заходив",
      lastActivityTs: 0,
      currentTask: "Запрошення надіслано",
      totalTime: "0хв",
      totalMinutes: 0,
      tasksCompleted: 0,
      totalTasks,
      aiRequestsCount: 0,
      offlineSessions: 0,
      className: seed.name,
      sessions: [],
      avgTimePerTask: 0,
      hintsUsed: 0,
      errorRate: 0,
      invited: true,
    }
  }

  const rnd = mulberry32(hashStr(`${seed.id}::${name}`))

  // Розподіл прогресу: більшість 65-100, частина нижче
  const roll = rnd()
  let progress: number
  if (roll > 0.75) progress = intRange(rnd(), 92, 100)
  else if (roll > 0.4) progress = intRange(rnd(), 78, 94)
  else if (roll > 0.15) progress = intRange(rnd(), 60, 82)
  else progress = intRange(rnd(), 42, 66)

  const tasksCompleted = Math.max(1, Math.round((progress / 100) * totalTasks))
  const taskIdx = Math.min(tasksCompleted, tasks.length - 1)
  const currentTask =
    progress >= 100 ? `${tasks[tasks.length - 1]} — завершено` : tasks[taskIdx]

  const sessionCount = intRange(rnd(), 4, 8)
  const sessions: StudentSession[] = []
  // фіксуємо «домашнє» місто та частий пристрій учня
  const homeCity = pick(CITIES_WEIGHTED, rnd())
  const mainDevice = pick(DEVICES_WEIGHTED, rnd())
  let totalMinutes = 0
  const usedDates = new Set<number>()
  // ~80% учнів були активні до кінця періоду, решта — «відстали»
  const isEngaged = rnd() < 0.8
  for (let s = 0; s < sessionCount; s++) {
    let di: number
    if (s === sessionCount - 1 && isEngaged) {
      // остання сесія активного учня — в останні 5 занять періоду
      di = intRange(rnd(), SESSION_DATES.length - 5, SESSION_DATES.length - 1)
    } else {
      di = intRange(rnd(), 0, SESSION_DATES.length - 1)
    }
    let guard = 0
    while (usedDates.has(di) && guard < 12) {
      di = intRange(rnd(), 0, SESSION_DATES.length - 1)
      guard++
    }
    usedDates.add(di)
    const duration = intRange(rnd(), 22, 65)
    totalMinutes += duration
    const device = rnd() > 0.78 ? pick(DEVICES_WEIGHTED, rnd()) : mainDevice
    const city = rnd() > 0.85 ? pick(CITIES_WEIGHTED, rnd()) : homeCity
    sessions.push({ date: SESSION_DATES[di], duration, device, city })
  }
  sessions.sort(
    (a, b) => SESSION_DATES.indexOf(a.date) - SESSION_DATES.indexOf(b.date),
  )

  const lastDate = sessions[sessions.length - 1]?.date ?? pick(LAST_DATES, rnd())
  const hh = intRange(rnd(), 9, 19)
  const mm = intRange(rnd(), 0, 59)
  const lastActivity = `${lastDate}, ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`
  const lastActivityTs =
    SESSION_DATES.indexOf(lastDate) * 1440 + hh * 60 + mm

  // Чим нижчий прогрес — тим більше AI-запитів, підказок та помилок
  const difficulty = 1 - progress / 100
  const aiRequestsCount = intRange(rnd(), 2, 6) + Math.round(difficulty * 24)
  const offlineSessions = intRange(rnd(), 0, 6)
  const avgTimePerTask =
    tasksCompleted > 0 ? Math.max(6, Math.round(totalMinutes / tasksCompleted)) : 0
  const hintsUsed = intRange(rnd(), 1, 4) + Math.round(difficulty * 14)
  const errorRate = Math.min(45, intRange(rnd(), 3, 9) + Math.round(difficulty * 36))

  return {
    id,
    name,
    progress,
    lastActivity,
    lastActivityTs,
    currentTask,
    totalTime: fmtTime(totalMinutes),
    totalMinutes,
    tasksCompleted,
    totalTasks,
    aiRequestsCount,
    offlineSessions,
    className: seed.name,
    sessions,
    avgTimePerTask,
    hintsUsed,
    errorRate,
    invited: false,
  }
}

// ── Побудова класів ──────────────────────────────────────────────────────────
export const classesData: ClassInfo[] = CLASS_SEEDS.map((seed) => {
  const students = seed.roster.map((rawName, i) => buildStudent(seed, rawName, i))
  const active = students.filter((s) => !s.invited)
  const avgProgress = active.length
    ? Math.round(active.reduce((a, s) => a + s.progress, 0) / active.length)
    : 0
  // 12-бальна шкала: прогрес 100% ≈ 12 балів
  const avgScore = active.length
    ? Number(
        (
          active.reduce((a, s) => a + (s.progress / 100) * 12, 0) / active.length
        ).toFixed(1),
      )
    : 0

  return {
    id: seed.id,
    name: seed.name,
    topic: seed.topic,
    totalStudents: students.length,
    activeStudents: active.length,
    avgScore,
    avgProgress,
    students,
  }
})

// ── Похідні агрегати для дашборду ─────────────────────────────────────────────
const allStudents = classesData.flatMap((c) => c.students)
const activeStudents = allStudents.filter((s) => !s.invited)

export const progressByClass = classesData.map((c) => ({
  class: c.name.replace(/\s*\(.*?\)\s*/g, " ").replace(/група/gi, "гр").trim(),
  progress: c.avgProgress,
  score: c.avgScore,
}))

export const summaryStats = {
  totalStudents: allStudents.length,
  totalActive: activeStudents.length,
  avgScore: Number(
    (classesData.reduce((a, c) => a + c.avgScore, 0) / classesData.length).toFixed(1),
  ),
  avgProgress: Math.round(
    classesData.reduce((a, c) => a + c.avgProgress, 0) / classesData.length,
  ),
  totalAiRequests: activeStudents.reduce((a, s) => a + s.aiRequestsCount, 0),
  totalSessions: activeStudents.reduce((a, s) => a + s.sessions.length, 0),
  totalCompletedTasks: activeStudents.reduce((a, s) => a + s.tasksCompleted, 0),
  totalHours: Math.round(activeStudents.reduce((a, s) => a + s.totalMinutes, 0) / 60),
  totalOfflineSessions: activeStudents.reduce((a, s) => a + s.offlineSessions, 0),
}

// Активність за днями = кількість сесій по датах
export const activityData = SESSION_DATES.map((date) => ({
  time: date,
  active: activeStudents.reduce(
    (a, s) => a + s.sessions.filter((ss) => ss.date === date).length,
    0,
  ),
}))

// Розподіл по пристроях (за всіма сесіями)
export const deviceData = (() => {
  const counts: Record<string, number> = {}
  activeStudents.forEach((s) =>
    s.sessions.forEach((ss) => {
      counts[ss.device] = (counts[ss.device] || 0) + 1
    }),
  )
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
})()

// Популярність тем = сумарно виконані завдання по темах
export const topicStats = (() => {
  const counts: Record<string, number> = {}
  classesData.forEach((c) => {
    const done = c.students.reduce((a, s) => a + s.tasksCompleted, 0)
    counts[c.topic] = (counts[c.topic] || 0) + done
  })
  return Object.entries(counts)
    .map(([topic, completed]) => ({
      topic: topic.split(/[:.]/)[0].split(" ").slice(0, 2).join(" "),
      completed,
    }))
    .sort((a, b) => b.completed - a.completed)
    .slice(0, 6)
})()

// Активність по годинах (усереднений типовий день)
export const hourlyActivity = [
  { hour: "08:00", active: 4 },
  { hour: "10:00", active: 31 },
  { hour: "12:00", active: 44 },
  { hour: "14:00", active: 39 },
  { hour: "16:00", active: 33 },
  { hour: "18:00", active: 21 },
  { hour: "20:00", active: 7 },
]

// Остання активність — реальні учні, відсортовані за часом останнього входу
const ACTIVITY_VERBS = [
  "Завершив(-ла) завдання",
  "Запитав(-ла) AI-підказку",
  "Розпочав(-ла) новий модуль",
  "Здав(-ла) практичну роботу",
  "Отримав(-ла) досягнення",
  "Повернувся(-лась) до завдання",
]

export const recentActivity = activeStudents
  .slice()
  .sort((a, b) => b.lastActivityTs - a.lastActivityTs)
  .slice(0, 8)
  .map((s, i) => ({
    time: s.lastActivity,
    student: s.name,
    action:
      s.progress >= 100
        ? "Завершив(-ла) фінальне завдання"
        : ACTIVITY_VERBS[i % ACTIVITY_VERBS.length],
    class: s.className,
  }))

// Учні групи ризику: низький прогрес, багато помилок або давня остання активність.
// «Давно не заходив» = остання активність раніше ніж 5-те з кінця заняття.
const STALE_TS = SESSION_DATES.indexOf(SESSION_DATES[SESSION_DATES.length - 5]) * 1440
export const riskStudents = activeStudents
  .filter((s) => s.progress < 60 || s.errorRate >= 35 || s.lastActivityTs < STALE_TS)
  .map((s) => {
    const reasons: string[] = []
    if (s.progress < 60) reasons.push("Низький прогрес")
    if (s.errorRate >= 35) reasons.push("Багато помилок")
    if (s.lastActivityTs < STALE_TS) reasons.push("Давно не заходив(-ла)")
    if (s.aiRequestsCount >= 24) reasons.push("Багато AI-підказок")
    return { ...s, riskReasons: reasons }
  })
  .sort((a, b) => a.progress - b.progress)

// ТОП учнів за прогресом (для рейтингу)
export const topStudents = activeStudents
  .slice()
  .sort((a, b) => b.progress - a.progress || b.tasksCompleted - a.tasksCompleted)
  .slice(0, 10)
