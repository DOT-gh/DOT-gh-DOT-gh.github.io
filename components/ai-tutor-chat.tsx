"use client"

import type React from "react"

import { Bot, User, Send, Sparkles, Trash2, ChevronRight, MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useAppState } from "@/lib/store"
import { useState, useRef, useEffect } from "react"

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function getAIResponse(message: string, previousMessages: any[]): string {
  const lowerMessage = message.toLowerCase().trim()
  const msgHash = hashString(message + previousMessages.length.toString())

  // ============= 1. ПРОХАННЯ ВИРІШИТИ ЗА УЧНЯ (відмова + направлення) =============
  const solveForMePatterns = [
    "зроби за мене", "виріши за мене", "реши за меня", "напиши код",
    "напиши мені код", "напиши за мене", "дай код", "дай готовий код",
    "дай відповідь", "дай готову відповідь", "готова відповідь",
    "готове рішення", "зроби завдання", "виконай завдання", "виконай за мене",
    "реши задачу", "вирішити задачу за мене", "напиши програму", "напиши скрипт",
    "напиши функцію", "зроби домашку", "зроби домашнє", "зроби дз",
    "зроби д/з", "зроби це за мене", "зроби все", "зроби все за мене",
    "рішення задачі", "розв'язок", "розв'яжи", "розвяжи", "розв'яжи за мене",
    "реши мені", "реши мне", "дай мені код", "дай мне код",
    "виконай завдання за мене",
    "solve for me", "do it for me", "write the code", "give me the code",
    "give me the answer", "just give me", "write my homework", "do my homework",
  ]

  if (solveForMePatterns.some((p) => lowerMessage.includes(p))) {
    const refusals = [
      "Вибач, але я не можу вирішити завдання за тебе — моя задача навчити, а не виконати роботу. Але я з радістю підкажу, де в тебе помилка або який підхід вибрати. З чого хочеш почати?",
      "Ні, готову відповідь я не дам — так ти нічого не навчишся. Давай разом розберемо: що саме в задачі викликає складнощі? Я підкажу наступний крок.",
      "Я тьютор, а не генератор рішень. Зроблю інакше: постав задачу словами — що має робити код? А потім я допоможу перевести це в Python крок за кроком.",
      "Якщо я зроблю за тебе, на контрольній ти застрягнеш. Краще покажи свою спробу (навіть неправильну) — розберемо разом і знайдемо, де втрачається логіка.",
      "Готовий код не дам — це твоя практика. Але можу розбити задачу на менші кроки. Скажи: який перший крок ти зрозумів, а де починаються питання?",
      "Не можу дати відповідь, зате можу поставити правильні питання. Почни з цього: які вхідні дані в задачі? Який має бути результат? Відповіси — рухаємось далі.",
      "Моя робота — підштовхувати тебе до відповіді, а не видавати її. Надішли свій код (якщо є) або опиши логіку словами — покажу, де можна покращити.",
      "Рішення за тебе = нуль знань у тебе. Давай по-іншому: поясни, як ти УЯВЛЯЄШ алгоритм (без коду). А я підкажу які конструкції Python тобі знадобляться.",
    ]
    return refusals[msgHash % refusals.length]
  }

  // ============= 2. ПРИВІТАННЯ =============
  if (
    /^(привіт|здоров|добрий день|добрий ранок|добрий вечір|хай|йо|hello|hi|hey)/i.test(lowerMessage) ||
    lowerMessage === "hi" || lowerMessage === "йо"
  ) {
    const greetings = [
      "Привіт! Я твій ШІ-тьютор. Готовий допомогти розібратися з завданням — але не робити його за тебе. Над чим працюєш?",
      "Здоров! Розказуй — яка тема курсу зараз? Python, HTML/CSS, алгоритми? Я підкажу правильний напрямок.",
      "Привіт! Перш ніж почнемо: покажи мені свій код або опиши завдання. Разом швидше розберемось.",
    ]
    return greetings[msgHash % greetings.length]
  }

  // ============= 3. ЯК СПРАВИ / ЯК ТИ =============
  if (
    lowerMessage.includes("як справи") ||
    lowerMessage.includes("як ти") ||
    lowerMessage.includes("як поживаєш") ||
    lowerMessage.includes("як діла")
  ) {
    const responses = [
      "Я ШІ — почуваюся стабільно добре :) А ось як твої справи з кодом? Де застряг?",
      "Чудово, дякую! Завжди радий новому питанню. Що вивчаєш зараз?",
      "Все гаразд, готовий до роботи. Краще розкажи ТИ як — розібрався з останнім завданням?",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 4. ДЯКУЮ / ДЯКА =============
  if (
    lowerMessage.includes("дякую") ||
    lowerMessage.includes("дяка") ||
    lowerMessage.includes("спасибі") ||
    lowerMessage === "thx" ||
    lowerMessage === "ty"
  ) {
    const responses = [
      "Будь ласка! Якщо ще щось — пиши. Головне — практикуйся самостійно.",
      "Нема за що. Пам'ятай: знання приходять тільки через власну роботу. Успіхів!",
      "Радий був допомогти! Наступного разу спробуй спочатку сам — а потім уточнюй у мене.",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 5. ЯК ТЕБЕ ЗВАТИ / ХТО ТИ =============
  if (
    lowerMessage.includes("як тебе звати") ||
    lowerMessage.includes("хто ти") ||
    lowerMessage.includes("твоє ім") ||
    lowerMessage.includes("як тебе звут")
  ) {
    return "Я — ШІ-тьютор платформи Edu Survival Kit. Без імені, але з принципом: підказую, не вирішую. Тож питай — я поруч."
  }

  // ============= 6. ЩО ТИ ВМІЄШ / ДОПОМОГА =============
  if (
    lowerMessage.includes("що ти вмієш") ||
    lowerMessage.includes("що ти можеш") ||
    lowerMessage.includes("як ти допомагаєш") ||
    lowerMessage.includes("чим ти допоможеш")
  ) {
    return "Я можу: 1) пояснити теорію (Python, HTML/CSS, алгоритми), 2) знайти помилку у твоєму коді, 3) підказати наступний крок у завданні, 4) пояснити синтаксис. Чого НЕ роблю — не пишу готовий код за тебе."
  }

  // ============= 7. ТИ РОЗУМНИЙ / КРУТИЙ / ШІ =============
  if (
    lowerMessage.includes("ти розумний") ||
    lowerMessage.includes("ти крутий") ||
    lowerMessage.includes("ти бот") ||
    lowerMessage.includes("ти штучний інтелект") ||
    lowerMessage.includes("ти ai") ||
    lowerMessage.includes("ти ші")
  ) {
    const responses = [
      "Так, я ШІ :) Але не такий, що вирішує за тебе. Я навчаю тебе думати самому — це важливіше.",
      "Дякую! Я тренувався на курсах інформатики, тож орієнтуюсь у шкільній програмі. Питай — не соромся.",
      "Розумний рівно настільки, щоб не дати тобі списати, але допомогти зрозуміти. Над чим працюємо?",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 8. НЕ РОЗУМІЮ / ВАЖКО / СКЛАДНО =============
  if (
    lowerMessage.includes("не розумію") ||
    lowerMessage.includes("важко") ||
    lowerMessage.includes("складно") ||
    lowerMessage.includes("не знаю") ||
    lowerMessage.includes("тяжко")
  ) {
    const responses = [
      "Нормально — на початку усім важко. Давай по маленьких кроках: опиши одним реченням, що тобі треба зробити в завданні.",
      "Усі через це проходять! Не здавайся. Скажи: яка саме частина завдання найбільш незрозуміла — умова, алгоритм чи синтаксис?",
      "Якщо важко — значить вчишся :) Розкажи, що вже пробував. Навіть неправильна спроба — це прогрес.",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 9. ПОМИЛКИ ТА DEBUGGING =============
  if (
    lowerMessage.includes("помилка") ||
    lowerMessage.includes("error") ||
    lowerMessage.includes("не працює") ||
    lowerMessage.includes("не работает") ||
    lowerMessage.includes("баг") ||
    lowerMessage.includes("bug")
  ) {
    const responses = [
      "Бачу проблему! Спершу перевір: чи є двокрапка після if/for/while? Чи правильні відступи? Покажи код - допоможу знайти помилку.",
      "Помилка - це підказка від Python! Прочитай останній рядок повідомлення - там написано тип помилки. SyntaxError? NameError? TypeError?",
      "Давай розберемося крок за кроком: 1) Що саме пише в помилці? 2) На якому рядку? 3) Що ти хотів зробити цим кодом?",
      "Типова причина помилок: забута двокрапка, неправильний відступ, або друкарська помилка в назві змінної. Перевір ці три речі!",
      "Спробуй закоментувати частину коду і запустити знову - так знайдеш проблемний рядок. Де саме ламається?",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 10. ЦИКЛИ FOR =============
  if (lowerMessage.includes("for") || lowerMessage.includes("цикл")) {
    const responses = [
      "Цикл for: `for i in range(5):` - виконає код 5 разів (i буде 0,1,2,3,4). Не забудь двокрапку і відступ!",
      "Підказка для циклів: range(start, stop, step). Наприклад range(0, 10, 2) дасть 0,2,4,6,8. Спробуй!",
      "Всередині циклу обов'язковий відступ (Tab або 4 пробіли). Без відступу Python не зрозуміє що належить до циклу.",
      "Хочеш перебрати список? `for item in my_list:` - і item буде кожним елементом по черзі. Спробуй вивести через print(item).",
      "Цикл застряг? Перевір чи змінюється умова. В range() кінцеве значення НЕ включається: range(5) це 0-4, не 0-5!",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 11. WHILE =============
  if (lowerMessage.includes("while")) {
    const responses = [
      "while працює ПОКИ умова True. Важливо: щось всередині циклу має змінити умову, інакше - нескінченний цикл!",
      "Приклад: `count = 0` потім `while count < 5:` і всередині `count += 1`. Без останнього - зависне!",
      "Для виходу з циклу використай `break`. Для пропуску ітерації - `continue`. Корисні інструменти!",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 12. ФУНКЦІЇ =============
  if (lowerMessage.includes("функ") || lowerMessage.includes("def") || lowerMessage.includes("return")) {
    const responses = [
      "Функція: `def назва(параметр):` - двокрапка обов'язкова! Всередині - відступ. Виклик: `назва(значення)`.",
      "return повертає значення з функції. Без return функція поверне None. Приклад: `return результат`",
      "Параметри - це вхідні дані функції. `def greet(name):` - name це параметр, при виклику передаєш реальне ім'я.",
      "Функція спочатку оголошується (def...), а потім викликається. Не можна викликати до оголошення!",
      "Локальні змінні існують тільки всередині функції. Якщо потрібен результат назовні - використай return.",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 13. СПИСКИ =============
  if (
    lowerMessage.includes("список") ||
    lowerMessage.includes("list") ||
    lowerMessage.includes("масив") ||
    lowerMessage.includes("[")
  ) {
    const responses = [
      "Список: `nums = [1, 2, 3]`. Доступ: `nums[0]` (перший елемент). Індекси з 0!",
      "Додати елемент: `список.append(елемент)`. Видалити: `список.remove(елемент)` або `del список[індекс]`.",
      "Негативні індекси: `список[-1]` - останній елемент, `список[-2]` - передостанній. Зручно!",
      "Зрізи: `список[1:3]` - елементи з індексом 1 і 2. `список[:3]` - перші 3. `список[2:]` - з третього до кінця.",
      "len(список) - довжина. Перебір: `for item in список:` - пройде по кожному елементу.",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 14. PRINT =============
  if (
    lowerMessage.includes("print") ||
    lowerMessage.includes("вивід") ||
    lowerMessage.includes("вивести") ||
    lowerMessage.includes("виведи")
  ) {
    const responses = [
      "print() виводить в консоль. Текст в лапках: `print('Привіт!')`. Змінну без лапок: `print(x)`.",
      "f-рядки - найзручніший спосіб: `print(f'Ім\\'я: {name}, вік: {age}')` - підставить значення змінних.",
      "Декілька значень: `print('Результат:', x, 'балів')` - пробіли додадуться автоматично.",
      "Щоб вивести без переходу на новий рядок: `print('текст', end='')` - end визначає що буде в кінці.",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 15. УМОВИ IF =============
  if (
    lowerMessage.includes("if") ||
    lowerMessage.includes("умов") ||
    lowerMessage.includes("else") ||
    lowerMessage.includes("elif")
  ) {
    const responses = [
      "Умова: `if x > 5:` - двокрапка обов'язкова! Код всередині - з відступом.",
      "Повна конструкція: if умова: ... elif інша_умова: ... else: ... Порядок важливий!",
      "Порівняння: == (рівно), != (не рівно), >, <, >=, <=. Подвійне == для порівняння, одинарне = для присвоєння!",
      "Логічні оператори: and (і), or (або), not (не). Приклад: `if x > 0 and x < 10:`",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 16. ПІДКАЗКИ =============
  if (
    lowerMessage.includes("підказ") ||
    lowerMessage.includes("hint") ||
    lowerMessage.includes("допомож") ||
    lowerMessage.includes("помоги")
  ) {
    const responses = [
      "Порада: спочатку напиши алгоритм словами (псевдокод), потім переводь в Python рядок за рядком.",
      "Розбий задачу на маленькі кроки. Вирішуй кожен окремо, потім збирай разом.",
      "Використовуй print() для дебагу - виводь проміжні значення щоб бачити що відбувається в коді.",
      "Порівняй з прикладами з теорії. Що схоже? Що відрізняється? Часто рішення вже є в матеріалах.",
      "Застряг? Спробуй пояснити задачу вголос - часто рішення приходить коли формулюєш проблему.",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 17. ЗМІННІ =============
  if (lowerMessage.includes("змінн") || lowerMessage.includes("переменн") || lowerMessage.includes("variable")) {
    const responses = [
      "Змінна створюється присвоєнням: `x = 5`, `name = 'Іван'`. Тип визначається автоматично.",
      "Назви змінних: літери, цифри, підкреслення. Не можна починати з цифри. Приклад: `user_age = 15`",
      "Типи: int (число), float (дробове), str (текст), bool (True/False), list (список).",
      "Перевірити тип: `type(змінна)`. Конвертувати: `int('5')`, `str(123)`, `float('3.14')`.",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 18. HTML/CSS =============
  if (
    lowerMessage.includes("html") ||
    lowerMessage.includes("css") ||
    lowerMessage.includes("flex") ||
    lowerMessage.includes("тег")
  ) {
    const responses = [
      "HTML структура: теги відкриваються `<tag>` і закриваються `</tag>`. Не забувай закривати!",
      "Flexbox: `display: flex` на контейнері. Далі justify-content (горизонталь) і align-items (вертикаль).",
      "CSS селектори: `.class` для класу, `#id` для id, `tag` для тегу. Специфічність важлива!",
      "Блокові елементи (div, p, h1) займають всю ширину. Інлайнові (span, a) - тільки свій контент.",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 19. ПРИКЛАД =============
  if (lowerMessage.includes("приклад") || lowerMessage.includes("покаж") || lowerMessage.includes("пример")) {
    const responses = [
      "Ось базовий приклад - спробуй адаптувати під своє завдання. Що саме незрозуміло в синтаксисі?",
      "Приклади є в теоретичному матеріалі зліва. Подивись розділ по цій темі - там покроково пояснено.",
      "Давай я поясню логіку, а ти напишеш код сам - так краще запам'ятається. Що саме потрібно зробити?",
      "Замість готового прикладу, давай розберемо алгоритм: які кроки потрібні для вирішення?",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 20. АЛГОРИТМ =============
  if (lowerMessage.includes("алгоритм")) {
    const responses = [
      "Алгоритм — це послідовність кроків. Почни з простого: що на вході? Що на виході? Які дії між ними?",
      "Спершу напиши алгоритм словами (українською), тільки потім переводь у код. Так менше помилок.",
      "Розіб'ємо алгоритм на 3 частини: 1) отримати дані, 2) обробити їх, 3) вивести результат. Яка частина незрозуміла?",
    ]
    return responses[msgHash % responses.length]
  }

  // ============= 21. БЛЕКАУТ / ОФЛАЙН =============
  if (
    lowerMessage.includes("блекаут") ||
    lowerMessage.includes("офлайн") ||
    lowerMessage.includes("без інтернету") ||
    lowerMessage.includes("світло")
  ) {
    return "Платформа працює навіть без інтернету — всі курси кешуються. Тож продовжуй вчитися коли немає світла (з ноутом/планшетом). Я теж доступний офлайн з базовими підказками."
  }

  // ============= ЗАГАЛЬНІ ВІДПОВІДІ =============
  const generalResponses = [
    "Цікаве питання! Уточни: який код пробував написати і що саме не вийшло?",
    "Давай розберемось! Опиши детальніше задачу - що має робити твій код?",
    "Щоб дати точну підказку, мені потрібно більше контексту. Яке завдання виконуєш?",
    "Розумію, що застряг. Давай по кроках: що вже зробив і де зупинився?",
    "Гарне питання! Скажи, яку конкретну частину завдання намагаєшся вирішити?",
    "Я тут щоб допомогти розібратися. Поділись кодом або опиши що не працює.",
  ]

  return generalResponses[msgHash % generalResponses.length]
}

export function AiTutorChat() {
  const { messages, addMessage, clearMessages, isOffline } = useAppState()
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const safeMessages = messages || []
  const safeAddMessage = addMessage || (() => {})
  const safeClearMessages = clearMessages || (() => {})

  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
    const timer = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timer)
  }, [safeMessages, isTyping])

  const handleSend = () => {
    if (!input.trim() || !addMessage) return

    safeAddMessage({ role: "user", content: input.trim() })
    const userInput = input
    setInput("")

    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const response = getAIResponse(userInput, safeMessages)
      safeAddMessage({ role: "assistant", content: response })
    }, 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickActions = [
    { label: "Привіт", query: "Привіт!" },
    { label: "Де помилка?", query: "Де в моєму коді помилка?" },
    { label: "Підказка", query: "Дай підказку" },
    { label: "Синтаксис for", query: "Поясни синтаксис for циклу" },
    { label: "Flexbox?", query: "Що таке Flexbox?" },
    { label: "Змінні", query: "Що таке змінна в Python?" },
    { label: "Що вмієш?", query: "Що ти вмієш?" },
  ]

  return (
    <>
      {/* Mobile toggle button */}
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

      {/* Chat sidebar — inline JSX (not a nested component) to preserve input focus */}
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
              <p className="text-xs text-muted-foreground">{isOffline ? "Offline Mode" : "Online"}</p>
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

        {/* Messages */}
        <div ref={messagesContainerRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {safeMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-3">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-foreground font-medium">Привіт! Я твій ШІ-тьютор</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                Я допоможу розібратися з кодом, але не дам готових відповідей
              </p>
            </div>
          ) : (
            safeMessages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                    msg.role === "user" && "bg-accent",
                    msg.role === "assistant" && "bg-primary/20",
                    msg.role === "system" && "bg-secondary",
                  )}
                >
                  {msg.role === "user" && <User className="h-4 w-4 text-accent-foreground" />}
                  {msg.role === "assistant" && <Bot className="h-4 w-4 text-primary" />}
                  {msg.role === "system" && <Bot className="h-4 w-4 text-muted-foreground" />}
                </div>

                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                    msg.role === "user" && "bg-accent text-accent-foreground",
                    msg.role === "assistant" && "bg-card text-card-foreground border border-border",
                    msg.role === "system" && "bg-secondary/50 text-muted-foreground font-mono text-xs",
                  )}
                >
                  {msg.content}
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
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.1s]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions */}
        <div className="border-t border-sidebar-border px-3 py-2">
          <div className="flex flex-wrap gap-1.5">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => setInput(action.query)}
                className="rounded-full bg-secondary/70 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {action.label}
              </button>
            ))}
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
        <div className="fixed inset-0 z-40 bg-black/60 xl:hidden" onClick={() => setMobileOpen(false)} />
      )}
    </>
  )
}
