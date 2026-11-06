"use client";

import { useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

type Props = {
  /** Пока `true`, фрагменты сходятся; смена `key` у родителя перезапускает сборку. */
  active: boolean;
  /** Число 4px-фрагментов. */
  count?: number;
  /** Зерно раскладки: разные поля — разный рисунок, без Math.random (одинаково на сервере и клиенте). */
  seed?: number;
  className?: string;
};

/** Детерминированный псевдослучайный ряд 0..1. */
function rand(seed: number, i: number): number {
  const x = Math.sin(seed * 97.13 + i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/** Привязка к сетке 4px. */
function snap(px: number): number {
  return Math.round(px / 4) * 4;
}

/**
 * Сигнатура «пиксельная сборка»: голубые 4px-фрагменты ступенчато (steps)
 * сходятся в поле. Декоративна (`aria-hidden`); при reduced-motion не рисует ничего.
 */
export function PixelAssembly({ active, count = 14, seed = 1, className }: Props) {
  const reduced = useReducedMotion();
  if (!active || reduced) return null;

  const fragments = Array.from({ length: count }, (_, i) => {
    // Точка назначения — вдоль левой части поля, где появится текст.
    const left = 4 + rand(seed, i) * 70;
    const top = 18 + rand(seed + 3, i) * 64;
    // Старт — снаружи поля, по сетке 4px.
    const angle = rand(seed + 7, i) * Math.PI * 2;
    const dist = 28 + rand(seed + 11, i) * 56;
    const style = {
      left: `${left}%`,
      top: `${top}%`,
      "--dx": `${snap(Math.cos(angle) * dist)}px`,
      "--dy": `${snap(Math.sin(angle) * dist * 0.6)}px`,
      "--frag-delay": `${Math.round(rand(seed + 13, i) * 160)}ms`,
    } as CSSProperties;
    return <span key={i} className="px-frag" style={style} />;
  });

  return (
    <span
      aria-hidden="true"
      className={["pointer-events-none absolute inset-0 overflow-visible", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      {fragments}
    </span>
  );
}
