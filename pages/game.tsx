import dynamic from "next/dynamic";
import React, { useEffect, useRef } from "react";
import { Header } from "../src/components/Layout/Header";
import { TopRightHUD } from "../src/components/HUD/TopRightHUD";
import { BottomToolbar } from "../src/components/Toolbar/BottomToolbar";
import { useSimStore } from "../src/store/simStore";

const MapView = dynamic(() => import("../src/components/Map/MapView").then(m => m.MapView), { ssr: false });

export default function GamePage() {
  const frame = useSimStore(s => s.frame);
  const paused = useSimStore(s => s.hud.paused);
  const last = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      const prev = last.current ?? t;
      last.current = t;
      const dt = (t - prev) / 1000;
      frame(dt);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [frame, paused]);

  return (
    <main className="min-h-screen px-4 py-4 max-w-[1400px] mx-auto">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[70vh]">
        <div className="lg:col-span-3 h-[70vh]">
          <MapView />
        </div>
      </div>
      <TopRightHUD />
      <BottomToolbar />
    </main>
  );
}
