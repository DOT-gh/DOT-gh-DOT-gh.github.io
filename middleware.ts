import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Здесь в будущем будет твоя логика авторизации для /dashboard и т.д.
  // Сейчас мы просто пропускаем все запросы, которые не отфильтровал matcher
  return NextResponse.next()
}

// Этот блок блокирует запуск middleware для статики на аппаратном уровне Vercel
export const config = {
  matcher: [
    /*
     * Игнорируем:
     * - внутренние файлы Next.js (_next/static, _next/image)
     * - иконки (favicon.ico)
     * - Service Worker (sw.js)
     * - Манифест (manifest.json)
     * - Все картинки (svg, png, jpg и т.д.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sw\\.js|manifest\\.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}