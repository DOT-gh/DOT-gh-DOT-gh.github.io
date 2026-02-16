"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, Trophy, Copy, Check, Sparkles, BookOpen, Home as HomeIcon, ClipboardCopy, GraduationCap, ChevronRight } from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ---- Data ----
const EXCHANGE_RATE = 43
const SECRET_CODE = 5545

// Products with DIFFERENT prices in UAH so that SUM in USD = SECRET_CODE
// Sum of all priceUAH / 43 = 5545 => sum of priceUAH = 5545 * 43 = 238435
const PRODUCTS = [
  { name: "iPhone 15 Pro", priceUAH: 51900 },
  { name: "MacBook Air M2", priceUAH: 44900 },
  { name: "iPad Pro 12.9\"", priceUAH: 24900 },
  { name: "AirPods Pro 2", priceUAH: 10750 },
  { name: "Apple Watch Ultra", priceUAH: 18900 },
  { name: "Samsung Galaxy S24", priceUAH: 15500 },
  { name: "PlayStation 5", priceUAH: 22900 },
  { name: "Xbox Series X", priceUAH: 19350 },
  { name: "Nintendo Switch OLED", priceUAH: 8600 },
  { name: "Sony WH-1000XM5", priceUAH: 5160 },
  { name: "JBL Charge 5", priceUAH: 3440 },
  { name: "Monitor Dell 27\"", priceUAH: 5590 },
  { name: "Logitech MX Keys", priceUAH: 3010 },
  { name: "Razer DeathAdder V3", priceUAH: 2150 },
  { name: "Webcam Logitech Brio", priceUAH: 1385 },
]
// Verification: sum = 51900+44900+24900+10750+18900+15500+22900+19350+8600+5160+3440+5590+3010+2150+1385 = 238435
// 238435 / 43 = 5545.0

type CopiedField = "" | "table" | "rate" | "formula" | "sum" | "discount" | "discountFormula"

export default function Grade8Page() {
  const [studentName, setStudentName] = useState("")
  const [studentSurname, setStudentSurname] = useState("")
  const [studentClass, setStudentClass] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"practical" | "homework">("practical")
  const [answer, setAnswer] = useState("")
  const [showCertificate, setShowCertificate] = useState(false)
  const [wrongAnswer, setWrongAnswer] = useState(false)
  const [copiedField, setCopiedField] = useState<CopiedField>("")

  // --- Login form state ---
  const [formName, setFormName] = useState("")
  const [formSurname, setFormSurname] = useState("")
  const [formClass, setFormClass] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const savedName = localStorage.getItem("grade8_student_name")
    const savedSurname = localStorage.getItem("grade8_student_surname")
    const savedClass = localStorage.getItem("grade8_student_class")
    // Also check profile
    const profile = localStorage.getItem("edu_profile")
    if (savedName && savedSurname && savedClass) {
      setStudentName(savedName)
      setStudentSurname(savedSurname)
      setStudentClass(savedClass)
      setIsAuthorized(true)
    } else if (profile) {
      try {
        const data = JSON.parse(profile)
        if (data.name) {
          setFormName(data.name)
        }
      } catch { /* ignore */ }
    }
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    if (!formName.trim() || !formSurname.trim() || !formClass.trim()) return
    localStorage.setItem("grade8_student_name", formName.trim())
    localStorage.setItem("grade8_student_surname", formSurname.trim())
    localStorage.setItem("grade8_student_class", formClass.trim())
    setStudentName(formName.trim())
    setStudentSurname(formSurname.trim())
    setStudentClass(formClass.trim())
    setIsAuthorized(true)
  }

  const copyToClipboard = useCallback((text: string, field: CopiedField) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(""), 2000)
  }, [])

  const copyTable = useCallback(() => {
    const header = "No\tТовар\tЦіна (грн)"
    const rows = PRODUCTS.map((p, i) => `${i + 1}\t${p.name}\t${p.priceUAH}`)
    navigator.clipboard.writeText(header + "\n" + rows.join("\n"))
    setCopiedField("table")
    setTimeout(() => setCopiedField(""), 2000)
  }, [])

  const handleSubmit = () => {
    const parsed = parseInt(answer)
    if (parsed === SECRET_CODE) {
      setShowCertificate(true)
      setWrongAnswer(false)
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ["#22c55e", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"] })
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.4, x: 0.2 } })
      }, 500)
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.4, x: 0.8 } })
      }, 1000)
    } else {
      setWrongAnswer(true)
      setTimeout(() => setWrongAnswer(false), 3000)
    }
  }

  // --- Loading ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Завантаження...</p>
        </div>
      </div>
    )
  }

  // --- Login form ---
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">8 клас: Таблиці</CardTitle>
            <CardDescription>Введи свої дані для початку роботи</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="g8name">Ім'я</Label>
              <Input id="g8name" placeholder="Олександр" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="g8surname">Прізвище</Label>
              <Input id="g8surname" placeholder="Коваленко" value={formSurname} onChange={(e) => setFormSurname(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="g8class">Клас</Label>
              <Input id="g8class" placeholder="8-А" value={formClass} onChange={(e) => setFormClass(e.target.value)} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/">Назад</Link>
              </Button>
              <Button className="flex-1" onClick={handleLogin} disabled={!formName.trim() || !formSurname.trim() || !formClass.trim()}>
                Почати
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // --- Certificate ---
  if (showCertificate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full border-primary/40 overflow-hidden">
          {/* Header band */}
          <div className="bg-primary/10 border-b border-primary/20 p-6 text-center space-y-3">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 border-2 border-primary">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <div>
              <p className="text-xs font-mono text-primary tracking-widest uppercase">Edu Survival Kit</p>
              <h1 className="text-3xl font-bold text-foreground mt-1">Сертифікат</h1>
            </div>
          </div>
          <CardContent className="p-6 text-center space-y-5">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Цим підтверджується, що учень</p>
              <p className="text-2xl font-bold text-foreground">{studentSurname} {studentName}</p>
              <p className="text-muted-foreground">Клас: {studentClass}</p>
            </div>
            <div className="border-t border-b border-border py-4 space-y-2">
              <p className="text-foreground">успішно виконав практичну роботу</p>
              <p className="font-semibold text-primary">
                "Адресація. Іменовані комірки. Модифікація формул"
              </p>
              <p className="text-sm text-muted-foreground">8 клас | Інформатика</p>
            </div>
            <Card className="bg-secondary border-primary/30">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Код підтвердження</p>
                <p className="text-3xl font-mono font-bold text-primary">{SECRET_CODE}</p>
              </CardContent>
            </Card>
            <p className="text-xs text-muted-foreground">
              Зроби скриншот цього сертифіката та прикріпи до завдання в Google Classroom
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {new Date().toLocaleDateString("uk-UA")} | dotkit.me
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="outline" onClick={() => setShowCertificate(false)}>Назад до завдання</Button>
              <Button asChild><Link href="/">На головну</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // --- Copyable inline button ---
  const CopyBtn = ({ text, field, label }: { text: string; field: CopiedField; label?: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="inline-flex items-center gap-1 sm:gap-1.5 rounded-md border border-border bg-secondary px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs sm:text-sm font-mono transition-colors hover:bg-secondary/80 hover:border-primary/50 group active:scale-95"
    >
      <span className="text-foreground truncate max-w-[120px] sm:max-w-none">{label || text}</span>
      {copiedField === field ? (
        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary shrink-0" />
      ) : (
        <ClipboardCopy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      )}
    </button>
  )

  // --- Main content ---
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button variant="ghost" size="icon" asChild className="shrink-0">
              <Link href="/"><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /></Link>
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate">8 клас: Інформатика</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{studentSurname} {studentName} | {studentClass}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 border-b border-border pb-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab("practical")}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
              activeTab === "practical"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
            <span className="hidden xs:inline">Практична робота</span>
            <span className="xs:hidden">Практична</span>
          </button>
          <button
            onClick={() => setActiveTab("homework")}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
              activeTab === "homework"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <HomeIcon className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1.5 sm:mr-2" />
            <span className="hidden xs:inline">Домашнє завдання</span>
            <span className="xs:hidden">Домашня</span>
          </button>
        </div>

        {/* ===== PRACTICAL WORK TAB ===== */}
        {activeTab === "practical" && (
          <div className="space-y-6">
            {/* Exchange rate */}
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-3 sm:p-4 flex items-center justify-between flex-wrap gap-2 sm:gap-3">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Курс долара на сьогодні</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary">{EXCHANGE_RATE} грн = 1$</p>
                </div>
                <CopyBtn text={String(EXCHANGE_RATE)} field="rate" label={`${EXCHANGE_RATE}`} />
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <CardTitle>Таблиця товарів</CardTitle>
                    <CardDescription>15 товарів. Можна виділяти текст та копіювати.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyTable} className="gap-2">
                    {copiedField === "table" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedField === "table" ? "Скопійовано!" : "Копіювати всю таблицю"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full select-text min-w-[500px]">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-semibold text-muted-foreground w-10 sm:w-12">No</th>
                        <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-semibold text-muted-foreground">Товар</th>
                        <th className="text-right p-2 sm:p-3 text-xs sm:text-sm font-semibold text-muted-foreground">Ціна (грн)</th>
                        <th className="text-right p-2 sm:p-3 text-xs sm:text-sm font-semibold text-primary whitespace-nowrap">Ціна $ (ти)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PRODUCTS.map((p, i) => (
                        <tr key={i} className="border-t border-border hover:bg-secondary/50 transition-colors select-text">
                          <td className="p-2 sm:p-3 text-xs sm:text-sm text-muted-foreground select-text">{i + 1}</td>
                          <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium text-foreground select-text">{p.name}</td>
                          <td className="p-2 sm:p-3 text-xs sm:text-sm text-right font-mono text-foreground select-text">{p.priceUAH.toLocaleString("uk-UA")}</td>
                          <td className="p-2 sm:p-3 text-xs sm:text-sm text-right text-primary font-semibold select-text">?</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Step-by-step Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Покрокова інструкція</CardTitle>
                <CardDescription>Виконуй кроки по порядку в Google Таблицях</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">1</div>
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Підготовка даних</p>
                    <ol className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Відкрий Google Таблиці та створи новий файл.</li>
                      <li>Натисни <strong>"Копіювати всю таблицю"</strong> вище та встав дані (Ctrl+V).</li>
                      <li>В окрему клітинку збоку (наприклад, <strong>G1</strong>) впиши курс долара: <CopyBtn text={String(EXCHANGE_RATE)} field="rate" /></li>
                    </ol>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">2</div>
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Створення "Іменної комірки" (головна фішка!)</p>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                      <li>Клікни мишкою на клітинку з курсом (<strong>G1</strong>).</li>
                      <li>Подивись у <strong>лівий верхній кут</strong> (ліворуч від рядка формул). Там є "Поле імені", де написано "G1".</li>
                      <li>Клікни туди, зітри "G1" і напиши слово: <CopyBtn text="Курс" field="formula" label="Курс" /></li>
                    </ol>
                    <Card className="bg-destructive/10 border-destructive/30">
                      <CardContent className="p-3 text-sm text-destructive">
                        ВАЖЛИВО: Обов'язково натисни клавішу <strong>ENTER</strong>! Якщо не натиснеш Enter, ім'я не збережеться.
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">3</div>
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Формула розрахунку доларів</p>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                      <li>Підпиши стовпець D: <strong>"Ціна в $"</strong>.</li>
                      <li>Клікни у першу клітинку під заголовком (<strong>D2</strong>).</li>
                      <li>Напиши формулу: <CopyBtn text="=C2/Курс" field="formula" label="=C2/Курс" /></li>
                      <li>Натисни <strong>Enter</strong>.</li>
                      <li>Наведи курсор на правий нижній кут клітинки (з'явиться чорний хрестик) та <strong>протягни вниз</strong> на всі 15 товарів.</li>
                    </ol>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">4</div>
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Значок долара ($) - Форматування</p>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                      <li>Виділи мишкою всі клітинки з цінами в доларах (стовпець D).</li>
                      <li>На панелі зверху натисни кнопку <strong>"123"</strong> (або "Інші формати").</li>
                      <li>Обери <strong>"Долар США ($)"</strong> та натисни "Застосувати".</li>
                    </ol>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">5</div>
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Порахуй СУМУ</p>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                      <li>Стань під стовпцем з доларами (клітинка <strong>D17</strong>).</li>
                      <li>Напиши формулу: <CopyBtn text="=SUM(D2:D16)" field="sum" label="=SUM(D2:D16)" /></li>
                      <li>Натисни <strong>Enter</strong>.</li>
                      <li>Отримане число (заокруглене до цілого) введи нижче для отримання сертифіката!</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Answer input */}
            <Card className={wrongAnswer ? "border-destructive" : ""}>
              <CardHeader>
                <CardTitle>Введи свою відповідь</CardTitle>
                <CardDescription>Сума в доларах, заокруглена до цілого числа</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    type="number"
                    placeholder="Наприклад: 5545"
                    value={answer}
                    onChange={(e) => { setAnswer(e.target.value); setWrongAnswer(false) }}
                    className={`flex-1 font-mono text-lg ${wrongAnswer ? "border-destructive" : ""}`}
                    onKeyDown={(e) => { if (e.key === "Enter" && answer) handleSubmit() }}
                  />
                  <Button onClick={handleSubmit} disabled={!answer} className="gap-2">
                    <Trophy className="w-4 h-4" />
                    Перевірити
                  </Button>
                </div>
                {wrongAnswer && (
                  <p className="text-sm text-destructive">
                    Неправильна відповідь. Перевір розрахунки в Google Таблицях!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ===== HOMEWORK TAB ===== */}
        {activeTab === "homework" && (
          <div className="space-y-6">
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <HomeIcon className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">Black Friday & GG WP!</h2>
                </div>
                <p className="text-muted-foreground">Завдання: порахувати нову ціну зі знижкою 10%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Покрокова інструкція</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* HW Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">1</div>
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Створи "Глобальну Знижку"</p>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                      <li>У вільній клітинці збоку (наприклад, <strong>H1</strong>) напиши: <CopyBtn text="10%" field="discount" label="10%" /></li>
                      <li>Клікни на неї, знайди <strong>Поле імені</strong> (зліва зверху).</li>
                      <li>Напиши слово: <CopyBtn text="Знижка" field="discountFormula" label="Знижка" /></li>
                    </ol>
                    <Card className="bg-destructive/10 border-destructive/30">
                      <CardContent className="p-3 text-sm text-destructive">
                        Обов'язково натисни <strong>ENTER</strong> після введення імені!
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* HW Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">2</div>
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Напиши формулу</p>
                    <p className="text-sm text-muted-foreground">
                      Нам треба від ціни відняти відсоток ВІД ЦІЄЇ ЦІНИ.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      У першій клітинці стовпця "Ціна зі знижкою" пиши:
                    </p>
                    <CopyBtn text="=D2-(D2*Знижка)" field="discountFormula" label="=D2-(D2*Знижка)" />
                    <p className="text-xs text-muted-foreground mt-1">
                      (Де D2 -- це ціна в доларах). Тобто: Ціна - (Гроші, які ми економимо)
                    </p>
                  </div>
                </div>

                {/* HW Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">3</div>
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Протягни вниз</p>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                      <li>Натисни <strong>Enter</strong>.</li>
                      <li>Тягни за чорний хрестик вниз на всі товари.</li>
                      <li>Готово!</li>
                    </ol>
                  </div>
                </div>

                {/* HW Step 4 - Submit */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">4</div>
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">Здача роботи</p>
                    <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                      <li>Збережи файл Excel / Google Таблиці.</li>
                      <li>Зроби <strong>скриншот</strong> своєї таблиці.</li>
                      <li>Завантаж обидва файли в <strong>Google Classroom</strong>.</li>
                    </ol>
                    <Card className="bg-secondary border-border">
                      <CardContent className="p-3 text-sm text-muted-foreground">
                        Дедлайн: наступний урок
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grading */}
            <Card>
              <CardHeader>
                <CardTitle>Система оцінювання</CardTitle>
                <CardDescription>Максимум 12 балів</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { task: "Створення файлу та даних", points: 2 },
                    { task: "Іменна клітинка 'Курс'", points: 3 },
                    { task: "Формула та автозаповнення", points: 3 },
                    { task: "Формат ($) та Сума", points: 2 },
                    { task: "Сертифікат (скриншот)", points: 2 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-foreground">{item.task}</span>
                      <span className="text-sm font-bold text-primary">{item.points} бали</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
