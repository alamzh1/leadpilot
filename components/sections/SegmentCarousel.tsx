"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowButton } from "@/components/ui/ArrowButton";
import type { Segment } from "./Audience";

/**
 * Ряд карточек сегментов: горизонтальная прокрутка со snap внутри колонки (страница
 * не прокручивается вбок) и пара стрелок, которые листают на одну карточку.
 */
export function SegmentCarousel({ segments }: { segments: readonly Segment[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const uid = useId();
  const scrollerId = `${uid}-segments`;

  const measure = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  function page(dir: 1 | -1) {
    const el = scrollerRef.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(card.parentElement!).columnGap) || 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        ref={scrollerRef}
        id={scrollerId}
        role="region"
        aria-label="Сегменты"
        tabIndex={0}
        className="relative -m-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-3xl p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max gap-5">
          {segments.map((s) => (
            <li
              key={s.name}
              className="flex w-[min(82vw,26rem)] shrink-0 snap-start flex-col justify-between gap-10 rounded-3xl bg-surface p-6 sm:p-8"
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] leading-[1.05] tracking-[-0.03em]">
                  {s.name}
                </h3>
                <p className="text-[1.0625rem] leading-snug text-muted">{s.text}</p>
              </div>
              <div className="flex flex-col gap-5">
                <p data-scenario className="text-[0.9375rem] leading-[1.6]">
                  <strong className="font-semibold text-text">{s.moment}</strong>{" "}
                  <span className="text-text/85">{s.scenario}</span>
                </p>
                <p className="flex flex-wrap items-center gap-1.5 font-mono text-data text-muted">
                  <span className="sr-only">Поля профиля для этого сценария:</span>
                  {s.uses.map((u) => (
                    <span key={u} className="rounded-lg bg-surface-2 px-2.5 py-1">
                      {u}
                    </span>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end gap-2">
        <ArrowButton
          direction="prev"
          label="Предыдущий сегмент"
          aria-controls={scrollerId}
          disabled={edge.start}
          onClick={() => page(-1)}
        />
        <ArrowButton
          direction="next"
          label="Следующий сегмент"
          aria-controls={scrollerId}
          disabled={edge.end}
          onClick={() => page(1)}
        />
      </div>
    </div>
  );
}
