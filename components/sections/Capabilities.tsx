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

type Module = { name: string; text: string; fragment: ReactNode; className: string; inner?: string };

// Асимметрия: профиль — крупный модуль на две строки, должности и сигналы — узкие,
// экспорт — широкая полоса с текстом и превью CSV рядом.
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
    inner: "lg:grid lg:grid-cols-12 lg:gap-8",
  },
];

/** «Возможности» (ТЗ §5.6): четыре модуля разного размера, в каждом — фрагмент интерфейса. */
export function Capabilities() {
  return (
    <section id={SECTIONS.features} aria-labelledby="features-title" className="border-b border-line">
      <div className="mx-auto flex max-w-page flex-col gap-12 px-gutter py-section lg:gap-16">
        <h2 id="features-title" className="text-section">
          Возможности
        </h2>
        {/* Модули разделены воздухом и одной верхней линией; рамка — только у фрагмента. */}
        <div className="grid grid-cols-[minmax(0,1fr)] gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-20">
          {MODULES.map((m, i) => (
            <Reveal as="article" key={m.name} delay={(i % 2) * 0.08} className={`min-w-0 border-t border-line pt-8 ${m.className}`}>
              <div className={`flex h-full flex-col gap-8 ${m.inner ?? ""}`}>
                <div className={`flex flex-col gap-2 ${m.inner ? "lg:col-span-4" : ""}`}>
                  <div className="flex flex-col gap-2">
                    <h3
                      className={`font-display font-semibold tracking-[-0.025em] ${i === 0 ? "text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-[1.05]" : "text-2xl"}`}
                    >
                      {m.name}
                    </h3>
                    <p className="text-muted">{m.text}</p>
                  </div>
                  {m.inner && (
                    <div className="mt-6 flex flex-col items-start gap-3">
                      <p className="max-w-[36ch] text-[0.9375rem] text-muted">
                        Профиль копируется текстом или скачивается CSV для русского Excel — поля совпадают с карточкой.
                      </p>
                      <Button href={`#${SECTIONS.demo}`} variant="ghost" size="sm">
                        Попробовать экспорт в демо
                      </Button>
                    </div>
                  )}
                </div>
                <div className={m.inner ? "lg:col-span-8" : ""}>{m.fragment}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
