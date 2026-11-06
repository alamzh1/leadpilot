import type { ReactNode } from "react";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { DEMO_COMPANIES } from "@/lib/demo/companies";
import type { DemoCompany } from "@/lib/demo/types";

/**
 * Конвейер Discover → Verify → Qualify на одной вымышленной компании (Vector Logistics):
 * каждый шаг показывает, что он делает с данными, и что передаёт следующему.
 * Голубой — ещё не проверено, лайм — подтверждено (Colour-Is-State).
 */
const company: DemoCompany =
  DEMO_COMPANIES.find((c) => c.id === "vector-logistics") ?? DEMO_COMPANIES[0];

type Finding = { kind: string; text: string; date: string; outdated?: boolean };

/**
 * Находки шага Discover: три источника профиля плюс одна устаревшая запись справочника,
 * которую отбрасывает Verify (численность из старой выгрузки; актуальная — в профиле).
 */
const FINDINGS: readonly Finding[] = [
  ...company.sources.map((s) => ({ kind: s.kind, text: s.title, date: s.date })),
  { kind: "Справочник компаний (демо)", text: "Штат 300–400 сотрудников", date: "2024-05", outdated: true },
];

export type PipelineStep = {
  name: "Discover" | "Verify" | "Qualify";
  /** Русская подпись одним словом. */
  label: string;
  text: string;
  /** Что шаг отдаёт следующему. */
  output: string;
};

/** Шапка мини-окна: путь в моно и пометка состояния. */
function Window({ path, state, children }: { path: string; state: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-line-strong bg-bg">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3.5 py-2 font-mono text-[0.6875rem] leading-4 text-muted">
        <span className="min-w-0 truncate">
          {company.id} / {path}
        </span>
        {state}
      </div>
      <div className="flex flex-1 flex-col justify-center p-3">{children}</div>
    </div>
  );
}

/** Discover: разрозненные находки из разных источников — голубой контур, без дат и проверки. */
function DiscoverFragment() {
  // Сдвиги и ширины разные — находки ещё не сведены в одну таблицу.
  const offsets = ["mr-6", "ml-5", "mr-2", "ml-9"];
  return (
    <Window
      path="discover"
      state={
        <span className="flex shrink-0 items-center gap-1.5 text-cyan">
          <span aria-hidden="true" className="size-1.5 border border-cyan" />
          не проверено
        </span>
      }
    >
      <ul className="flex flex-col gap-2">
        {FINDINGS.map((f, i) => (
          <li
            key={f.kind}
            className={`flex flex-col gap-0.5 px-3 py-2 outline outline-1 -outline-offset-1 outline-cyan/55 ${offsets[i % offsets.length]}`}
          >
            <span className="flex items-center gap-2 font-mono text-[0.6875rem] text-cyan">
              <span aria-hidden="true" className="size-1 shrink-0 bg-cyan" />
              <span className="truncate">{f.kind}</span>
            </span>
            <span className="truncate text-[0.8125rem] leading-snug text-text">{f.text}</span>
          </li>
        ))}
      </ul>
    </Window>
  );
}

/** Verify: те же находки с датами; подтверждённые — лаймовая галочка, устаревшая — зачёркнута. */
function VerifyFragment() {
  const confirmed = FINDINGS.filter((f) => !f.outdated).length;
  return (
    <Window
      path="verify"
      state={
        <span className="tabular flex shrink-0 items-center gap-1.5">
          <span aria-hidden="true" className="size-1.5 bg-lime" />
          {confirmed} из {FINDINGS.length}
        </span>
      }
    >
      <ul className="flex flex-col divide-y divide-line">
        {FINDINGS.map((f) => (
          <li
            key={f.kind}
            className="grid grid-cols-[16px_minmax(0,1fr)_auto] items-start gap-x-2.5 py-2 first:pt-0.5 last:pb-0.5"
          >
            {f.outdated ? (
              <span aria-hidden="true" className="mt-0.5 size-4 border border-dashed border-line-strong" />
            ) : (
              <PixelIcon name="check" size={16} className="mt-0.5 text-lime" />
            )}
            <span className="flex min-w-0 flex-col gap-0.5">
              <span
                className={`text-[0.8125rem] leading-snug ${f.outdated ? "text-muted line-through decoration-muted" : "text-text"}`}
              >
                {f.text}
              </span>
              <span className="truncate font-mono text-[0.6875rem] text-muted">{f.kind}</span>
            </span>
            <span className="flex flex-col items-end gap-0.5 font-mono text-[0.6875rem] leading-[1.45]">
              <span className={`tabular ${f.outdated ? "text-muted line-through" : "text-text"}`}>{f.date}</span>
              <span className={f.outdated ? "text-muted" : "text-lime"}>
                {f.outdated ? "устарело" : "подтверждено"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Window>
  );
}

/** Qualify: итог — кому писать и повод для контакта; поля подтверждены (лайм). */
function QualifyFragment() {
  const need = company.itNeeds[0];
  return (
    <Window
      path="profile"
      state={
        <span className="flex shrink-0 items-center gap-1.5">
          <span aria-hidden="true" className="size-1.5 bg-lime" />
          профиль готов
        </span>
      }
    >
      <dl className="grid gap-px overflow-hidden bg-line outline outline-1 -outline-offset-1 outline-lime/60">
        <QualifyCell label="Кому писать">
          <span className="flex items-center gap-2 font-heading text-[1.0625rem] font-[650] tracking-[-0.02em]">
            <PixelIcon name="role" size={16} className="shrink-0 text-lime" />
            {company.outreach.role}
          </span>
        </QualifyCell>
        <QualifyCell label="Повод для контакта">
          {company.outreach.reason}
        </QualifyCell>
        <QualifyCell label="IT-потребность">
          {need}
        </QualifyCell>
      </dl>
    </Window>
  );
}

function QualifyCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-bg px-3 py-2.5">
      <dt className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.04em] text-lime uppercase">
        <span aria-hidden="true" className="size-1 bg-lime" />
        {label}
      </dt>
      <dd className="mt-1.5 text-[0.8125rem] leading-snug">{children}</dd>
    </div>
  );
}

const FRAGMENTS = {
  Discover: DiscoverFragment,
  Verify: VerifyFragment,
  Qualify: QualifyFragment,
} as const;

/** Соединитель между шагами: на десктопе — в промежутке справа, ниже — под карточкой. */
function Connector() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute top-full left-1/2 flex h-10 w-8 -translate-x-1/2 flex-col items-center justify-center lg:top-1/2 lg:left-full lg:h-8 lg:w-10 lg:translate-x-0 lg:-translate-y-1/2 lg:flex-row"
    >
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line-strong lg:inset-x-0 lg:inset-y-auto lg:top-1/2 lg:left-0 lg:h-px lg:w-auto lg:translate-x-0 lg:-translate-y-1/2" />
      <span className="relative flex size-7 items-center justify-center rounded-md border border-line-strong bg-surface-2 text-text">
        <PixelIcon name="arrow" size={16} className="rotate-90 lg:rotate-0" />
      </span>
    </span>
  );
}

/** Три шага одним рядом (от 1024px) или столбцом, со стрелками-соединителями между ними. */
export function ProcessPipeline({ steps }: { steps: readonly PipelineStep[] }) {
  return (
    <ol className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
      {steps.map((step, i) => {
        const Mini = FRAGMENTS[step.name];
        return (
          <li key={step.name} className="relative flex">
            <article className="flex w-full flex-col gap-5 rounded-2xl bg-surface p-5 sm:p-6">
              <header className="flex flex-col gap-2">
                <span className="font-mono text-data text-muted">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] leading-none font-semibold tracking-[-0.03em]">
                    {step.name}
                  </h3>
                  <span className="text-[1rem] font-semibold text-muted">{step.label}</span>
                </div>
              </header>
              <p className="max-w-[40ch] text-[0.9375rem] leading-[1.55] text-muted lg:min-h-[4.65em]">{step.text}</p>
              <Mini />
              <p className="border-t border-line pt-4 text-[0.875rem] leading-snug">
                <span className="font-semibold text-text">На выходе:</span>{" "}
                <span className="text-muted">{step.output}</span>
              </p>
            </article>
            {i < steps.length - 1 && <Connector />}
          </li>
        );
      })}
    </ol>
  );
}
