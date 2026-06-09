import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { AppProvider } from "@/lib/store"
import { SnowfallWrapper } from "@/components/snowfall-wrapper"
import { DevToolsBlocker } from "@/components/dev-tools-blocker"
import { Toaster } from "@/components/ui/toaster"
import { AchievementToast } from "@/components/achievement-toast"
import EasterEggs from "@/components/easter-eggs"
import { SwRegistry } from "@/components/sw-registry" // Импорт регистратора
import "./globals.css"

const inter = Inter({ subsets: ["latin", "cyrillic"] })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
})

const THEME_COLOR = "#22c55e"

export const metadata: Metadata = {
  title: "Edu_Survival_Kit v.0.4 (Beta) | Навчання під час блекаутів",
  description: "Легка офлайн-платформа для навчання програмуванню під час відключень електроенергії",
  manifest: "/manifest.json",
  applicationName: "EduKit",
  appleWebApp: {
    capable: true,
    title: "EduKit",
    statusBarStyle: "black-translucent",
  },
  
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "EduKit",
    "format-detection": "telephone=no",
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLOR },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uk" className="dark">
      <head>
        <meta name="theme-color" content={THEME_COLOR} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EduKit" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${inter.className} ${jetbrainsMono.variable} font-sans antialiased`}>
        {/* <DevToolsBlocker /> Отключено для дебага */}
        <AppProvider>
          <SnowfallWrapper />
          {children}
          <Toaster />
          <AchievementToast />
          <EasterEggs />
        </AppProvider>
        <SwRegistry /> {/* Жесткий запуск Service Worker */}
        <script defer src="/_vercel/insights/script.js"></script>
      </body>
    </html>
  )
}