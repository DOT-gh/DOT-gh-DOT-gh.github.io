import React from "react";
import { useSimStore } from "../../store/simStore";
import { CatalogModal } from "../Info/CatalogModal";

export const TopRightHUD: React.FC = () => {
  const hud = useSimStore(s => s.hud);
  const setPaused = useSimStore(s => s.setPaused);
  const setSpeed = useSimStore(s => s.setSpeed);
  const startWave = useSimStore(s => s.startWave);
  const [open, setOpen] = React.useState(false);

  return (
    <div className="fixed right-4 top-4 flex flex-col gap-2">
      <div className="card p-3 text-sm">
        <div className="flex items-center gap-4">
          <div>💰 {hud.money}</div>
          <div>✅ {hud.kills}</div>
          <div>❤️ {hud.lives}</div>
          <div>⭐ {hud.score}</div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <button className="btn" onClick={() => setPaused(!hud.paused)}>{hud.paused ? "▶️ Play" : "⏸ Pause"}</button>
          <div className="flex gap-1">
            <button className={`btn ${hud.speed===1?"bg-indigo-600":""}`} onClick={() => setSpeed(1)}>1x</button>
            <button className={`btn ${hud.speed===2?"bg-indigo-600":""}`} onClick={() => setSpeed(2)}>2x</button>
            <button className={`btn ${hud.speed===3?"bg-indigo-600":""}`} onClick={() => setSpeed(3)}>3x</button>
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <button className="btn-primary btn" onClick={() => startWave("mixed")}>Запустить волну</button>
          <button className="btn" onClick={() => startWave("swarm")}>Стаей</button>
          <button className="btn" onClick={() => startWave("missiles")}>Ракеты</button>
          <button className="btn" onClick={() => setOpen(true)}>Каталог (i)</button>
        </div>
      </div>
      {open && <CatalogModal onClose={() => setOpen(false)} />}
    </div>
  );
};
