"use client"

import type React from "react"

import { Play, Save, AlertCircle, Check, RotateCcw, Copy, CheckCheck, History, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppState } from "@/lib/store"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type TokenType = "keyword" | "string" | "number" | "comment" | "builtin" | "operator" | "normal"

interface Token {
  type: TokenType
  value: string
}

interface CodeHistory {
  id: string
  code: string
  timestamp: Date
}

interface AutocompleteOption {
  label: string
  insert: string
  description: string
}

const pythonAutocomplete: Record<string, AutocompleteOption[]> = {
  for: [
    {
      label: "for i in range()",
      insert: "for i in range(10):\n    ",
      description: "Базовий цикл з range",
    },
    {
      label: "for item in list",
      insert: "for item in items:\n    ",
      description: "Цикл по списку",
    },
    {
      label: "for i, item in enumerate()",
      insert: "for i, item in enumerate(items):\n    ",
      description: "Цикл з індексом",
    },
  ],
  if: [
    {
      label: "if condition:",
      insert: "if condition:\n    ",
      description: "Умова if",
    },
    {
      label: "if else:",
      insert: "if condition:\n    \nelse:\n    ",
      description: "Умова if-else",
    },
    {
      label: "if elif else:",
      insert: "if condition:\n    \nelif condition2:\n    \nelse:\n    ",
      description: "Умова if-elif-else",
    },
  ],
  def: [
    {
      label: "def function():",
      insert: "def function_name():\n    ",
      description: "Функція без параметрів",
    },
    {
      label: "def function(param):",
      insert: "def function_name(param):\n    ",
      description: "Функція з параметром",
    },
    {
      label: "def function() -> type:",
      insert: "def function_name() -> None:\n    ",
      description: "Функція з типом повернення",
    },
  ],
  while: [
    {
      label: "while condition:",
      insert: "while condition:\n    ",
      description: "Цикл while",
    },
  ],
  class: [
    {
      label: "class MyClass:",
      insert: "class MyClass:\n    def __init__(self):\n        ",
      description: "Базовий клас",
    },
  ],
  try: [
    {
      label: "try except:",
      insert: "try:\n    \nexcept Exception as e:\n    ",
      description: "Обробка помилок",
    },
  ],
}

function tokenizePython(code: string): Token[] {
  const tokens: Token[] = []
  const keywords = [
    "for",
    "in",
    "if",
    "else",
    "elif",
    "while",
    "def",
    "return",
    "import",
    "from",
    "as",
    "with",
    "class",
    "try",
    "except",
    "finally",
    "pass",
    "break",
    "continue",
    "and",
    "or",
    "not",
    "is",
    "lambda",
    "yield",
    "global",
    "nonlocal",
    "assert",
    "del",
  ]
  const builtins = [
    "print",
    "range",
    "len",
    "str",
    "int",
    "float",
    "list",
    "dict",
    "set",
    "tuple",
    "open",
    "input",
    "type",
    "True",
    "False",
    "None",
    "sum",
    "min",
    "max",
    "abs",
    "round",
    "sorted",
    "enumerate",
    "zip",
    "map",
    "filter",
  ]

  let i = 0
  while (i < code.length) {
    if (code[i] === "#") {
      let comment = ""
      while (i < code.length && code[i] !== "\n") {
        comment += code[i]
        i++
      }
      tokens.push({ type: "comment", value: comment })
      continue
    }

    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i]
      let str = quote
      i++
      while (i < code.length && code[i] !== quote) {
        str += code[i]
        i++
      }
      if (i < code.length) {
        str += code[i]
        i++
      }
      tokens.push({ type: "string", value: str })
      continue
    }

    if (code[i] === "f" && (code[i + 1] === '"' || code[i + 1] === "'")) {
      const quote = code[i + 1]
      let str = "f" + quote
      i += 2
      while (i < code.length && code[i] !== quote) {
        str += code[i]
        i++
      }
      if (i < code.length) {
        str += code[i]
        i++
      }
      tokens.push({ type: "string", value: str })
      continue
    }

    if (/\d/.test(code[i])) {
      let num = ""
      while (i < code.length && /[\d.]/.test(code[i])) {
        num += code[i]
        i++
      }
      tokens.push({ type: "number", value: num })
      continue
    }

    if (/[a-zA-Z_]/.test(code[i])) {
      let word = ""
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
        word += code[i]
        i++
      }
      if (keywords.includes(word)) {
        tokens.push({ type: "keyword", value: word })
      } else if (builtins.includes(word)) {
        tokens.push({ type: "builtin", value: word })
      } else {
        tokens.push({ type: "normal", value: word })
      }
      continue
    }

    if ("+-*/%=<>!&|^~:".includes(code[i])) {
      tokens.push({ type: "operator", value: code[i] })
      i++
      continue
    }

    tokens.push({ type: "normal", value: code[i] })
    i++
  }

  return tokens
}

function getTokenColor(type: TokenType): string {
  switch (type) {
    case "keyword":
      return "text-purple-400"
    case "string":
      return "text-green-400"
    case "number":
      return "text-amber-400"
    case "comment":
      return "text-zinc-500"
    case "builtin":
      return "text-cyan-400"
    case "operator":
      return "text-pink-400"
    default:
      return "text-foreground"
  }
}

function formatPythonCode(code: string): string {
  const lines = code.split("\n")
  let indentLevel = 0
  const formatted: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()

    // Зменшити відступ для else, elif, except, finally
    if (
      trimmed.startsWith("else:") ||
      trimmed.startsWith("elif ") ||
      trimmed.startsWith("except") ||
      trimmed.startsWith("finally:")
    ) {
      indentLevel = Math.max(0, indentLevel - 1)
    }

    // Додати відформатований рядок
    if (trimmed) {
      formatted.push("    ".repeat(indentLevel) + trimmed)
    } else {
      formatted.push("")
    }

    // Збільшити відступ після :
    if (trimmed.endsWith(":")) {
      indentLevel++
    }

    // Зменшити відступ після return, break, continue, pass
    if (
      trimmed === "return" ||
      trimmed.startsWith("return ") ||
      trimmed === "break" ||
      trimmed === "continue" ||
      trimmed === "pass"
    ) {
      indentLevel = Math.max(0, indentLevel - 1)
    }
  }

  return formatted.join("\n")
}

export function CodeEditor() {
  const { selectedTask, fontSize, code, setCode, consoleOutput, setConsoleOutput, completeTask, selectedCourse } =
    useAppState()
  const [copied, setCopied] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [localCode, setLocalCode] = useState("")
  const [history, setHistory] = useState<CodeHistory[]>([])
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutocompleteOption[]>([])
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedTask?.content) {
      setLocalCode(selectedTask.content)
      setCode(selectedTask.content)
      setHistory([{ id: Date.now().toString(), code: selectedTask.content, timestamp: new Date() }])
    } else if (code) {
      setLocalCode(code)
    }
  }, [selectedTask, code, setCode])

  useEffect(() => {
    const errorPatterns = [/for .+ in .+[^:]\s*$/m, /if .+[^:]\s*$/m, /while .+[^:]\s*$/m, /def .+\)[^:]/m]
    setHasError(errorPatterns.some((pattern) => pattern.test(localCode || "")))
  }, [localCode])

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    setLocalCode(newCode)
    setCode(newCode)

    // Зберегти в історію кожні 10 секунд
    const lastHistory = history[history.length - 1]
    if (!lastHistory || Date.now() - new Date(lastHistory.timestamp).getTime() > 10000) {
      setHistory((prev) => [...prev, { id: Date.now().toString(), code: newCode, timestamp: new Date() }].slice(-20))
    }

    // Автодоповнення
    const cursorPos = e.target.selectionStart
    const textBeforeCursor = newCode.substring(0, cursorPos)
    const lastWord = textBeforeCursor.split(/\s+/).pop() || ""

    if (pythonAutocomplete[lastWord]) {
      setAutocompleteOptions(pythonAutocomplete[lastWord])
      setShowAutocomplete(true)

      // Позиція автодоповнення
      const textarea = textareaRef.current
      if (textarea) {
        const lines = textBeforeCursor.split("\n")
        const currentLine = lines.length
        const currentCol = lines[lines.length - 1].length
        setCursorPosition({
          top: currentLine * 22,
          left: currentCol * 8 + 50,
        })
      }
    } else {
      setShowAutocomplete(false)
    }
  }

  const handleAutocompleteSelect = (option: AutocompleteOption) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const cursorPos = textarea.selectionStart
    const textBefore = localCode.substring(0, cursorPos)
    const textAfter = localCode.substring(cursorPos)

    // Видалити останнє слово
    const lastWordMatch = textBefore.match(/\S+$/)
    const newTextBefore = lastWordMatch
      ? textBefore.substring(0, textBefore.length - lastWordMatch[0].length)
      : textBefore

    const newCode = newTextBefore + option.insert + textAfter
    setLocalCode(newCode)
    setCode(newCode)
    setShowAutocomplete(false)

    toast({
      variant: "info",
      title: "Код вставлено",
      description: option.description,
    })
  }

  const handleFormat = () => {
    const formatted = formatPythonCode(localCode)
    setLocalCode(formatted)
    setCode(formatted)
    toast({
      variant: "success",
      title: "Код відформатовано",
      description: "Додано правильні відступи",
    })
  }

  const restoreFromHistory = (historyItem: CodeHistory) => {
    setLocalCode(historyItem.code)
    setCode(historyItem.code)
    toast({
      variant: "info",
      title: "Відновлено з історії",
      description: `Версія від ${new Date(historyItem.timestamp).toLocaleTimeString()}`,
    })
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    setConsoleOutput([...(consoleOutput || []), "", "[Система] Вставка заборонена. Набирайте код вручну."])
    toast({
      variant: "warning",
      title: "Вставка заборонена",
      description: "Набирайте код вручну для кращого засвоєння матеріалу",
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(localCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      variant: "info",
      title: "Код скопійовано",
      description: "Код збережено в буфер обміну",
    })
  }

  const handleReset = () => {
    if (selectedTask?.content) {
      setLocalCode(selectedTask.content)
      setCode(selectedTask.content)
      setConsoleOutput([])
      toast({
        variant: "info",
        title: "Код скинуто",
        description: "Відновлено початковий код завдання",
      })
    }
  }

  const handleRun = () => {
    setIsRunning(true)
    setConsoleOutput([">>> Запуск програми..."])

    setTimeout(() => {
      if (hasError) {
        setConsoleOutput([
          ">>> Запуск програми...",
          "",
          "SyntaxError: invalid syntax",
          '  File "task.py", line 3',
          "    for i in range(1, 11)",
          "                        ^",
          "SyntaxError: expected ':'",
          "",
          ">>> Виконання завершено з помилкою",
        ])
        toast({
          variant: "destructive",
          title: "Помилка виконання",
          description: "Знайдено синтаксичну помилку в коді",
        })
      } else {
        const successOutput = [">>> Запуск програми...", "", "Привіт, світ!", "", ">>> Виконання завершено успішно"]
        setConsoleOutput(successOutput)

        if (selectedTask && selectedCourse && !selectedTask.completed) {
          completeTask(selectedCourse.id, selectedTask.id)
          toast({
            variant: "success",
            title: "Завдання виконано!",
            description: `Ви отримали +100 XP`,
          })
        } else {
          toast({
            variant: "success",
            title: "Код виконано успішно",
            description: "Програма працює без помилок",
          })
        }
      }
      setIsRunning(false)
    }, 1500)
  }

  const handleSave = () => {
    setConsoleOutput([...(consoleOutput || []), "", "[Локальне сховище] Код збережено успішно"])
    toast({
      variant: "success",
      title: "Код збережено",
      description: "Ваш прогрес автоматично збережено",
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab = 4 spaces
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newCode = localCode.substring(0, start) + "    " + localCode.substring(end)
      setLocalCode(newCode)
      setCode(newCode)

      // Встановити курсор після вставлених пробілів
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4
      }, 0)
    }

    // Ctrl+/ для коментування
    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const lines = localCode.split("\n")

      // Знайти рядки для коментування
      const startLine = localCode.substring(0, start).split("\n").length - 1
      const endLine = localCode.substring(0, end).split("\n").length - 1

      // Перевірити чи всі рядки вже закоментовані
      let allCommented = true
      for (let i = startLine; i <= endLine; i++) {
        if (!lines[i].trim().startsWith("#")) {
          allCommented = false
          break
        }
      }

      // Додати або видалити коментарі
      for (let i = startLine; i <= endLine; i++) {
        if (allCommented) {
          lines[i] = lines[i].replace(/^\s*#\s?/, "")
        } else {
          lines[i] = "# " + lines[i]
        }
      }

      const newCode = lines.join("\n")
      setLocalCode(newCode)
      setCode(newCode)

      toast({
        variant: "info",
        title: allCommented ? "Коментарі видалено" : "Коментарі додано",
      })
    }
  }

  const safeConsoleOutput = consoleOutput || []
  const codeLines = (localCode || "").split("\n")
  const safeFontSize = fontSize || 14

  const renderHighlightedLine = (line: string) => {
    const tokens = tokenizePython(line)
    return tokens.map((token, i) => (
      <span key={i} className={getTokenColor(token.type)}>
        {token.value}
      </span>
    ))
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden min-w-0">
      {/* Editor header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-2 sm:px-4 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-1.5 shrink-0">
            <span className="h-3 w-3 rounded-full bg-destructive/70" />
            <span className="h-3 w-3 rounded-full bg-amber-500/70" />
            <span className="h-3 w-3 rounded-full bg-primary/70" />
          </div>
          <span className="ml-2 font-mono text-xs text-muted-foreground truncate">
            task_
            {String(selectedTask?.id || "00")
              .replace(/[^0-9]/g, "")
              .padStart(2, "0")}
            _file.py
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {hasError ? (
            <div className="flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="font-mono text-xs text-destructive hidden sm:inline">SyntaxError</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs text-primary hidden sm:inline">Ready</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden bg-background">
        {/* Line numbers */}
        <div
          className="absolute left-0 top-0 h-full w-8 sm:w-12 select-none overflow-hidden border-r border-border/50 bg-card/50 pt-4 font-mono"
          style={{ fontSize: `${safeFontSize}px` }}
        >
          {codeLines.map((_, i) => (
            <div key={i} className="px-1 sm:px-3 text-right text-muted-foreground" style={{ lineHeight: "1.5em" }}>
              {i + 1}
            </div>
          ))}
        </div>

        {/* Highlighted code background */}
        <div
          ref={highlightRef}
          className="pointer-events-none absolute inset-0 overflow-auto pl-10 sm:pl-14 pr-2 sm:pr-4 pt-4 font-mono"
          style={{ fontSize: `${safeFontSize}px`, lineHeight: "1.5em" }}
          aria-hidden="true"
        >
          {codeLines.map((line, i) => (
            <div key={i} className="whitespace-pre">
              {renderHighlightedLine(line) || " "}
            </div>
          ))}
        </div>

        {/* Editable textarea */}
        <textarea
          ref={textareaRef}
          value={localCode}
          onChange={handleCodeChange}
          onScroll={handleScroll}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 resize-none bg-transparent pl-10 sm:pl-14 pr-2 sm:pr-4 pt-4 font-mono text-transparent caret-foreground outline-none selection:bg-primary/30"
          style={{ fontSize: `${safeFontSize}px`, lineHeight: "1.5em" }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />

        {/* Autocomplete dropdown */}
        {showAutocomplete && (
          <div
            className="absolute z-10 w-64 rounded-md border border-border bg-popover p-2 shadow-lg"
            style={{
              top: `${cursorPosition.top}px`,
              left: `${cursorPosition.left}px`,
            }}
          >
            {autocompleteOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => handleAutocompleteSelect(option)}
                className="w-full rounded px-2 py-1.5 text-left text-sm hover:bg-accent"
              >
                <div className="font-mono text-primary">{option.label}</div>
                <div className="text-xs text-muted-foreground">{option.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Console output */}
      {safeConsoleOutput.length > 0 && (
        <div className="max-h-24 sm:max-h-32 overflow-auto border-t border-border bg-[#0a0a0a] p-2 sm:p-3 font-mono text-xs">
          {safeConsoleOutput.map((line, i) => (
            <div
              key={i}
              className={cn(
                "whitespace-pre-wrap",
                line.includes("Error") && "text-destructive",
                line.includes("успішно") && "text-primary",
                line.includes("заборонена") && "text-amber-500",
                line.startsWith(">>>") && "text-muted-foreground",
                !line.includes("Error") &&
                  !line.includes("успішно") &&
                  !line.includes("заборонена") &&
                  !line.startsWith(">>>") &&
                  "text-foreground",
              )}
            >
              {line || "\u00A0"}
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between border-t border-border bg-card px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            className="gap-1 sm:gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-3 sm:px-4"
            onClick={handleRun}
            disabled={isRunning}
            size="sm"
          >
            <Play className={cn("h-4 w-4", isRunning && "animate-pulse")} />
            <span className="font-mono text-xs sm:inline hidden">Запустити</span>
          </Button>
          <Button variant="secondary" className="gap-1 sm:gap-2 px-3 sm:px-4" onClick={handleSave} size="sm">
            <Save className="h-4 w-4" />
            <span className="font-mono text-xs sm:inline hidden">Зберегти</span>
          </Button>
          <Button
            variant="outline"
            className="gap-1 sm:gap-2 px-3 sm:px-4 bg-transparent"
            onClick={handleFormat}
            size="sm"
          >
            <Wand2 className="h-4 w-4" />
            <span className="font-mono text-xs sm:inline hidden">Форматувати</span>
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <History className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Історія змін</h4>
                <div className="max-h-64 space-y-1 overflow-auto">
                  {history.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Немає збережених версій</p>
                  ) : (
                    history.reverse().map((item) => (
                      <button
                        key={item.id}
                        onClick={() => restoreFromHistory(item)}
                        className="w-full rounded px-2 py-1.5 text-left text-xs hover:bg-accent"
                      >
                        <div className="font-mono text-primary">{new Date(item.timestamp).toLocaleTimeString()}</div>
                        <div className="truncate text-muted-foreground">{item.code.substring(0, 50)}...</div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
            {copied ? <CheckCheck className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  )
}
