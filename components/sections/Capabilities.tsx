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

// Асимметрия: профиль — крупный модуль на две строки, должности и сигналы — узкие,
// экспорт — широкая полоса во всю ширину.
const MODULES: readonly Module[] = [
  {
    name: "Company Intelligence",
    text: "Структурированный профиль компании.",
    fragment: <ProfileFragment />,
    className: "md:col-span-2 lg:col-span-7 lg:row-span-2",
  },
  {
    name: "Decision Makers",
    text: "Поиск релевантных должностей.",
    fragment: <RolesFragment />,
    className: "lg:col-span-5",
  },
  {
    name: "Buying Signals",
    text: "Признаки потенциальной потребности.",
    fragment: <SignalsFragment />,
    className: "lg:col-span-5",
  },
  {
    name: "CRM-ready Export",
    text: "Копирование и экспорт информации.",
    fragment: <ExportFragment />,
    className: "md:col-span-2 lg:col-span-12",
    wide: true,
  },
];

/**
 * «Возможности» (ТЗ §5.6): четыре модуля разного размера. Анатомия карточки — как у
 * референса: название по центру сверху, фрагмент интерфейса в середине, подпись по центру снизу.
 */
export function Capabilities() {
  return (
    <section id={SECTIONS.features} aria-labelledby="features-title" className="border-b border-line">
      <div className="mx-auto flex max-w-page flex-col gap-12 px-gutter py-section lg:gap-16">
        <h2 id="features-title" className="text-section">
          Возможности
        </h2>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2 lg:grid-cols-12">
          {MODULES.map((m, i) => (
            <Reveal
              as="article"
              key={m.name}
              delay={(i % 2) * 0.08}
              className={`flex min-w-0 flex-col items-center gap-8 rounded-2xl bg-surface px-4 py-8 text-center sm:px-8 lg:py-10 ${m.className}`}
            >
              <h3
                className={`font-display font-semibold tracking-[-0.025em] ${i === 0 ? "text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-[1.05]" : "text-2xl"}`}
              >
                {m.name}
              </h3>
              <div className={`flex w-full flex-1 items-center text-left ${m.wide ? "max-w-[52rem]" : ""}`}>
                <div className="w-full">{m.fragment}</div>
              </div>
              <div className="flex max-w-[44ch] flex-col items-center gap-4">
                <p className="text-[0.9375rem] text-muted">{m.text}</p>
                {m.wide && (
                  <>
                    <p className="text-[0.9375rem] text-muted">
                      Профиль копируется текстом или скачивается CSV для русского Excel — поля совпадают с карточкой.
                    </p>
                    <Button href={`#${SECTIONS.demo}`} variant="ghost" size="sm">
                      Попробовать экспорт в демо
                    </Button>
                  </>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
