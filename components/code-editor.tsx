"use client"

import type React from "react"

import { Play, Save, AlertCircle, Check, RotateCcw, Copy, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppState } from "@/lib/store"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// ... existing code (tokenizePython and getTokenColor functions) ...

type TokenType = "keyword" | "string" | "number" | "comment" | "builtin" | "operator" | "normal"

interface Token {
  type: TokenType
  value: string
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

export function CodeEditor() {
  const { currentTask, code, setCode, consoleOutput, setConsoleOutput, fontSize } = useAppState()
  const [copied, setCopied] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [localCode, setLocalCode] = useState(code)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalCode(code)
  }, [code])

  useEffect(() => {
    const errorPatterns = [/for .+ in .+[^:]\s*$/m, /if .+[^:]\s*$/m, /while .+[^:]\s*$/m, /def .+\)[^:]/m]
    setHasError(errorPatterns.some((pattern) => pattern.test(localCode)))
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
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    setConsoleOutput((prev) => [...prev, "", "[Система] Вставка заборонена. Набирайте код вручну."])
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(localCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    if (currentTask) {
      setLocalCode(currentTask.code)
      setCode(currentTask.code)
      setConsoleOutput([])
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
          '  File "task_03_loops.py", line 3',
          "    for i in range(1, 11)",
          "                        ^",
          "SyntaxError: expected ':'",
          "",
          ">>> Виконання завершено з помилкою",
        ])
      } else {
        const output = [">>> Запуск програми...", ""]
        if (currentTask?.expectedOutput) {
          output.push(currentTask.expectedOutput)
        }
        output.push("", ">>> Виконання завершено успішно")
        setConsoleOutput(output)
      }
      setIsRunning(false)
    }, 1500)
  }

  const handleSave = () => {
    setConsoleOutput((prev) => [...prev, "", "[Локальне сховище] Код збережено успішно"])
  }

  const codeLines = localCode.split("\n")

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
            task_{String(currentTask?.id || 0).padStart(2, "0")}_
            {currentTask?.title.toLowerCase().replace(/\s+/g, "_") || "file"}.py
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
          style={{ fontSize: `${fontSize}px` }}
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
          style={{ fontSize: `${fontSize}px`, lineHeight: "1.5em" }}
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
          className="absolute inset-0 resize-none bg-transparent pl-10 sm:pl-14 pr-2 sm:pr-4 pt-4 font-mono text-transparent caret-foreground outline-none selection:bg-primary/30"
          style={{ fontSize: `${fontSize}px`, lineHeight: "1.5em" }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>

      {/* Console output */}
      {consoleOutput.length > 0 && (
        <div className="max-h-24 sm:max-h-32 overflow-auto border-t border-border bg-[#0a0a0a] p-2 sm:p-3 font-mono text-xs">
          {consoleOutput.map((line, i) => (
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

      {/* Action buttons - Better mobile layout */}
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
        </div>
        <div className="flex items-center gap-1">
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
