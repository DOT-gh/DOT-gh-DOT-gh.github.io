"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"

import {
  Bot,
  User,
  Send,
  Sparkles,
  Trash2,
  MessageSquare,
  X,
  Lightbulb,
  Brain,
  Zap,
  Copy,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

type HintLevel = 1 | 2 | 3
type PersonalityType = "friendly" | "strict" | "humorous" | "professional"

interface AISettings {
  personality: PersonalityType
  hintLevel: HintLevel
  autoHints: boolean
  contextAware: boolean
  progressiveHints: boolean
}

interface AITutorEnhancedProps {
  currentExercise: any
  code: string
  messages: any[]
  addMessage: (msg: any) => void
  clearMessages: () => void
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

/* ============================================================
   SMART RESPONSE SYSTEM
   - Detects "solve for me" → refuses politely, redirects
   - Handles greetings, thanks, meta questions
   - Detects topic keywords (for, while, if, functions, lists, HTML/CSS, errors)
   - Personality-flavoured
   ============================================================ */
function getSmartResponse(
  message: string,
  personality: PersonalityType,
  msgCount: number,
): string {
  const m = message.toLowerCase().trim()
  const h = hashString(message + msgCount.toString())
  const pick = (arr: string[]) => arr[h % arr.length]

  /* --- 1. ВІДМОВА ВИРІШИТИ ЗА УЧНЯ --- */
  const solveFor = [
    "зроби за мене", "виріши за мене", "реши за меня", "напиши код",
    "напиши мені код", "напиши за мене", "дай код", "дай готовий код",
    "дай відповідь", "дай готову відповідь", "готова відповідь",
    "готове рішення", "зроби завдання", "виконай завдання",
    "виконай за мене", "реши задачу", "вирішити задачу за мене",
    "напиши програму", "напиши скрипт", "напиши функцію",
    "зроби домашку", "зроби домашнє", "зроби дз", "зроби д/з",
    "зроби це за мене", "зроби все", "зроби все за мене",
    "рішення задачі", "розв'язок", "розв'яжи", "розвяжи",
    "реши мені", "реши мне", "дай мені код", "дай мне код",
    "solve for me", "do it for me", "write the code", "give me the code",
    "give me the answer", "write my homework", "do my homework",
  ]
  if (solveFor.some((p) => m.includes(p))) {
    return pick([
      "Ні, готову відповідь не дам — це твоя практика. Але я підкажу де застрягла логіка. Що ти вже спробував?",
      "Вибач, але моя робота — навчити, а не виконати завдання. Покажи свою спробу, разом розберемо.",
      "Я тьютор, а не генератор рішень. Постав задачу словами — я підкажу які конструкції Python/HTML знадобляться.",
      "Якщо я зроблю за тебе — на контрольній ти застрягнеш. Давай інакше: опиши алгоритм словами.",
      "Готовий код це нуль знань у тебе. Покажи що не виходить — я поясню саме ту частину.",
      "Не дам відповідь, зате поставлю правильні питання: що на вході? що на виході? Який крок незрозумілий?",
      "Моя задача — підштовхнути до правильної думки, не написати її замість тебе. З чого почнемо?",
      "Рішення готове не буде, але план — без проблем. Розіб'ємо задачу на 3 кроки, згоден?",
    ])
  }

  /* --- 2. ПРИВІТАННЯ --- */
  if (/^(привіт|здоров|добрий день|добрий ранок|добрий вечір|хай|йо|hello|hi|hey|прівєт|хелоу|алоха|салам|саламалєйкум|вітаю|шалом)/i.test(m)) {
    if (personality === "humorous")
      return pick([
        "Йо-хо-хо! Готовий до пригод у світі коду? Що сьогодні розберемо?",
        "Привіт, майбутній геній! Перед тим як вирішувати Задачу Тисячоліття — покажи, над чим зараз працюєш.",
      ])
    if (personality === "strict")
      return pick([
        "Розпочнімо. Яка тема зараз і де затримався?",
        "Готовий працювати. Надішли код або опиши завдання.",
      ])
    if (personality === "professional")
      return pick([
        "Доброго дня. Приступімо до роботи — опишіть поточне завдання.",
        "Вітаю. Готовий надати технічну підтримку з програмування.",
      ])
    return pick([
      "Привіт! Я твій ШІ-тьютор. Готовий допомогти розібратися з завданням. Над чим працюєш?",
      "Здоров! Розказуй — Python, HTML/CSS чи алгоритми? Підкажу правильний напрямок.",
      "Вітаю! Покажи свій код або опиши задачу — разом швидше розберемось.",
    ])
  }

  /* --- 3. ЯК СПРАВИ --- */
  if (m.includes("як справи") || m.includes("як ти") || m.includes("як поживаєш") || m.includes("як діла")) {
    return pick([
      "Я ШІ — почуваюсь стабільно. А ось як твої справи з кодом? Де застряг?",
      "Все добре, готовий до роботи. Краще розкажи як у тебе — вийшло з останнім завданням?",
      "Чудово, дякую! Що вивчаєш зараз?",
    ])
  }

  /* --- 4. ДЯКУЮ --- */
  if (m.includes("дякую") || m.includes("дяка") || m.includes("спасибі") || m === "thx" || m === "ty" || m === "дяк" || m === "дякс" || m === "сяп") {
    return pick([
      "Будь ласка! Пам'ятай: знання приходять через власну практику. Успіхів!",
      "Нема за що. Якщо ще щось — пиши.",
      "Звертайся, коли треба буде. Наступного разу спробуй спочатку самостійно.",
      "Та нема проблем. Тримайся, все вийде!",
      "Ну шо ти, це моя робота. Кодь далі!",
    ])
  }

  /* --- 4.5. СЛЕНГ / КОРОТКІ ФРАЗИ --- */
  // "пж" / "пжж" / "плз" — ввічливе прохання
  if (m === "пж" || m === "пжж" || m === "пжлста" || m === "плз" || m === "please" || m === "пожалуйста") {
    return pick([
      "Я тут, слухаю. Але готовий код не дам — це не про навчання. Сформулюй питання і разом знайдемо рішення.",
      "Пжж-не пжж — правило одне: не даю готові відповіді. Покажи що не виходить, разом розберемо, ок?",
      "Ввічливо — це круто. Але навіть за 'пж' коду за тебе не напишу. Давай по-іншому: опиши проблему словами.",
    ])
  }

  // "норм" / "ок" / "збс" / "топ" — реакція на відповідь
  if (m === "ок" || m === "окей" || m === "ok" || m === "норм" || m === "збс" || m === "топ" || m === "круто" || m === "класно" || m === "супер") {
    return pick([
      "Збс! Пиши ще, якщо застрягнеш.",
      "Норм, рухаємось далі. Є ще питання?",
      "Ок, бувай. Як треба буде — повертайся.",
      "Топчик. Тренуйся, і все вийде.",
      "Ну і супер. Шо далі будемо розбирати?",
    ])
  }

  // "го" / "погнали" / "погналі"
  if (m === "го" || m === "поїхали" || m === "погнали" || m === "погналі" || m === "let's go" || m === "давай") {
    return pick([
      "Го! Шо розбираємо — Python, HTML/CSS чи алгоритми?",
      "Погнали. Кидай задачу або код — будемо мучити.",
      "Давай. Опиши шо треба зробити, а я підкажу напрямок.",
    ])
  }

  // "шо" / "що" / "шо по" — уточнення
  if (m === "шо" || m === "шо?" || m === "шо таке" || m === "шо по" || m === "шо робити" || m === "шо делать" || m === "не шарю") {
    return pick([
      "Шо-шо... Давай конкретніше — на якому моменті застряг? Кидай код або номер завдання.",
      "Не шариш — норм, усі колись починали. Сформулюй конкретне питання, і я підкажу.",
      "Шо по завданню? Опиши словами, шо має робити програма, і я направлю.",
    ])
  }

  // "кек" / "лол" / "хаха" — гумор
  if (m === "кек" || m === "лол" || m === "lol" || m === "хаха" || m === "ахах" || m === "ржу") {
    return pick([
      "Сміятися — добре, але давай ще й завдання доробимо, га?",
      "Кек, але код сам себе не напише. Повертаймось до діла.",
      "Весело — це добре. Тепер — за роботу, покажи на чому застряг.",
    ])
  }

  // "бро" / "братан" / "чувак" тощо — тригер лишаємо (бо учні так пишуть), але відповідь нейтральна
  if (m === "бро" || m === "братан" || m === "брат" || m === "сестра" || m === "чувак" || m === "дружище" || m === "друг" || m === "подруга" || m === "друже") {
    return pick([
      "Я тут, слухаю. Шо треба?",
      "На зв'язку. Розказуй задачу.",
      "Тут-тут. З чим допомогти?",
      "Агов, на місці. Шо вивчаємо?",
    ])
  }

  // "шо там" / "як там" — загальне
  if (m === "шо там" || m === "як там" || m === "шо нового" || m === "як дела" || m === "як справи?") {
    return pick([
      "Та норм, сервери гудуть, модель не глючить. У тебе як з кодом?",
      "Все стабільно, чекаю на твої питання. А в тебе як?",
      "Все ок, все працює, готовий пояснювати цикли. А в тебе шо?",
    ])
  }

  // "не знаю" / "хз" / "незнаю"
  if (m === "не знаю" || m === "не знаю.." || m === "хз" || m === "хзз" || m === "незнаю" || m === "поняття не маю") {
    return pick([
      "Хз — то норм стартова точка. Давай з самого початку: прочитай умову задачі вголос. Шо в ній не зрозуміло?",
      "Не знаєш — і не треба соромитись. Просто скажи, яке конкретне слово чи крок збиває з пантелику.",
      "Ок, тоді підемо від базового. Опиши словами, шо повинна робити програма (без коду). А я підкажу з яких частин її зібрати.",
    ])
  }

  // "все" / "все зрозуміло" / "розібрався"
  if (m === "все" || m === "все зрозуміло" || m === "розібрався" || m === "розібралась" || m === "допер" || m === "зрозумів" || m === "зрозуміла") {
    return pick([
      "О, клас! Тоді вперед — закріплюй практикою. Якщо шо — я тут.",
      "Топ! Знання = розуміння + практика. Зроби ще 2-3 схожі задачі.",
      "Супер. Не забудь: через день перевір чи досі пам'ятаєш, як це працює.",
      "Вогонь! Тепер спробуй пояснити це своїми словами — якщо вийде, значить точно засвоїлось.",
    ])
  }

  /* --- 5. ХТО ТИ / ЯК ЗВАТИ --- */
  if (m.includes("хто ти") || m.includes("як тебе звати") || m.includes("твоє ім") || m.includes("як тебе звут")) {
    return "Я — ШІ-тьютор Edu Survival Kit. Без імені, але з принципом: підказую, не вирішую."
  }

  /* --- 6. ЩО ТИ ВМІЄШ --- */
  if (m.includes("що ти вмієш") || m.includes("що ти можеш") || m.includes("як ти допомагаєш")) {
    return "Я можу:\n1. Пояснити теорію (Python, HTML/CSS, алгоритми)\n2. Знайти помилку у твоєму коді\n3. Підказати наступний крок\n4. Пояснити синтаксис\n\nЧого НЕ роблю — не пишу код за тебе."
  }

  /* --- 7. РОЗУМНИЙ / БОТ --- */
  if (m.includes("ти розумний") || m.includes("ти крутий") || m.includes("ти бот") || m.includes("ти штучний інтелект") || m.includes("ти ai") || m.includes("ти ші")) {
    return pick([
      "Так, я ШІ. Але не такий, що вирішує за тебе. Я навчаю тебе думати самостійно.",
      "Дякую :) Тренувався на шкільній програмі з інформатики. Питай!",
      "Розумний рівно настільки, щоб не дати списати, але допомогти зрозуміти.",
    ])
  }

  /* --- 8. НЕ РОЗУМІЮ / ВАЖКО --- */
  if (m.includes("не розумію") || m.includes("важко") || m.includes("складно") || m.includes("не знаю") || m.includes("тяжко")) {
    return pick([
      "На початку всім важко. Опиши одним реченням що треба зробити в задачі.",
      "Не здавайся! Скажи яка саме частина незрозуміла — умова, алгоритм чи синтаксис?",
      "Якщо важко — значить вчишся. Розкажи що вже пробував, навіть неправильно.",
    ])
  }

  /* --- 9. ПОМИЛКИ --- */
  if (m.includes("помилка") || m.includes("error") || m.includes("не працює") || m.includes("не работает") || m.includes("баг") || m.includes("bug") || m.includes("крашиться")) {
    return pick([
      "Давай подумаємо разом. Перевір:\n1. Чи є двокрапка `:` після `if`/`for`/`while`?\n2. Чи правильні відступи (4 пробіли)?\n3. Чи не переплутав `=` (присвоєння) та `==` (порівняння)?",
      "Помилка — це підказка. Прочитай ОСТАННІЙ рядок:\n- `SyntaxError` — синтаксис\n- `NameError` — змінна не існує\n- `TypeError` — неправильний тип",
      "Закоментуй частину коду `#` і запусти знову — так знайдеш проблемний рядок. Де саме ламається?",
      "Типові винуватці:\n1. Забута двокрапка\n2. Неправильний відступ\n3. Помилка в назві змінної\n\nПеревір ці три речі!",
    ])
  }

  /* --- 10. ЦИКЛИ FOR --- */
  if (m.includes("for") || m.includes("цикл")) {
    return pick([
      "Цикл `for` виконує код декілька разів:\n```python\nfor i in range(5):\n    print(i)  # виведе 0,1,2,3,4\n```\nНе забудь двокрапку і відступ!",
      "range(start, stop, step):\n- `range(5)` — 0,1,2,3,4\n- `range(2, 10, 2)` — 2,4,6,8\n- `range(10, 0, -1)` — зворотний",
      "Перебір списку:\n```python\nfor item in my_list:\n    print(item)\n```\nКожна ітерація — `item` стане наступним елементом.",
    ])
  }

  /* --- 11. WHILE --- */
  if (m.includes("while")) {
    return pick([
      "`while` працює ПОКИ умова істинна:\n```python\ncount = 0\nwhile count < 5:\n    count += 1\n```\nВажливо: щось всередині має змінити умову, інакше — нескінченний цикл.",
      "Для виходу з `while` використай `break`. Для пропуску ітерації — `continue`.",
    ])
  }

  /* --- 12. ФУНКЦІЇ --- */
  if (m.includes("функ") || m.includes("def ") || m.includes("return")) {
    return pick([
      "Функція — це блок коду з іменем:\n```python\ndef greet(name):\n    return f'Привіт, {name}!'\n\ngreet('Дмитро')\n```",
      "`return` повертає значення з функції. Без `return` — повернеться `None`.",
      "Параметри — вхідні дані. При виклику передаєш реальні значення:\n`def add(a, b): return a + b`\n`add(2, 3)` → `5`",
    ])
  }

  /* --- 13. СПИСКИ --- */
  if (m.includes("список") || m.includes("list") || m.includes("масив") || m.includes("[")) {
    return pick([
      "Список:\n```python\nnums = [1, 2, 3]\nnums[0]   # 1 (перший)\nnums[-1]  # 3 (останній)\nnums.append(4)  # [1,2,3,4]\n```",
      "Зрізи списків:\n- `lst[1:3]` — елементи 1,2\n- `lst[:3]` — перші 3\n- `lst[-2:]` — останні 2",
      "Корисне:\n- `len(lst)` — довжина\n- `sum(lst)` — сума\n- `sorted(lst)` — відсортований\n- `lst.reverse()` — перевернути",
    ])
  }

  /* --- 14. PRINT --- */
  if (m.includes("print") || m.includes("вивід") || m.includes("вивести") || m.includes("виведи")) {
    return pick([
      "`print()` виводить у консоль:\n```python\nprint('Hello')          # текст\nprint(x)                # змінна\nprint(f'Вік: {age}')    # f-рядок\n```",
      "Декілька значень через кому:\n`print('Результат:', x, 'балів')` — пробіли автоматично.",
    ])
  }

  /* --- 15. УМОВИ IF --- */
  if (m.includes("if ") || m.includes("умов") || m.includes("else") || m.includes("elif")) {
    return pick([
      "Умови:\n```python\nif age >= 18:\n    print('Дорослий')\nelif age >= 12:\n    print('Підліток')\nelse:\n    print('Дитина')\n```",
      "Порівняння: `==` (рівно), `!=` (не рівно), `>`, `<`, `>=`, `<=`.\n**Увага**: `==` для порівняння, `=` для присвоєння!",
      "Логічні: `and` (і), `or` (або), `not` (не).\n`if x > 0 and x < 10:` — обидві умови істинні.",
    ])
  }

  /* --- 16. ПІДКАЗКА --- */
  if (m.includes("підказ") || m.includes("hint") || m.includes("допомож") || m.includes("помоги")) {
    return pick([
      "Порада: спершу напиши алгоритм словами (псевдокод), потім переводь у Python рядок за рядком.",
      "Розбий задачу на маленькі кроки. Виріши кожен окремо, потім збери разом.",
      "Використовуй `print()` для дебагу — виводь проміжні значення щоб бачити що відбувається.",
      "Порівняй з прикладами з теорії. Що схоже? Що відрізняється?",
    ])
  }

  /* --- 17. ЗМІННІ --- */
  if (m.includes("змінн") || m.includes("переменн") || m.includes("variable")) {
    return pick([
      "Змінна створюється присвоєнням:\n```python\nx = 5\nname = 'Іван'\nis_active = True\n```\nТип визначається автоматично.",
      "Типи даних:\n- `int` — цілі (5, -10)\n- `float` — дробові (3.14)\n- `str` — текст ('hello')\n- `bool` — True/False\n- `list` — списки",
      "Перевірка типу: `type(x)`. Конвертація: `int('5')`, `str(123)`, `float('3.14')`.",
    ])
  }

  /* --- 18. HTML/CSS --- */
  if (m.includes("html") || m.includes("css") || m.includes("flex") || m.includes("тег") || m.includes("div")) {
    return pick([
      "HTML теги:\n```html\n<div class='box'>\n  <h1>Заголовок</h1>\n  <p>Абзац</p>\n</div>\n```\nВажливо закривати теги!",
      "Flexbox:\n```css\n.container {\n  display: flex;\n  justify-content: center; /* горизонталь */\n  align-items: center;     /* вертикаль */\n  gap: 1rem;\n}\n```",
      "CSS селектори:\n- `.class` — клас\n- `#id` — ідентифікатор\n- `tag` — тег\n- `.parent > .child` — прямий нащадок",
    ])
  }

  /* --- 19. ПРИКЛАД --- */
  if (m.includes("приклад") || m.includes("покаж") || m.includes("пример")) {
    return pick([
      "Готовий приклад не дам — скажи з якої теми. Якщо це цикли — покажу базу, а ти адаптуєш.",
      "Приклади є в теоретичному матеріалі зліва. Що саме шукаєш?",
      "Замість готового прикладу — опиши задачу. Допоможу розібратися з логікою.",
    ])
  }

  /* --- 20. АЛГОРИТМ --- */
  if (m.includes("алгоритм")) {
    return pick([
      "Алгоритм — послідовність кроків. Почни просто: що на вході? Що на виході? Які дії між?",
      "Спершу алгоритм словами (українською), потім переведи у код. Менше помилок.",
      "Розділи на 3 частини:\n1. Отримати дані\n2. Обробити\n3. Вивести результат\n\nЯка частина незрозуміла?",
    ])
  }

  /* --- 21. БЛЕКАУТ --- */
  if (m.includes("блекаут") || m.includes("офлайн") || m.includes("без інтернету") || m.includes("світло")) {
    return "Платформа працює навіть без інтернету — всі курси кешуються. Продовжуй вчитися коли немає світла. Я також доступний офлайн з базовими підказками."
  }

  /* --- 22. РІВЕНЬ ПІДКАЗКИ --- */
  if (m.includes("легку підказ") || m.includes("легка підказ")) {
    return "Підказка рівень 1: перечитай умову задачі та порівняй з тим, що робить твій код. Де розходження?"
  }
  if (m.includes("схожої задачі") || m.includes("схожу задачу") || m.includes("приклад схожої")) {
    return "Підказка рівень 2: подумай про базову структуру. Цикл зазвичай виглядає так:\n```python\nfor i in range(n):\n    # дія з i\n```\nАдаптуй під свою задачу."
  }
  if (m.includes("сильну підказ") || m.includes("сильна підказ")) {
    return "Підказка рівень 3: основа алгоритму:\n```python\nresult = 0\nfor i in range(1, n+1):\n    result += i\nprint(result)\n```\nЗаміни `+= i` на потрібну тобі операцію."
  }

  /* --- 23. ЗАГАЛЬНІ --- */
  const general = [
    "Цікаве питання! Уточни: який код пробував і що не вийшло?",
    "Давай розберемось. Опиши детальніше — що має робити код?",
    "Щоб дати точну підказку, розкажи яке завдання виконуєш.",
    "Бачу, що застряг. По кроках: що вже зробив і де зупинився?",
    "Гарне питання. Яку конкретну частину задачі намагаєшся вирішити?",
    "Я тут щоб допомогти. Поділись кодом або опиши що не працює.",
  ]
  return pick(general)
}

export default function AITutorEnhanced({
  code,
  messages,
  addMessage,
  clearMessages,
}: AITutorEnhancedProps) {
  const { toast } = useToast()
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [aiSettings] = useState<AISettings>({
    personality: "friendly",
    hintLevel: 1,
    autoHints: true,
    contextAware: true,
    progressiveHints: true,
  })
  const [currentHintLevel, setCurrentHintLevel] = useState<HintLevel>(1)
  const [questionCount, setQuestionCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [copiedBlocks, setCopiedBlocks] = useState<Set<string>>(new Set())

  const safeMessages = messages || []
  const safeAddMessage = addMessage || (() => {})
  const safeClearMessages = clearMessages || (() => {})

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [safeMessages, isTyping])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    safeAddMessage({ role: "user", content: trimmed })
    setInput("")
    setQuestionCount((prev) => prev + 1)

    // Progressive hint level (raises on repeated "підказка")
    if (/підказ|hint/i.test(trimmed)) {
      setCurrentHintLevel((prev) => Math.min(3, prev + 1) as HintLevel)
    }

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const response = getSmartResponse(trimmed, aiSettings.personality, safeMessages.length)
      safeAddMessage({ role: "assistant", content: response })
    }, 900 + Math.random() * 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopyCode = (codeStr: string, blockId: string) => {
    navigator.clipboard.writeText(codeStr)
    setCopiedBlocks((prev) => new Set(prev).add(blockId))
    toast({ variant: "success", title: "Код скопійовано" })
    setTimeout(() => {
      setCopiedBlocks((prev) => {
        const next = new Set(prev)
        next.delete(blockId)
        return next
      })
    }, 2000)
  }

  const quickActions = [
    { label: "Підказка рівень 1", Icon: Lightbulb, query: "Дай легку підказку" },
    { label: "Підказка рівень 2", Icon: Brain, query: "Покажи приклад схожої задачі" },
    { label: "Підказка рівень 3", Icon: Zap, query: "Дай сильну підказку з кодом" },
  ]

  // biome-ignore lint: unused variable
  const _code = code

  return (
    <>
      {/* Mobile toggle */}
      {!mobileOpen && (
        <Button
          variant="default"
          size="sm"
          className="fixed bottom-20 right-4 z-50 xl:hidden gap-2 shadow-lg rounded-full h-12 w-12 p-0"
          onClick={() => setMobileOpen(true)}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}

      {/* Chat sidebar — JSX inlined (NOT a nested component) to preserve input focus */}
      <aside
        className={cn(
          "flex flex-col bg-sidebar",
          "hidden xl:flex xl:w-80",
          mobileOpen && "fixed inset-0 z-50 flex w-full sm:w-96 xl:relative xl:w-80",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-sidebar-foreground">ШІ-Асистент</h2>
              <p className="text-xs text-muted-foreground">Дружній</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={safeClearMessages}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 xl:hidden" onClick={() => setMobileOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="border-b border-sidebar-border px-4 py-2 flex gap-2">
          <Badge variant="secondary" className="text-xs">
            Питань: {questionCount}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Рівень підказок: {currentHintLevel}
          </Badge>
        </div>

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {safeMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-3">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-foreground font-medium">Привіт! Я твій ШІ-тьютор</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
                Я допоможу розібратися, але не дам готових відповідей
              </p>
            </div>
          ) : (
            safeMessages.map((msg, idx) => (
              <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                    msg.role === "user" && "bg-accent",
                    msg.role === "assistant" && "bg-primary/20",
                    msg.role === "system" && "bg-amber-500/20",
                  )}
                >
                  {msg.role === "user" && <User className="h-4 w-4 text-accent-foreground" />}
                  {msg.role === "assistant" && <Bot className="h-4 w-4 text-primary" />}
                  {msg.role === "system" && <Sparkles className="h-4 w-4 text-amber-500" />}
                </div>

                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                    msg.role === "user" && "bg-accent text-accent-foreground",
                    msg.role === "assistant" &&
                      "bg-card text-card-foreground border border-border prose prose-sm dark:prose-invert max-w-none",
                    msg.role === "system" && "bg-amber-500/10 text-amber-300 border border-amber-500/30",
                  )}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        code({ inline, className, children, ...props }: any) {
                          const codeString = String(children).replace(/\n$/, "")
                          const blockId = `${idx}-${codeString.slice(0, 20)}`
                          const isBlock = !inline && /language-/.test(className || "")

                          return isBlock ? (
                            <div className="relative group my-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 h-6 w-6 p-0"
                                onClick={() => handleCopyCode(codeString, blockId)}
                              >
                                {copiedBlocks.has(blockId) ? (
                                  <Check className="h-3 w-3 text-emerald-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                              <pre className="bg-zinc-950 rounded-lg p-3 overflow-x-auto border border-zinc-800">
                                <code className="text-xs text-zinc-100 font-mono">{codeString}</code>
                              </pre>
                            </div>
                          ) : (
                            <code
                              className={cn(
                                "bg-zinc-800/50 text-zinc-100 px-1.5 py-0.5 rounded text-xs font-mono",
                                className,
                              )}
                              {...props}
                            >
                              {children}
                            </code>
                          )
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/20">
                <Bot className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="bg-card border border-border rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.1s]" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                  </div>
                  <span className="text-xs text-muted-foreground">ШІ аналізує...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions — FIXED: proper icon component rendering */}
        <div className="border-t border-sidebar-border px-3 py-2">
          <div className="space-y-1.5">
            {quickActions.map((action) => {
              const IconComp = action.Icon
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => setInput(action.query)}
                  className="w-full flex items-center gap-2 rounded px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <IconComp className="h-3.5 w-3.5" />
                  <span>{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Input — DO NOT disable while typing (keeps focus) */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Запитай підказку..."
              className="flex-1 bg-input text-sm placeholder:text-muted-foreground"
              autoComplete="off"
            />
            <Button
              size="icon"
              className="shrink-0 bg-primary hover:bg-primary/90"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground">
            ШІ не дає готових відповідей — лише підказки
          </p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 xl:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}
    </>
  )
}
