"use client";

import { useInView, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { PixelIcon, type PixelIconName } from "@/components/ui/PixelIcon";

export type ProcessStep = { name: string; text: string; icon: PixelIconName };

type Props = {
  steps: readonly ProcessStep[];
  /** Заголовок секции — слева в шапке, справа от него переключатели шагов. */
  heading: ReactNode;
  /** Крупная плитка с изображением между шапкой и карточками. */
  media?: ReactNode;
};

/**
 * Процесс Discover → Verify → Qualify: шапка с чипами-переключателями и стрелками, под ней —
 * три скруглённые карточки на рельсе (горизонтально от 1024px, вертикально ниже).
 * Чип или стрелка подсвечивают активный шаг и прокручивают к нему.
 * Линия рельса и маркеры появляются ступенчато (`steps()`), один раз; по умолчанию всё
 * нарисовано, «взводится» только то, что после гидратации ниже экрана, и не при reduced-motion.
 */
export function ProcessRail({ steps, heading, media }: Props) {
  const ref = useRef<HTMLOListElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [armed, setArmed] = useState(false);
  const [active, setActive] = useState(0);
  const uid = useId();
  const listId = `${uid}-steps`;
  const stepId = (i: number) => `${uid}-step-${i}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    // Однократно при монтировании: прячем линию, только если блок ещё не на экране.
    if (el.getBoundingClientRect().top > window.innerHeight) setArmed(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function go(i: number) {
    const next = (i + steps.length) % steps.length;
    setActive(next);
    cardRefs.current[next]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  }

  return (
    <div className="flex flex-col gap-10 lg:gap-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        {heading}
        <div className="flex items-center justify-between gap-2 lg:justify-end">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Шаги процесса">
            {steps.map((step, i) => (
              <button
                key={step.name}
                type="button"
                aria-pressed={active === i}
                aria-controls={stepId(i)}
                onClick={() => go(i)}
                className="px-chip font-display"
              >
                {step.name}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 gap-2 lg:ml-4">
            <ArrowButton direction="prev" label="Предыдущий шаг" aria-controls={listId} onClick={() => go(active - 1)} className="max-sm:size-10" />
            <ArrowButton direction="next" label="Следующий шаг" aria-controls={listId} onClick={() => go(active + 1)} className="max-sm:size-10" />
          </div>
        </div>
      </div>

      {media}

      <ol
        ref={ref}
        id={listId}
        className="t04-rail relative grid gap-6 lg:grid-cols-3 lg:gap-5"
        data-armed={armed ? "true" : undefined}
        data-shown={armed && inView ? "true" : undefined}
      >
        <span aria-hidden="true" className="t04-rail-line" />
        {steps.map((step, i) => (
          <li
            key={step.name}
            id={stepId(i)}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            data-active={active === i ? "true" : undefined}
            className="t04-rail-step relative scroll-mt-[calc(var(--nav-h)+1rem)] pl-9 lg:pt-10 lg:pl-0"
            style={{ ["--i" as string]: i }}
          >
            <span aria-hidden="true" className={`t04-rail-marker t04-rail-marker--${i}`} />
            <div className="process-card flex min-h-56 flex-col justify-between gap-10 rounded-2xl border border-transparent bg-surface p-6 sm:p-7 lg:min-h-72">
              <div className="flex items-start justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-12 items-center justify-center rounded-lg bg-surface-2 text-text"
                >
                  <PixelIcon name={step.icon} size={24} />
                </span>
                <span className="font-mono text-data text-muted">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-display font-semibold text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] leading-none tracking-[-0.03em]">
                  {step.name}
                </h3>
                <p className="max-w-[34ch] text-[0.9375rem] text-muted">{step.text}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
