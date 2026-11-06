import type { ReactNode } from "react";
import {
  ExportFragment,
  ProfileFragment,
  RolesFragment,
  SignalsFragment,
} from "@/components/story/CapabilityFragments";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SECTIONS } from "@/lib/site";

type Module = { name: string; text: string; fragment: ReactNode; className: string; wide?: boolean };

// Асимметрия на всю ширину (от 1024px): заголовок и крупный профиль — левая колонка,
// должности и сигналы — две разные по ширине карточки справа сверху, экспорт — широкая
// полоса справа снизу (текст слева, превью CSV справа). Всё — в высоту одного экрана.
const MODULES: readonly Module[] = [
  {
    name: "Company Intelligence",
    text: "Структурированный профиль компании.",
    fragment: <ProfileFragment />,
    className: "md:col-span-2 lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-2",
  },
  {
    name: "Decision Makers",
    text: "Поиск релевантных должностей.",
    fragment: <RolesFragment />,
    className: "lg:col-span-3 lg:col-start-6 lg:row-span-2 lg:row-start-1",
  },
  {
    name: "Buying Signals",
    text: "Признаки потенциальной потребности.",
    fragment: <SignalsFragment />,
    className: "lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1",
  },
  {
    name: "CRM-ready Export",
    text: "Копирование и экспорт информации.",
    fragment: <ExportFragment />,
    className: "md:col-span-2 lg:col-span-7 lg:col-start-6 lg:row-start-3",
    wide: true,
  },
];

/**
 * «Возможности» (ТЗ §5.6): четыре модуля разного размера в одной асимметричной сетке
 * во всю ширину. Анатомия карточки: название и подпись сверху, фрагмент интерфейса под ними;
 * у экспорта на десктопе текст слева, превью CSV справа.
 */
export function Capabilities() {
  return (
    <section id={SECTIONS.features} aria-labelledby="features-title" className="screen border-b border-line">
      <div className="grid w-full grid-cols-[minmax(0,1fr)] gap-6 px-gutter py-section md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto] lg:py-fold">
        <h2
          id="features-title"
          className="text-section max-lg:mb-6 md:col-span-2 lg:col-span-5 lg:row-start-1 lg:self-start"
        >
          Возможности
        </h2>
        {MODULES.map((m, i) => (
          <Reveal
            as="article"
            key={m.name}
            delay={(i % 2) * 0.08}
            className={`flex min-w-0 flex-col gap-6 rounded-2xl bg-surface px-4 py-6 sm:px-6 lg:gap-[clamp(0.75rem,1.8svh,1.25rem)] lg:p-[clamp(1rem,2.4svh,1.5rem)] ${m.wide ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-x-8" : ""} ${m.className}`}
          >
            <div className="flex flex-col gap-1.5">
              <h3
                className={`font-display font-semibold tracking-[-0.025em] ${i === 0 ? "text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-[1.05] lg:text-[clamp(1.5rem,0.6rem+1.6vw,2.5rem)]" : "text-2xl leading-tight"}`}
              >
                {m.name}
              </h3>
              <p className="max-w-[44ch] text-[0.9375rem] text-muted">{m.text}</p>
              {m.wide && (
                <>
                  <p className="mt-2 max-w-[44ch] text-[0.9375rem] text-muted">
                    Профиль копируется текстом или скачивается CSV для русского Excel — поля совпадают с карточкой.
                  </p>
                  <Button href={`#${SECTIONS.demo}`} variant="ghost" size="sm" className="mt-3 self-start">
                    Попробовать экспорт в демо
                  </Button>
                </>
              )}
            </div>
            <div className="flex w-full min-w-0 flex-1 items-center text-left">
              <div className="w-full">{m.fragment}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
