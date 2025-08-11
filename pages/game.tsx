import { ThreatTable } from "../src/components/ThreatTable";
import { ThreatWaveView } from "../src/components/ThreatWaveView";
import { InterceptorPanel } from "../src/components/InterceptorPanel";
import { ControlBar } from "../src/components/ControlBar";
import { ScorePanel } from "../src/components/ScorePanel";
import Link from "next/link";

export default function GamePage() {
  return (
    <main className="min-h-screen px-6 py-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Wave Defense</h1>
        <Link href="/" className="text-sm text-indigo-400 hover:underline">
          На главную
        </Link>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ThreatWaveView />
          <InterceptorPanel />
          <ControlBar />
        </div>
        <div className="space-y-6">
          <ScorePanel />
          <ThreatTable />
        </div>
      </div>
    </main>
  );
}
