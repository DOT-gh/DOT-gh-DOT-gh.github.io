import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-10 max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Defense Resource Simulation</h1>
        <p className="mt-3 text-gray-300 max-w-2xl">
          Абстрактная обучающая игра по распределению ограниченных ресурсов перехвата
          против волн разных типов угроз. Все параметры упрощены и не отражают
          реальные технические характеристики.
        </p>
        <div className="mt-6">
          <Link
            href="/game"
            className="inline-block px-6 py-3 rounded bg-indigo-600 hover:bg-indigo-500 font-medium"
          >
            Начать игру
          </Link>
        </div>
      </header>
      <section className="prose prose-invert max-w-none">
        <h2>Как играть</h2>
        <ol>
          <li>Каждая волна генерирует набор угроз разных уровней.</li>
          <li>В фазе планирования закупи перехватчики в рамках бюджета.</li>
          <li>Запусти перехват — система смоделирует результат.</li>
          <li>Старайся минимизировать прошедший урон и повысить счёт.</li>
        </ol>
        <h2>Принципы</h2>
        <ul>
          <li>Нет реалистичных скоростей/дальностей — только относительные параметры.</li>
          <li>Шанс перехвата агрегируется по слоям обороны.</li>
          <li>Бюджет пополняется каждый раунд.</li>
        </ul>
      </section>
      <footer className="mt-24 text-xs text-gray-500">
        Educational abstraction — no sensitive data.
      </footer>
    </main>
  );
}
