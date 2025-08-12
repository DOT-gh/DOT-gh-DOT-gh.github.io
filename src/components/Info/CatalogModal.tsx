import React from "react";
import { useSimStore } from "../../store/simStore";
import { star } from "../../engine/utils";

export const CatalogModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { catalog } = useSimStore();
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="card max-w-5xl w-full p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Каталог устройств</div>
          <button className="btn" onClick={onClose}>Закрыть</button>
        </div>
        <div className="grid md:grid-cols-2 gap-4 max-h-[70vh] overflow-auto">
          <div>
            <div className="font-semibold mb-2">ПВО</div>
            <div className="space-y-3">
              {catalog.defenses.map(d => (
                <div key={d.id} className="card p-3">
                  <div className="font-medium">{d.name}</div>
                  <div className="text-xs text-gray-400 mb-2">{d.info}</div>
                  <div className="text-xs">Дальность: {d.range_km} км • Стоимость: {d.cost}</div>
                  <div className="text-[10px] text-amber-400">{star(d.rating.range)} дальность</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2">Угрозы</div>
            <div className="space-y-3">
              {catalog.threats.map(t => (
                <div key={t.id} className="card p-3">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-gray-400 mb-2">{t.info}</div>
                  <div className="text-xs">Скорость: {t.speed_kmh} км/ч • Урон: {t.damage}</div>
                  <div className="text-[10px] text-amber-400">{star(t.rating.survivability)} живучесть</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-400">
          Данные — учебные и нормализованные. Для “реалистичного” режима импортируйте JSON (настройка будет добавлена).
        </div>
      </div>
    </div>
  );
};
