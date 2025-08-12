import Link from "next/link";
import { Header } from "../src/components/Layout/Header";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-6 max-w-7xl mx-auto">
      <Header />
      <section className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight">Defense Resource Simulation</h1>
        <p className="mt-3 text-gray-300">
          Абстрактная стратегия на карте: размещай средства защиты, перехватывай волны угроз,
          управляй бюджетом и скоростью симуляции. Все параметры упрощены и безопасны.
        </p>
        <div className="mt-6">
          <Link href="/game" className="btn btn-primary">Начать игру</Link>
        </div>
      </section>
      <footer className="mt-24 text-xs text-gray-500">Educational abstraction — no sensitive data.</footer>
    </main>
  );
}
