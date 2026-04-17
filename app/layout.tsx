import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { AppProvider } from "@/lib/store"
import { SnowfallWrapper } from "@/components/snowfall-wrapper"
import { Toaster } from "@/components/ui/toaster"
import { AchievementToast } from "@/components/achievement-toast"
import EasterEggs from "@/components/easter-eggs"
import { LowBatteryAlert } from "@/components/low-battery-alert"
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: "dotkit.me | Навчання програмуванню",
  description: "Інтерактивна платформа для навчання програмуванню під час блекаутів — для учнів 5–11 класів",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "dotkit.me",
  },
    generator: 'v0.app'
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#22c55e",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" className="dark">
      <head>
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.className} ${jetbrainsMono.variable} font-sans antialiased`}>
        <AppProvider>
          <SnowfallWrapper />
          {children}
          <Toaster />
          <AchievementToast />
          <EasterEggs />
          <LowBatteryAlert />
        </AppProvider>
      </body>
    </html>
  )
}
