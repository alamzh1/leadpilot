"use client";

import { useEffect, useRef, useState } from "react";
import { ProfileCard } from "@/components/demo/ProfileCard";
import { StageRail } from "@/components/demo/StageRail";
import { PlateImage } from "@/components/story/PlateImage";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { DEMO_COMPANIES } from "@/lib/demo/companies";
import { PROFILE_FIELDS } from "@/lib/demo/profile";
import { asset } from "@/lib/site";

const COMPANY = DEMO_COMPANIES.find((c) => c.id === "vector-logistics") ?? DEMO_COMPANIES[1];
const QUERY = COMPANY.name;
const FIELDS = PROFILE_FIELDS.length;

/** Кадр живой рабочей области. */
type Frame = {
  typed: number; // сколько символов запроса напечатано
  stage: number; // -1 — этапы не начаты; 0..3 — идущий этап
  done: boolean;
  resolved: number; // verified-полей карточки
  ms: number; // сколько держать кадр
};

/**
 * Цикл: финальный кадр (он же — кадр без JS и при reduced-motion) → очистка →
 * печать «Vector Logistics» → четыре этапа, поля по одному становятся verified → снова финал.
 */
const FRAMES: Frame[] = (() => {
  const frames: Frame[] = [{ typed: QUERY.length, stage: 3, done: true, resolved: FIELDS, ms: 4200 }];
  frames.push({ typed: 0, stage: -1, done: false, resolved: 0, ms: 700 });
  for (let n = 1; n <= QUERY.length; n++) {
    frames.push({ typed: n, stage: -1, done: false, resolved: 0, ms: n === QUERY.length ? 420 : 75 });
  }
  // 11 полей на 4 этапа: этап k «открывает» свою долю полей.
  for (let r = 0; r <= FIELDS; r++) {
    const stage = Math.min(3, Math.floor((r * 4) / (FIELDS + 1)));
    frames.push({ typed: QUERY.length, stage, done: false, resolved: r, ms: r === 0 ? 520 : 240 });
  }
  return frames;
})();

/**
 * Живая рабочая область первого экрана: HTML-текст (поиск, этапы, карточка), под ней —
 * фоновое изображение с CSS-фолбэком. Цикл на паузе вне экрана и во скрытой вкладке;
 * при reduced-motion и без JS показан финальный кадр.
 */
export function HeroDesk() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Играть, только если блок на экране, вкладка видна и движение не ограничено.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const update = () => {
      const canPlay = inView && !document.hidden && !motionQuery.matches;
      setPlaying(canPlay);
      if (motionQuery.matches) setIndex(0);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting);
        update();
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    document.addEventListener("visibilitychange", update);
    motionQuery.addEventListener("change", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % FRAMES.length), FRAMES[index].ms);
    return () => clearTimeout(id);
  }, [playing, index]);

  const frame = FRAMES[index];
  const statusText = frame.done
    ? "профиль готов"
    : frame.stage >= 0
      ? `этап ${frame.stage + 1} из 4`
      : "ввод запроса";

  return (
    <div
      ref={rootRef}
      data-testid="hero-desk"
      data-playing={playing ? "true" : "false"}
      className="relative isolate"
    >
      {/* Подложка: изображение в полную силу, затемнён только узкий левый край; без файла — CSS-сетка. */}
      <div aria-hidden="true" className="hero-plate absolute -inset-x-6 -top-10 -bottom-10 -z-10 overflow-hidden lg:-left-16">
        {/* Статический экспорт: next/image без оптимизации, адаптивность — ручной srcset (spec, «Решения»). */}
        <PlateImage
          src={asset("/images/hero-plate-1280.webp")}
          srcSet={`${asset("/images/hero-plate-1280.webp")} 1280w, ${asset("/images/hero-plate.webp")} 1920w`}
          sizes="(min-width: 1024px) 60vw, 100vw"
          alt=""
          width={1920}
          height={1086}
          decoding="async"
          className="size-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-bg)_0%,transparent_20%)]" />
      </div>

      {/* Сама рабочая область — декоративная копия демо: скрыта от скринридеров, демо ниже доступно целиком. */}
      <div
        aria-hidden="true"
        className="border border-line-strong bg-bg/95 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5">
          <span className="min-w-0 font-mono text-[0.75rem] text-muted">
            leadpilot / <span className="text-text">AI RESEARCH WORKSPACE</span> / {COMPANY.id}
          </span>
          <span className="hidden shrink-0 items-center gap-2 font-mono text-[0.6875rem] text-muted sm:flex">
            <span className={frame.done ? "size-1.5 bg-lime" : "size-1.5 bg-cyan"} />
            {statusText}
          </span>
        </div>

        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex items-center gap-3 border border-line-strong bg-surface px-3 py-2.5">
            <PixelIcon name="search" size={16} className="shrink-0 text-muted" />
            <span className="min-w-0 truncate text-[0.9375rem]">
              {QUERY.slice(0, frame.typed)}
              <span className="px-caret ml-0.5" />
            </span>
            <span className="ml-auto hidden shrink-0 font-mono text-[0.6875rem] text-muted sm:inline">
              публичные источники
            </span>
          </div>

          <StageRail activeIndex={frame.stage} done={frame.done} compact />

          <ProfileCard company={COMPANY} resolvedCount={frame.resolved} compact />
        </div>
      </div>
    </div>
  );
}
