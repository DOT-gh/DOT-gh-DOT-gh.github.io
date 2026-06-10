"use client"

import { useState } from "react"
import { Play, RotateCcw, Terminal, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const SNIPPETS = [
  {
    label: "Привітання",
    code: `// Перша програма
const name = "Гість"
console.log("Привіт, " + name + "!")
console.log("Ласкаво просимо у світ коду")`,
  },
  {
    label: "Цикл",
    code: `// Таблиця множення на 7
for (let i = 1; i <= 5; i++) {
  console.log(7 + " x " + i + " = " + (7 * i))
}`,
  },
  {
    label: "Масиви",
    code: `// Робота з масивами
const marks = [10, 12, 8, 11, 9]
const sum = marks.reduce((a, b) => a + b, 0)
const avg = sum / marks.length
console.log("Оцінки:", marks.join(", "))
console.log("Середній бал:", avg.toFixed(1))`,
  },
  {
    label: "Функція",
    code: `// Перевірка парності
function isEven(n) {
  return n % 2 === 0 ? "парне" : "непарне"
}
for (const n of [3, 8, 15, 42]) {
  console.log(n + " — " + isEven(n))
}`,
  },
]

export function DemoCodePlayground() {
  const [code, setCode] = useState(SNIPPETS[0].code)
  const [output, setOutput] = useState<{ type: "log" | "error"; text: string }[]>([])
  const [hasRun, setHasRun] = useState(false)
  const [activeSnippet, setActiveSnippet] = useState(0)

  const run = () => {
    const logs: { type: "log" | "error"; text: string }[] = []
    const fakeConsole = {
      log: (...args: unknown[]) =>
        logs.push({
          type: "log",
          text: args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" "),
        }),
    }
    try {
      // Безпечне виконання в ізольованій функції (лише console.log)
      const fn = new Function("console", code)
      fn(fakeConsole)
      if (logs.length === 0) logs.push({ type: "log", text: "// Програма виконана без виводу" })
    } catch (err) {
      logs.push({ type: "error", text: "Помилка: " + (err as Error).message })
    }
    setOutput(logs)
    setHasRun(true)
  }

  const loadSnippet = (i: number) => {
    setActiveSnippet(i)
    setCode(SNIPPETS[i].code)
    setOutput([])
    setHasRun(false)
  }

  const lineCount = code.split("\n").length

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Заголовок «вкладки» как в редакторе */}
      <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-amber-500/70" />
          <span className="h-3 w-3 rounded-full bg-primary/70" />
        </div>
        <span className="ml-2 font-mono text-xs text-muted-foreground">main.js</span>
        <span className="ml-auto rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          JavaScript
        </span>
      </div>

      {/* Сниппеты-пресеты */}
      <div className="flex flex-wrap gap-1.5 border-b border-border bg-card px-3 py-2">
        {SNIPPETS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => loadSnippet(i)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeSnippet === i
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Редактор */}
      <div className="relative flex bg-[oklch(0.08_0_0)] font-mono text-sm">
        <div className="select-none border-r border-border px-3 py-3 text-right text-xs leading-6 text-muted-foreground/50">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="min-h-[180px] flex-1 resize-none bg-transparent px-3 py-3 leading-6 text-foreground outline-none"
          aria-label="Редактор коду"
        />
      </div>

      {/* Панель запуска */}
      <div className="flex items-center gap-2 border-t border-border bg-card px-3 py-2.5">
        <Button size="sm" onClick={run} className="gap-1.5">
          <Play className="h-3.5 w-3.5" />
          Запустити
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setOutput([])
            setHasRun(false)
          }}
          className="gap-1.5 text-muted-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Очистити
        </Button>
        <span className="ml-auto hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
          <Check className="h-3.5 w-3.5 text-primary" />
          Код виконується прямо у браузері
        </span>
      </div>

      {/* Консоль */}
      {hasRun && (
        <div className="border-t border-border bg-[oklch(0.06_0_0)] px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Terminal className="h-3.5 w-3.5" />
            Консоль
          </div>
          <div className="space-y-1 font-mono text-sm">
            {output.map((line, i) => (
              <div
                key={i}
                className={line.type === "error" ? "text-red-400" : "text-foreground/90"}
              >
                <span className="mr-2 select-none text-primary/60">›</span>
                {line.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
