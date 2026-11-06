"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type ProcessStep = { name: string; text: string };

/**
 * Процесс Discover → Verify → Qualify: горизонтальный рельс от 1024px, вертикальный ниже.
 * Соединительная линия и маркеры появляются ступенчато (`steps()`), один раз.
 * По умолчанию всё нарисовано: «взводится» только то, что после гидратации ниже экрана,
 * и не взводится вовсе при prefers-reduced-motion.
 */
export function ProcessRail({ steps }: { steps: readonly ProcessStep[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    // Однократно при монтировании: прячем линию, только если блок ещё не на экране.
    if (el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ol
      ref={ref}
      className="t04-rail relative grid gap-12 lg:grid-cols-3 lg:gap-8"
      data-armed={armed ? "true" : undefined}
      data-shown={armed && inView ? "true" : undefined}
    >
      <span aria-hidden="true" className="t04-rail-line" />
      {steps.map((step, i) => (
        <li key={step.name} className="t04-rail-step relative pl-12 lg:pt-14 lg:pl-0" style={{ ["--i" as string]: i }}>
          <span aria-hidden="true" className={`t04-rail-marker t04-rail-marker--${i}`} />
          <div className="flex flex-col gap-3">
            <span className="font-mono text-data text-muted">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="font-display font-semibold text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-none tracking-[-0.03em]">
              {step.name}
            </h3>
            <p className="max-w-[34ch] text-muted">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
