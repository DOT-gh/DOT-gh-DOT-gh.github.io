"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Trophy, Copy, Check } from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"

export default function Grade8Page() {
  const [studentName, setStudentName] = useState("")
  const [studentSurname, setStudentSurname] = useState("")
  const [studentClass, setStudentClass] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(0)
  const [answer, setAnswer] = useState("")
  const [showCertificate, setShowCertificate] = useState(false)
  const [copied, setCopied] = useState(false)

  // Секретний код який має вийти (завжди однаковий)
  const SECRET_CODE = 10000

  // Товари - динамічні ціни розраховуються автоматично
  const [products, setProducts] = useState<Array<{ name: string; priceUAH: number; qty: number }>>([])

  useEffect(() => {
    // Перевіряємо чи є збережене ім'я
    const savedName = localStorage.getItem("grade8_student_name")
    const savedSurname = localStorage.getItem("grade8_student_surname")
    const savedClass = localStorage.getItem("grade8_student_class")
    const savedRate = localStorage.getItem("grade8_exchange_rate")
    const savedDate = localStorage.getItem("grade8_date")

    const today = new Date().toDateString()

    if (savedName && savedSurname && savedClass && savedRate && savedDate === today) {
      setStudentName(savedName)
      setStudentSurname(savedSurname)
      setStudentClass(savedClass)
      setIsLoggedIn(true)
      const rate = parseFloat(savedRate)
      setExchangeRate(rate)
      generateProducts(rate)
    }
  }, [])

  const generateExchangeRate = () => {
    // Генеруємо випадковий курс від 40 до 45 грн за долар
    return parseFloat((40 + Math.random() * 5).toFixed(2))
  }

  const generateProducts = (rate: number) => {
    // Базові товари
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

    // Розраховуємо ціни в гривнях так, щоб сума в доларах = SECRET_CODE
    const totalQty = baseProducts.reduce((sum, p) => sum + p.qty, 0)
    const pricePerUnitUSD = SECRET_CODE / totalQty

    const productsWithPrices = baseProducts.map((product) => ({
      ...product,
      priceUAH: parseFloat((pricePerUnitUSD * rate).toFixed(2)),
    }))

    setProducts(productsWithPrices)
  }

  const handleLogin = () => {
    if (studentName.trim().length < 2 || studentSurname.trim().length < 2 || studentClass.trim().length < 2) {
      alert("Будь ласка, заповни всі поля!")
      return
    }

    const rate = generateExchangeRate()
    setExchangeRate(rate)
    generateProducts(rate)

    localStorage.setItem("grade8_student_name", studentName)
    localStorage.setItem("grade8_student_surname", studentSurname)
    localStorage.setItem("grade8_student_class", studentClass)
    localStorage.setItem("grade8_exchange_rate", rate.toString())
    localStorage.setItem("grade8_date", new Date().toDateString())

    setIsLoggedIn(true)
  }

  const handleCheckAnswer = () => {
    const userAnswer = parseInt(answer)

    if (Math.abs(userAnswer - SECRET_CODE) <= 50) {
      confetti({
        particleCount: 300,
        spread: 160,
        origin: { y: 0.6 },
        colors: ["#4ade80", "#22c55e", "#16a34a", "#fbbf24", "#f59e0b"],
      })
      setShowCertificate(true)
    } else {
      alert(`❌ Неправильно! Перевір розрахунки. Підказка: відповідь має бути близько ${SECRET_CODE}`)
    }
  }

  const copyTable = () => {
    const tableData =
      "№\tТовар\tЦіна в грн\tКількість\n" +
      products.map((p, i) => `${i + 1}\t${p.name}\t${p.priceUAH.toFixed(2)}\t${p.qty}`).join("\n")

    navigator.clipboard.writeText(tableData)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            На головну
          </Link>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8">
            <h1 className="text-3xl font-bold text-green-400 mb-2">8 клас: Робота з таблицями</h1>
            <p className="text-gray-400 mb-8">Введи свої дані для початку роботи</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ім'я</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Олександр"
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Прізвище</label>
                <input
                  type="text"
                  value={studentSurname}
                  onChange={(e) => setStudentSurname(e.target.value)}
                  placeholder="Коваленко"
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Клас</label>
                <input
                  type="text"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  placeholder="8-А"
                  className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                Почати завдання
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showCertificate) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border-2 border-green-500 rounded-2xl p-8 text-center">
            <Trophy className="h-20 w-20 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-green-400 mb-4">Вітаємо!</h1>
            <p className="text-2xl text-white mb-2">
              {studentName} {studentSurname}
            </p>
            <p className="text-xl text-gray-300 mb-6">Клас: {studentClass}</p>
            <p className="text-lg text-gray-400 mb-8">
              Ти успішно виконав завдання з таблицями та курсом долара!
            </p>
            <div className="inline-block bg-yellow-500/20 border-2 border-yellow-500 rounded-xl px-8 py-4">
              <p className="text-sm text-yellow-400 mb-1">Твій код</p>
              <p className="text-3xl font-bold text-yellow-400">{SECRET_CODE}</p>
            </div>
            <div className="mt-8 space-x-4">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                Спробувати ще раз
              </button>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                На головну
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          На головну
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4">Завдання 1: Курс долара та таблиці</h1>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 mb-2">
              <span className="font-semibold">Учень:</span> {studentName} {studentSurname} ({studentClass})
            </p>
            <p className="text-yellow-400 text-lg font-semibold">
              Курс долара сьогодні: {exchangeRate.toFixed(2)} ₴ за 1$
            </p>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Таблиця товарів</h2>
            <button
              onClick={copyTable}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Скопійовано!" : "Копіювати таблицю"}
            </button>
          </div>

          <div className="overflow-x-auto select-text">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#21262d] border-b-2 border-green-500">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300 select-text">№</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300 select-text">Товар</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300 select-text">Ціна в грн</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300 select-text">Кількість</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-yellow-400 select-text">
                    Ціна в $ (заповнюєш ти)
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index} className="border-b border-[#30363d] hover:bg-[#21262d] transition-colors select-text">
                    <td className="px-4 py-3 text-gray-400 select-text">{index + 1}</td>
                    <td className="px-4 py-3 text-white select-text">{product.name}</td>
                    <td className="px-4 py-3 text-right text-blue-400 font-mono select-text">
                      {product.priceUAH.toFixed(2)} ₴
                    </td>
                    <td className="px-4 py-3 text-right text-gray-300 select-text">{product.qty}</td>
                    <td className="px-4 py-3 text-right text-yellow-400 select-text">?</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Інструкція виконання в Google Таблицях</h2>
          <div className="space-y-4 text-gray-300">
            <div className="bg-[#0d1117] rounded-lg p-4">
              <p className="font-semibold text-white mb-2">Крок 1: Створи нову таблицю</p>
              <p>Відкрий Google Таблиці та створи новий документ</p>
            </div>
            <div className="bg-[#0d1117] rounded-lg p-4">
              <p className="font-semibold text-white mb-2">Крок 2: Скопіюй дані</p>
              <p>Натисни кнопку "Копіювати таблицю" вище та вставити дані в Google Таблиці (Ctrl+V або Cmd+V)</p>
            </div>
            <div className="bg-[#0d1117] rounded-lg p-4">
              <p className="font-semibold text-white mb-2">Крок 3: Додай колонку "Ціна в $"</p>
              <p>У колонці E напиши формулу: =C2/{exchangeRate.toFixed(2)}</p>
              <p className="text-sm text-gray-400 mt-1">де C2 - це ціна в гривнях, а {exchangeRate.toFixed(2)} - курс долара</p>
            </div>
            <div className="bg-[#0d1117] rounded-lg p-4">
              <p className="font-semibold text-white mb-2">Крок 4: Скопіюй формулу</p>
              <p>Виділи комірку E2 та перетягни за куточок вниз до E16 (всі 15 товарів)</p>
            </div>
            <div className="bg-[#0d1117] rounded-lg p-4">
              <p className="font-semibold text-white mb-2">Крок 5: Розрахуй суму в доларах</p>
              <p>
                У комірці E17 напиши формулу: =SUMPRODUCT(E2:E16,D2:D16)
              </p>
              <p className="text-sm text-gray-400 mt-1">Ця формула помножить ціну в $ на кількість і підсумує все</p>
            </div>
            <div className="bg-[#0d1117] rounded-lg p-4">
              <p className="font-semibold text-white mb-2">Крок 6: Отримай код</p>
              <p>Округли результат в комірці E17 до цілого числа та введи його нижче</p>
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-green-500/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Введи свою відповідь</h2>
          <p className="text-gray-300 mb-4">Яка сума в доларах вийшла у тебе за всі товари з урахуванням кількості?</p>
          <div className="flex gap-4">
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Введи суму в доларах (ціле число)"
              className="flex-1 px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-colors"
            />
            <button
              onClick={handleCheckAnswer}
              disabled={!answer}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              Перевірити
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
