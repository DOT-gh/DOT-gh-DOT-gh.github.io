"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileSpreadsheet, FileText } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ExportDataProps {
  data: any
  filename: string
}

export function ExportData({ data, filename }: ExportDataProps) {
  const exportToCSV = () => {
    try {
      // Convert data to CSV
      const headers = Object.keys(data[0] || {}).join(",")
      const rows = data.map((row: any) => Object.values(row).join(","))
      const csv = [headers, ...rows].join("\n")

      // Create download link
      const blob = new Blob([csv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${filename}.csv`
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        variant: "success",
        title: "Експорт успішний",
        description: "Файл CSV завантажено",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Помилка експорту",
        description: "Не вдалось експортувати дані",
      })
    }
  }

  const exportToJSON = () => {
    try {
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: "application/json" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${filename}.json`
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        variant: "success",
        title: "Експорт успішний",
        description: "Файл JSON завантажено",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Помилка експорту",
        description: "Не вдалось експортувати дані",
      })
    }
  }

  const generatePDFReport = () => {
    toast({
      variant: "info",
      title: "Генерація PDF",
      description: "PDF-звіт генерується... (в розробці)",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Download className="h-4 w-4" />
          Експорт даних
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button onClick={exportToCSV} variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Експортувати в Excel (CSV)
        </Button>
        <Button onClick={exportToJSON} variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Експортувати в JSON
        </Button>
        <Button onClick={generatePDFReport} variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Генерувати PDF-звіт
        </Button>
      </CardContent>
    </Card>
  )
}
