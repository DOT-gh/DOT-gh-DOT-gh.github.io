import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { AppProvider } from "@/lib/store"
import { SnowfallWrapper } from "@/components/snowfall-wrapper"
import { DevToolsBlocker } from "@/components/dev-tools-blocker"
import { Toaster } from "@/components/ui/toaster"
import { AchievementToast } from "@/components/achievement-toast"
import EasterEggs from "@/components/easter-eggs"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: "Edu_Survival_Kit v.0.4 (Beta) | Навчання під час блекаутів",
  description: "Легка офлайн-платформа для навчання програмуванню під час відключень електроенергії",
    generator: 'v0.app'
}

export const viewport = {
  themeColor: "#121212",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" className="dark">
      <body className={`${inter.className} ${jetbrainsMono.variable} font-sans antialiased`}>
        <DevToolsBlocker />
        <AppProvider>
          <SnowfallWrapper />
          {children}
          <Toaster />
          <AchievementToast />
          <EasterEggs />
        </AppProvider>
      </body>
    </html>
  )
}
