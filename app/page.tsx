import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Terminal, 
  Zap, 
  Shield, 
  BookOpen, 
  Trophy, 
  Users,
  ChevronRight,
  Sparkles,
  Code2,
  GraduationCap
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function LandingPage() {
  // Перевіряємо чи користувач вже авторизований
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Edu Survival Kit</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Beta</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Увійти</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Почати навчання</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Платформа для навчання програмуванню
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
            Вчись програмувати
            <br />
            <span className="text-primary">навіть під час блекаутів</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
            Інтерактивна платформа для учнів 8-11 класів з практичними завданнями, 
            геймфікацією та підтримкою офлайн-режиму
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-12 px-8 text-base gap-2" asChild>
              <Link href="/login">
                Розпочати безкоштовно
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link href="#features">Дізнатися більше</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Все що потрібно для навчання</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Сучасна платформа з усіма інструментами для ефективного вивчення програмування
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Інтерактивний редактор коду</h3>
                <p className="text-muted-foreground">
                  Пишіть код прямо в браузері з підсвіткою синтаксису та автодоповненням
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Офлайн режим</h3>
                <p className="text-muted-foreground">
                  Продовжуйте навчання навіть без інтернету. Ідеально для часів блекаутів
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Геймфікація</h3>
                <p className="text-muted-foreground">
                  Заробляйте XP, відкривайте досягнення та змагайтеся з однокласниками
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Структуровані курси</h3>
                <p className="text-muted-foreground">
                  Python, HTML/CSS, алгоритми та багато іншого. Від простого до складного
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Для вчителів</h3>
                <p className="text-muted-foreground">
                  Панель моніторингу прогресу учнів, статистика та управління завданнями
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Безпечно та приватно</h3>
                <p className="text-muted-foreground">
                  Вхід через Google. Ваші дані захищені та належать тільки вам
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100+</div>
              <p className="text-muted-foreground">Учнів</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Завдань</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">5</div>
              <p className="text-muted-foreground">Курсів</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Доступність</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Готові почати?</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Приєднуйтесь до сотень учнів, які вже вивчають програмування на нашій платформі
          </p>
          <Button size="lg" className="h-12 px-8 text-base gap-2" asChild>
            <Link href="/login">
              <Users className="w-4 h-4" />
              Приєднатися зараз
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="font-semibold">Edu Survival Kit</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2024-2026. Створено для учнів України
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
