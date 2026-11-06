"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProfileCard } from "@/components/demo/ProfileCard";
import { StageRail } from "@/components/demo/StageRail";
import { PlateImage } from "@/components/story/PlateImage";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { DEMO_COMPANIES } from "@/lib/demo/companies";
import { PROFILE_FIELDS } from "@/lib/demo/profile";
import type { DemoCompanyId } from "@/lib/demo/types";
import { asset } from "@/lib/site";

const DEFAULT_ID: DemoCompanyId = "vector-logistics";
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
 * печать названия компании → четыре этапа, поля по одному становятся verified → снова финал.
 */
function buildFrames(query: string): Frame[] {
  const frames: Frame[] = [{ typed: query.length, stage: 3, done: true, resolved: FIELDS, ms: 4200 }];
  frames.push({ typed: 0, stage: -1, done: false, resolved: 0, ms: 500 });
  for (let n = 1; n <= query.length; n++) {
    frames.push({ typed: n, stage: -1, done: false, resolved: 0, ms: n === query.length ? 420 : 75 });
  }
  // 11 полей на 4 этапа: этап k «открывает» свою долю полей.
  for (let r = 0; r <= FIELDS; r++) {
    const stage = Math.min(3, Math.floor((r * 4) / (FIELDS + 1)));
    frames.push({ typed: query.length, stage, done: false, resolved: r, ms: r === 0 ? 520 : 240 });
  }
  return frames;
}

/** Кадр «очистка поля» — с него начинается печать нового названия после клика по чипу. */
const CLEAR_FRAME = 1;

/**
 * Живая рабочая область первого экрана на скруглённой подложке с изображением (CSS-фолбэк
 * без файла). Занимает оставшуюся высоту hero: окно показывает верх (путь, поиск, рельс,
 * первые строки карточки) и мягко срезано снизу (`.hero-window`). Поверх нижнего края — чипы трёх демо-компаний: клик переключает компанию,
 * и анимация печатает новое название. Цикл на паузе вне экрана и во скрытой вкладке;
 * при reduced-motion и без JS показан финальный кадр.
 */
export function HeroDesk({ className = "" }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(false);
  const [companyId, setCompanyId] = useState<DemoCompanyId>(DEFAULT_ID);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const company = DEMO_COMPANIES.find((c) => c.id === companyId) ?? DEMO_COMPANIES[1];
  const frames = useMemo(() => buildFrames(company.name), [company.name]);

  // Играть, только если блок на экране, вкладка видна и движение не ограничено.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const update = () => {
      reducedRef.current = motionQuery.matches;
      setPlaying(inView && !document.hidden && !motionQuery.matches);
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
    const id = setTimeout(() => setIndex((i) => (i + 1) % frames.length), frames[index].ms);
    return () => clearTimeout(id);
  }, [playing, index, frames]);

  function choose(id: DemoCompanyId) {
    if (id === companyId) return;
    setCompanyId(id);
    // Без ограничения движения — печатаем новое название с чистого поля; иначе сразу финал.
    setIndex(reducedRef.current ? 0 : CLEAR_FRAME);
  }

  const frame = frames[Math.min(index, frames.length - 1)];
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
      data-company={company.id}
      className={`relative flex flex-col ${className}`}
    >
      {/* Подложка-плитка: изображение в полную силу; без файла — CSS-сетка из палитры. */}
      <div className="hero-plate relative isolate flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl px-3 pt-[clamp(0.5rem,2.4svh,2.5rem)] pb-2.5 sm:rounded-3xl sm:px-8 sm:pb-[clamp(0.75rem,2.4svh,1.75rem)] lg:px-16">
        {/* Статический экспорт: next/image без оптимизации, адаптивность — ручной srcset. */}
        <PlateImage
          src={asset("/images/hero-plate-1280.webp")}
          srcSet={`${asset("/images/hero-plate-1280.webp")} 1280w, ${asset("/images/hero-plate.webp")} 1920w`}
          sizes="(min-width: 1280px) 1184px, 100vw"
          alt=""
          aria-hidden="true"
          width={1920}
          height={1086}
          decoding="async"
          className="absolute inset-0 -z-10 size-full object-cover"
        />

        {/* Сама рабочая область — декоративная копия демо: скрыта от скринридеров, демо ниже доступно целиком. */}
        <div
          aria-hidden="true"
          data-testid="hero-window"
          className="hero-window mx-auto flex min-h-0 w-full max-w-[56rem] flex-1 flex-col overflow-hidden rounded-xl border border-line-strong bg-bg/95 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)] sm:rounded-2xl"
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-3 py-1.5 sm:px-4 sm:py-2.5">
            <span className="min-w-0 truncate font-mono text-[0.6875rem] text-muted sm:text-[0.75rem] sm:whitespace-normal">
              leadpilot / <span className="text-text">AI RESEARCH WORKSPACE</span> / {company.id}
            </span>
            <span className="hidden shrink-0 items-center gap-2 font-mono text-[0.6875rem] text-muted sm:flex">
              <span className={frame.done ? "size-1.5 bg-lime" : "size-1.5 bg-cyan"} />
              {statusText}
            </span>
          </div>

          <div className="flex min-h-0 flex-col gap-2.5 p-2.5 sm:gap-4 sm:p-5">
            <div className="flex shrink-0 items-center gap-3 rounded-lg border border-line-strong bg-surface px-3 py-2 sm:py-2.5">
              <PixelIcon name="search" size={16} className="shrink-0 text-muted" />
              <span className="min-w-0 truncate text-[0.9375rem]">
                {company.name.slice(0, frame.typed)}
                <span className="px-caret ml-0.5" />
              </span>
              <span className="ml-auto hidden shrink-0 font-mono text-[0.6875rem] text-muted sm:inline">
                публичные источники
              </span>
            </div>

            <StageRail activeIndex={frame.stage} done={frame.done} compact className="shrink-0" />

            <ProfileCard company={company} resolvedCount={frame.resolved} compact />
          </div>
        </div>

        {/* Чипы компаний поверх нижнего края рабочей области — рабочие переключатели. */}
        <div
          role="group"
          aria-label="Компания в рабочей области"
          className="relative z-10 -mt-4 flex shrink-0 flex-nowrap justify-center gap-2 sm:-mt-6 sm:flex-wrap"
        >
          {DEMO_COMPANIES.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={c.id === company.id}
              aria-label={c.name}
              onClick={() => choose(c.id)}
              className="px-chip px-chip--lg font-display shadow-[0_8px_24px_-12px_rgb(0_0_0/0.8)] max-sm:min-h-9 max-sm:px-3.5 max-sm:py-2 max-sm:text-[0.8125rem]"
            >
              {/* На телефоне — первое слово, чтобы три чипа встали в одну строку. */}
              <span className="sm:hidden">{c.name.split(" ")[0]}</span>
              <span className="max-sm:hidden">{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
