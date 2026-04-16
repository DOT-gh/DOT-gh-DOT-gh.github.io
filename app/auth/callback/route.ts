import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  // Безпечне перенаправлення - тільки відносні шляхи що починаються з /
  const fallbackRedirectUrl = new URL('/dashboard', origin)
  const redirectUrl =
    next && next.startsWith('/')
      ? new URL(next, origin)
      : fallbackRedirectUrl

  // Захист від open-redirect атак
  if (redirectUrl.origin !== origin) {
    return NextResponse.redirect(fallbackRedirectUrl)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.redirect(new URL('/auth/error', origin))
}
