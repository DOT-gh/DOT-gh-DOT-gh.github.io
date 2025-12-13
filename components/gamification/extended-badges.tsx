"use client"
import { Badge } from "../ui/badge"
import { Card } from "../ui/card"
import { Progress } from "../ui/progress"
import { useStore } from "@/lib/store"

const EXTENDED_BADGES = [
  // Базові (common)
  { id: "first-step", title: "Перший крок", desc: "Виконай 1 завдання", icon: "🎯", rarity: "common", requirement: 1 },
  { id: "5-tasks", title: "П'ятірочка", desc: "Виконай 5 завдань", icon: "5️⃣", rarity: "common", requirement: 5 },
  { id: "helper", title: "Помічник", desc: "Використай ШІ 50 разів", icon: "🤝", rarity: "common", requirement: 50 },
  {
    id: "bookworm",
    title: "Книжковий черв'як",
    desc: "Прочитай всі підказки",
    icon: "📚",
    rarity: "common",
    requirement: 1,
  },
  { id: "newbie", title: "Новачок", desc: "Зареєструйся та почни", icon: "🌱", rarity: "common", requirement: 1 },

  // Рідкісні (rare)
  {
    id: "week-streak",
    title: "Тиждень наполегливості",
    desc: "7 днів поспіль",
    icon: "🔥",
    rarity: "rare",
    requirement: 7,
  },
  { id: "night-owl", title: "Нічна сова", desc: "Завдання о 22:00-2:00", icon: "🦉", rarity: "rare", requirement: 1 },
  { id: "early-bird", title: "Рання пташка", desc: "Завдання до 7:00", icon: "🐦", rarity: "rare", requirement: 1 },
  { id: "independent", title: "Самостійний", desc: "10 завдань без ШІ", icon: "💪", rarity: "rare", requirement: 10 },
  {
    id: "comeback-kid",
    title: "Повернення",
    desc: "Після перерви 7+ днів",
    icon: "🔄",
    rarity: "rare",
    requirement: 1,
  },
  {
    id: "error-hunter",
    title: "Мисливець на помилки",
    desc: "Виправ 100 помилок",
    icon: "🐛",
    rarity: "rare",
    requirement: 100,
  },
  {
    id: "experimenter",
    title: "Експериментатор",
    desc: "Запусти код 100 разів",
    icon: "🔬",
    rarity: "rare",
    requirement: 100,
  },
  {
    id: "clean-coder",
    title: "Чистий код",
    desc: "Форматування 20 разів",
    icon: "✨",
    rarity: "rare",
    requirement: 20,
  },
  { id: "10-tasks", title: "Десяточка", desc: "Виконай 10 завдань", icon: "🔟", rarity: "rare", requirement: 10 },
  { id: "20-tasks", title: "Двадцятка", desc: "Виконай 20 завдань", icon: "2️⃣0️⃣", rarity: "rare", requirement: 20 },

  // Епічні (epic)
  { id: "code-master", title: "Майстер коду", desc: "Виконай 50 завдань", icon: "👑", rarity: "epic", requirement: 50 },
  { id: "speed-demon", title: "Демон швидкості", desc: "Завдання < 2 хв", icon: "⚡", rarity: "epic", requirement: 1 },
  {
    id: "perfectionist",
    title: "Перфекціоніст",
    desc: "10 завдань без помилок",
    icon: "💎",
    rarity: "epic",
    requirement: 10,
  },
  {
    id: "python-ninja",
    title: "Python Ніндзя",
    desc: "Всі Python завдання",
    icon: "🐍",
    rarity: "epic",
    requirement: 1,
  },
  {
    id: "web-wizard",
    title: "Веб Чарівник",
    desc: "Всі HTML/CSS завдання",
    icon: "🧙",
    rarity: "epic",
    requirement: 1,
  },
  { id: "algorithm-ace", title: "Ас Алгоритмів", desc: "Всі алгоритми", icon: "🎓", rarity: "epic", requirement: 1 },
  { id: "level-10", title: "Рівень 10", desc: "Досягни 10 рівня", icon: "🔟", rarity: "epic", requirement: 10 },
  { id: "fast-learner", title: "Швидко навчаюсь", desc: "Курс за 1 день", icon: "🚀", rarity: "epic", requirement: 1 },
  { id: "75-tasks", title: "75 завдань", desc: "Виконай 75 завдань", icon: "7️⃣5️⃣", rarity: "epic", requirement: 75 },
  { id: "30-day-streak", title: "Місячна серія", desc: "30 днів поспіль", icon: "📅", rarity: "epic", requirement: 30 },

  // Легендарні (legendary)
  {
    id: "marathon-runner",
    title: "Марафонець",
    desc: "4 години підряд",
    icon: "🏃",
    rarity: "legendary",
    requirement: 240,
  },
  { id: "century", title: "Сотня", desc: "Виконай 100 завдань", icon: "💯", rarity: "legendary", requirement: 100 },
  { id: "grand-master", title: "Гранд Майстер", desc: "Рівень 25", icon: "👑", rarity: "legendary", requirement: 25 },
  { id: "all-courses", title: "Всезнайко", desc: "Всі курси 100%", icon: "🌟", rarity: "legendary", requirement: 1 },
  {
    id: "100-day-streak",
    title: "Сто днів",
    desc: "100 днів поспіль",
    icon: "💪",
    rarity: "legendary",
    requirement: 100,
  },
  {
    id: "500-tasks",
    title: "П'ятсот!",
    desc: "Виконай 500 завдань",
    icon: "5️⃣0️⃣0️⃣",
    rarity: "legendary",
    requirement: 500,
  },

  // Спеціальні
  {
    id: "first-error",
    title: "Перша помилка",
    desc: "Зробив першу помилку",
    icon: "🔴",
    rarity: "common",
    requirement: 1,
  },
  { id: "debugger", title: "Дебаггер", desc: "Виправ 50 помилок", icon: "🔧", rarity: "rare", requirement: 50 },
  { id: "ai-friend", title: "Друг ШІ", desc: "100 запитів до ШІ", icon: "🤖", rarity: "rare", requirement: 100 },
  { id: "solo-player", title: "Соло гравець", desc: "25 завдань без ШІ", icon: "🎯", rarity: "epic", requirement: 25 },
  {
    id: "weekend-warrior",
    title: "Вікенд воїн",
    desc: "10 завдань у вихідні",
    icon: "⚔️",
    rarity: "rare",
    requirement: 10,
  },
  { id: "midnight-coder", title: "Нічний кодер", desc: "Код о 00:00", icon: "🌙", rarity: "rare", requirement: 1 },
  { id: "sunrise-coder", title: "Світанковий кодер", desc: "Код о 06:00", icon: "🌅", rarity: "rare", requirement: 1 },
  { id: "consistent", title: "Послідовний", desc: "14 днів поспіль", icon: "📈", rarity: "epic", requirement: 14 },
  {
    id: "diverse",
    title: "Різносторонній",
    desc: "По 10 завдань з 3 курсів",
    icon: "🎨",
    rarity: "epic",
    requirement: 3,
  },
  { id: "helper-hero", title: "Герой-помічник", desc: "Допоміг 10 учням", icon: "🦸", rarity: "epic", requirement: 10 },
  {
    id: "no-mistakes",
    title: "Безпомилковий",
    desc: "50 завдань без помилок",
    icon: "✅",
    rarity: "legendary",
    requirement: 50,
  },
  {
    id: "ultimate",
    title: "Ультимативний",
    desc: "Всі досягнення розблоковано",
    icon: "🏆",
    rarity: "legendary",
    requirement: 1,
  },

  // Сезонні/Подієві
  { id: "winter-coder", title: "Зимовий кодер", desc: "Завдання у грудні", icon: "❄️", rarity: "rare", requirement: 1 },
  {
    id: "spring-bloom",
    title: "Весняний розквіт",
    desc: "Завдання у березні",
    icon: "🌸",
    rarity: "rare",
    requirement: 1,
  },
  { id: "summer-fun", title: "Літня веселка", desc: "Завдання у червні", icon: "☀️", rarity: "rare", requirement: 1 },
  {
    id: "autumn-leaves",
    title: "Осіннє листя",
    desc: "Завдання у вересні",
    icon: "🍂",
    rarity: "rare",
    requirement: 1,
  },
  { id: "new-year", title: "З Новим Роком!", desc: "Завдання 1 січня", icon: "🎆", rarity: "epic", requirement: 1 },
  { id: "birthday", title: "День народження", desc: "Завдання у свій ДН", icon: "🎂", rarity: "epic", requirement: 1 },
  { id: "halloween", title: "Хелловін", desc: "Завдання 31 жовтня", icon: "🎃", rarity: "rare", requirement: 1 },
  { id: "valentine", title: "День Закоханих", desc: "Завдання 14 лютого", icon: "💝", rarity: "rare", requirement: 1 },
]

export default function ExtendedBadges() {
  const achievements = useStore((state) => state.achievements)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
      case "rare":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "epic":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "legendary":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const groupedByRarity = EXTENDED_BADGES.reduce(
    (acc, badge) => {
      if (!acc[badge.rarity]) acc[badge.rarity] = []
      acc[badge.rarity].push(badge)
      return acc
    },
    {} as Record<string, typeof EXTENDED_BADGES>,
  )

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = EXTENDED_BADGES.length
  const progress = (unlockedCount / totalCount) * 100

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Прогрес досягнень</h3>
          <span className="text-sm text-muted-foreground">
            {unlockedCount} / {totalCount}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </Card>

      {["legendary", "epic", "rare", "common"].map((rarity) => {
        const badges = groupedByRarity[rarity] || []
        const unlockedInRarity = badges.filter((b) => achievements.find((a) => a.id === b.id && a.unlocked)).length

        return (
          <div key={rarity}>
            <div className="flex items-center gap-2 mb-3">
              <Badge className={getRarityColor(rarity)}>
                {rarity === "common" && "Звичайні"}
                {rarity === "rare" && "Рідкісні"}
                {rarity === "epic" && "Епічні"}
                {rarity === "legendary" && "Легендарні"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {unlockedInRarity} / {badges.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {badges.map((badge) => {
                const unlocked = achievements.find((a) => a.id === badge.id && a.unlocked)

                return (
                  <Card
                    key={badge.id}
                    className={cn(
                      "p-3 text-center transition-all hover:scale-105",
                      unlocked ? "border-primary/50 bg-primary/5" : "opacity-50 grayscale",
                    )}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <p className="text-xs font-medium mb-1">{badge.title}</p>
                    <p className="text-[10px] text-muted-foreground">{badge.desc}</p>
                    {unlocked && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-[9px] px-1 py-0">
                          Розблоковано
                        </Badge>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
