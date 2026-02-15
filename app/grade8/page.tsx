"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Trophy, Copy, Check, Sparkles } from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

export default function Grade8Page() {
  const [answer, setAnswer] = useState("")
  const [showCertificate, setShowCertificate] = useState(false)
  const [copied, setCopied] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(0)
  const [products, setProducts] = useState<Array<{ name: string; priceUAH: number; qty: number }>>([])

  const SECRET_CODE = 10000

  useEffect(() => {
    // Отримуємо дані учня з localStorage (встановлюється на головній сторінці)
    const savedName = localStorage.getItem("grade8_student_name")
    const savedSurname = localStorage.getItem("grade8_student_surname")
    const savedClass = localStorage.getItem("grade8_student_class")
    
    if (!savedName || !savedSurname || !savedClass) {
      // Якщо не авторизований - повертаємо на головну
      window.location.href = "/"
      return
    }

    // Генеруємо курс долара (або беремо збережений з сьогодні)
    const savedRate = localStorage.getItem("grade8_exchange_rate")
    const savedDate = localStorage.getItem("grade8_date")
    const today = new Date().toDateString()

    if (savedRate && savedDate === today) {
      const rate = parseFloat(savedRate)
      setExchangeRate(rate)
      generateProducts(rate)
    } else {
      const newRate = generateExchangeRate()
      setExchangeRate(newRate)
      generateProducts(newRate)
      localStorage.setItem("grade8_exchange_rate", newRate.toString())
      localStorage.setItem("grade8_date", today)
    }
  }, [])

  const generateExchangeRate = () => {
    return parseFloat((40 + Math.random() * 5).toFixed(2))
  }

  const generateProducts = (rate: number) => {
    const baseProducts = [
      { name: "iPhone 15 Pro", qty: 2 },
      { name: "MacBook Air M2", qty: 1 },
      { name: "iPad Pro 12.9\"", qty: 3 },
      { name: "AirPods Pro 2", qty: 5 },
      { name: "Apple Watch Ultra", qty: 2 },
      { name: "Samsung Galaxy S24", qty: 2 },
      { name: "PlayStation 5", qty: 4 },
      { name: "Xbox Series X", qty: 3 },
      { name: "Nintendo Switch OLED", qty: 6 },
      { name: "Sony WH-1000XM5", qty: 4 },
      { name: "JBL Charge 5", qty: 8 },
      { name: "Monitor Dell 27\"", qty: 3 },
      { name: "Logitech G Pro", qty: 10 },
      { name: "Razer DeathAdder", qty: 12 },
      { name: "Logitech Brio 4K", qty: 5 },
    ]

    const totalQty = baseProducts.reduce((sum, p) => sum + p.qty, 0)
    const pricePerUnitUSD = SECRET_CODE / totalQty

    const productsWithPrices = baseProducts.map((product) => ({
      ...product,
      priceUAH: parseFloat((pricePerUnitUSD * rate).toFixed(2)),
    }))

    setProducts(productsWithPrices)
  }

  const handleSubmit = () => {
    if (parseInt(answer) === SECRET_CODE) {
      setShowCertificate(true)
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"],
      })
    } else {
      alert("Неправильний код. Перевір розрахунки в Google Таблицях!")
    }
  }

  const copyTable = () => {
    const tableData = products
      .map((p, i) => `${i + 1}\t${p.name}\t${p.priceUAH}\t${p.qty}`)
      .join("\n")
    navigator.clipboard.writeText(tableData)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const studentName = localStorage.getItem("grade8_student_name") || ""
  const studentSurname = localStorage.getItem("grade8_student_surname") || ""
  const studentClass = localStorage.getItem("grade8_student_class") || ""

  if (showCertificate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-primary/30 bg-gradient-to-br from-card to-secondary">
          <CardContent className="p-8 text-center space-y-6">
            {/* Логотип замість emoji */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border-4 border-primary">
                <Trophy className="w-12 h-12 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-2">
                <Sparkles className="w-8 h-8" />
                Вітаємо!
                <Sparkles className="w-8 h-8" />
              </h1>
              <p className="text-2xl font-semibold text-foreground">
                {studentSurname} {studentName}
              </p>
              <p className="text-lg text-muted-foreground">Клас: {studentClass}</p>
            </div>

            <div className="py-4">
              <p className="text-foreground mb-4">
                Ти успішно виконав завдання з таблицями та курсом долара!
              </p>
              <Card className="bg-secondary border-primary/30">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">Твій код</p>
                  <p className="text-4xl font-mono font-bold text-primary">{SECRET_CODE}</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setShowCertificate(false)}>
                Спробувати ще раз
              </Button>
              <Button asChild>
                <Link href="/">На головну</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Завдання 1: Курс долара та таблиці
            </h1>
            <p className="text-muted-foreground">8 клас • Google Таблиці</p>
          </div>
        </div>

        {/* Student info card */}
        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Учень</p>
                <p className="font-semibold text-foreground">
                  {studentSurname} {studentName} ({studentClass})
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Курс долара сьогодні</p>
                <p className="text-2xl font-bold text-primary">{exchangeRate} ₴ за 1$</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Таблиця товарів</CardTitle>
              <Button variant="outline" size="sm" onClick={copyTable} className="gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Скопійовано!" : "Копіювати таблицю"}
              </Button>
            </div>
            <CardDescription>
              15 товарів для розрахунку. Можна виділяти та копіювати текст з таблиці.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full select-text">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">№</th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Товар</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Ціна в грн</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Кількість</th>
                    <th className="text-right p-3 text-sm font-semibold text-primary">Ціна в $ (заповнюєш ти)</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-secondary/50 transition-colors select-text">
                      <td className="p-3 text-muted-foreground select-text">{index + 1}</td>
                      <td className="p-3 font-medium select-text">{product.name}</td>
                      <td className="p-3 text-right font-mono text-accent select-text">
                        {product.priceUAH.toLocaleString()} ₴
                      </td>
                      <td className="p-3 text-right select-text">{product.qty}</td>
                      <td className="p-3 text-right text-primary font-semibold select-text">?</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Instructions card */}
        <Card>
          <CardHeader>
            <CardTitle>Інструкція для Google Таблиць</CardTitle>
            <CardDescription>Покрокове виконання завдання</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold">Скопіюй таблицю</p>
                  <p className="text-sm text-muted-foreground">
                    Натисни кнопку "Копіювати таблицю" і вставляй дані в Google Таблиці
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold">Створи колонку "Ціна в $"</p>
                  <p className="text-sm text-muted-foreground">
                    В колонці E напиши формулу: <code className="bg-secondary px-1 py-0.5 rounded text-xs">=C2/{exchangeRate}</code>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold">Розтягни формулу</p>
                  <p className="text-sm text-muted-foreground">
                    Потягни за правий нижній кут комірки E2 вниз до E16
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  4
                </div>
                <div>
                  <p className="font-semibold">Порахуй суму в доларах</p>
                  <p className="text-sm text-muted-foreground">
                    В комірці E17 напиши: <code className="bg-secondary px-1 py-0.5 rounded text-xs">=SUM(E2:E16)</code>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                  5
                </div>
                <div>
                  <p className="font-semibold">Введи код на сайті</p>
                  <p className="text-sm text-muted-foreground">
                    Заокругли суму до цілого числа і введи в поле нижче
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer input card */}
        <Card>
          <CardHeader>
            <CardTitle>Введи свою відповідь</CardTitle>
            <CardDescription>Твій код - це сума в доларах (заокруглена до цілого числа)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Введи код (наприклад: 10000)"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="flex-1 font-mono text-lg"
              />
              <Button onClick={handleSubmit} disabled={!answer} className="gap-2">
                <Trophy className="w-4 h-4" />
                Перевірити
              </Button>
            </div>
            <Progress value={answer ? 50 : 0} className="h-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
