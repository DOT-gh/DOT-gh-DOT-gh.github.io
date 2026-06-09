import { createClient } from '@/lib/supabase/client'

export async function signInWithGoogle(nextPath = '/dashboard') {
  const supabase = createClient()
  const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`

  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })
}
