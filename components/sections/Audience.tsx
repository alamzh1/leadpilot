import type { ReactNode } from "react";
import { PixelIcon, type PixelIconName } from "@/components/ui/PixelIcon";
import { DEMO_COMPANIES } from "@/lib/demo/companies";
import type { DemoCompany, DemoCompanyId } from "@/lib/demo/types";
import { SECTIONS } from "@/lib/site";

const byId = (id: DemoCompanyId): DemoCompany => DEMO_COMPANIES.find((c) => c.id === id) ?? DEMO_COMPANIES[0];
const vector = byId("vector-logistics");
const northstar = byId("northstar-bank");
const atlas = byId("atlas-commerce");

const signal = (c: DemoCompany, label: string) => c.signals.find((s) => s.label === label)?.detail ?? "";

/**
 * Ячейка профиля: 4px лаймовый квадрат (проверено), моно-ключ, значение; `wide` — на всю ширину;
 * `short` — ячейка скрывается на низком окне десктопа, чтобы блок помещался в один экран.
 */
type Field = { key: string; value: ReactNode; wide?: boolean; short?: boolean };

type Segment = {
  id: `audience-${string}`;
  name: string;
  /** Задача — дословно из ТЗ §5.7. */
  text: string;
  who: string;
  result: string;
  moment: string;
  scenario: string;
  company: DemoCompany;
  fields: readonly Field[];
};

function Role({ role }: { role: string }) {
  return (
    <span className="flex items-center gap-2 font-heading text-[1rem] font-[650] tracking-[-0.02em]">
      <PixelIcon name="role" size={16} className="shrink-0 text-lime" />
      {role}
    </span>
  );
}

/**
 * У каждого сегмента свой мини-визуал из полей профиля своей демо-компании:
 * IT-аутсорсинг — сигналы роста списком, B2B-продажи — адресат и повод письма,
 * агентства — потребности тегами и источники с датами.
 */
const SEGMENTS: readonly Segment[] = [
  {
    id: "audience-outsourcing",
    name: "IT-аутсорсинг",
    text: "Поиск компаний с растущими техническими командами.",
    who: "аккаунт-менеджер или руководитель продаж IT-компании",
    result: "список компаний, которым сейчас нужна команда",
    moment: "Планирование недели.",
    scenario:
      "Аккаунт-менеджер ищет, кому предложить выделенную команду. В профиле логистического оператора видны новые склады, вакансии мобильных разработчиков и открытый API — понятно, с чем команде может понадобиться помощь.",
    company: vector,
    fields: [
      { key: "Вакансии", value: signal(vector, "Вакансии"), wide: true },
      { key: "Расширение", value: signal(vector, "Расширение"), wide: true, short: true },
      { key: "IT-потребность", value: vector.itNeeds[1], wide: true },
    ],
  },
  {
    id: "audience-sales",
    name: "B2B-продажи",
    text: "Подготовка к первому контакту.",
    who: "SDR и менеджер по продажам",
    result: "первое письмо с поводом и адресатом",
    moment: "Утро SDR.",
    scenario:
      "В списке на сегодня — региональный банк. Вместо десятка вкладок — один профиль: IT-проекты, должность, отвечающая за безопасность, и повод для первого письма с источниками и датами.",
    company: northstar,
    fields: [
      { key: "Кому писать", value: <Role role={northstar.outreach.role} /> },
      { key: "Сигнал", value: "Тендер на аудит безопасности" },
      { key: "Повод для контакта", value: northstar.outreach.reason, wide: true, short: true },
      { key: "IT-проект", value: northstar.itNeeds[0], wide: true },
    ],
  },
  {
    id: "audience-agencies",
    name: "Агентства",
    text: "Исследование компаний перед персонализированным предложением.",
    who: "стратег или аккаунт-директор агентства",
    result: "предложение под задачу конкретной компании",
    moment: "Перед брифом.",
    scenario:
      "Агентство готовит предложение интернет-магазину, который запускает маркетплейс. Профиль собирает планы, вакансии и сайт — и предложение строится вокруг их задачи, а не шаблонного слайда с услугами.",
    company: atlas,
    fields: [
      {
        key: "IT-потребности",
        wide: true,
        value: (
          <ul className="flex flex-wrap gap-1.5">
            {atlas.itNeeds.slice(0, 3).map((need) => (
              <li key={need} className="rounded-md border border-line-strong px-2 py-0.5 text-[0.75rem] leading-5">
                {need}
              </li>
            ))}
          </ul>
        ),
      },
      {
        key: "Источники",
        wide: true,
        short: true,
        value: (
          <ul className="flex flex-col font-mono text-[0.6875rem] text-muted">
            {atlas.sources.slice(0, 3).map((s) => (
              <li key={s.kind} className="flex justify-between gap-3 border-t border-line py-1 first:border-t-0 first:pt-0">
                <span className="truncate">{s.kind}</span>
                <span className="tabular shrink-0 text-text">{s.date}</span>
              </li>
            ))}
          </ul>
        ),
      },
    ],
  },
];

/** Мини-визуал: ячейки профиля в `gap-px`-сетке на линии, как в карточке демо. */
function ProfileSnippet({ segment }: { segment: Segment }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line-strong bg-bg">
      {/* Хром окна — до 1024px; на десктопе пометка «демо» стоит в строке «Что смотрит в профиле». */}
      <p className="flex items-center justify-between gap-3 border-b border-line px-3.5 py-2 font-mono text-[0.6875rem] leading-4 text-muted lg:hidden">
        <span className="min-w-0 truncate">{segment.company.id} / profile</span>
        <span className="shrink-0 rounded-sm border border-line-strong px-1.5">демо</span>
      </p>
      <dl className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-px bg-line">
        {segment.fields.map((f) => (
          <div key={f.key} className={`min-w-0 bg-surface px-3.5 py-3 lg:py-[clamp(0.375rem,1.1svh,0.75rem)] ${f.wide ? "col-span-full" : ""} ${f.short ? "short:hidden" : ""}`}>
            <dt className="flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.04em] text-muted uppercase">
              <span aria-hidden="true" className="size-1 shrink-0 bg-lime" />
              {f.key}
            </dt>
            <dd className="mt-1 min-w-0 text-[0.8125rem] leading-[1.35]">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Row({ icon, label, text, tag }: { icon: PixelIconName; label: string; text?: string; tag?: string }) {
  return (
    <div className="grid grid-cols-[28px_minmax(0,1fr)] items-start gap-3">
      <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-md bg-surface-2 text-text">
        <PixelIcon name={icon} size={16} />
      </span>
      <p className="pt-0.5 text-[0.9375rem] leading-snug lg:leading-[1.3]">
        <span className="font-semibold text-text">{label}</span>
        {text && <span className="text-muted"> {text}</span>}
        {tag && (
          <span className="ml-2 hidden rounded-sm border border-line-strong px-1.5 align-[0.1em] font-mono text-[0.6875rem] leading-4 font-normal text-muted lg:inline-block">
            {tag}
          </span>
        )}
      </p>
    </div>
  );
}

/**
 * «Для кого» (ТЗ §5.7): шапка — заголовок и вводный абзац; ниже три сегмента сразу
 * (в ряд от 1024px — строки карточек выровнены subgrid, стопкой ниже). У каждого —
 * кто, что смотрит в профиле (свой мини-визуал), результат и короткий сценарий.
 * Карточки имеют id — на них ссылается подвал.
 */
export function Audience() {
  return (
    <section id={SECTIONS.audience} aria-labelledby="audience-title" className="screen border-b border-line">
      <div className="flex w-full flex-col gap-10 px-gutter py-section lg:gap-[clamp(1rem,2.6svh,2rem)] lg:py-fold">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-baseline lg:gap-10">
          <h2 id="audience-title" className="text-section lg:shrink-0">
            Для кого
          </h2>
          <p className="max-w-[46ch] text-lead text-muted lg:max-w-[70ch]">
            Три сценария: кто открывает LeadPilot и какие поля профиля использует.
          </p>
        </div>

        <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[repeat(3,minmax(0,1fr))] lg:gap-x-[clamp(1rem,1.6vw,2rem)] lg:gap-y-0">
          {SEGMENTS.map((s) => (
            <li
              key={s.id}
              id={s.id}
              data-anchor
              className="flex flex-col gap-6 rounded-3xl bg-surface p-6 sm:p-7 lg:row-span-5 lg:grid lg:grid-rows-subgrid lg:gap-y-[clamp(0.5rem,1.5svh,1.25rem)] lg:p-[clamp(1rem,2.4svh,1.75rem)] short:gap-y-2 short:p-3.5"
            >
              <div className="flex flex-col gap-2.5 lg:gap-1.5">
                <h3 className="text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] leading-[1.05] tracking-[-0.03em] lg:text-[clamp(1.5rem,1rem+1vw,2.25rem)]">
                  {s.name}
                </h3>
                <p className="text-[1.0625rem] leading-snug text-muted lg:text-[0.9375rem]">{s.text}</p>
              </div>
              <Row icon="role" label="Кто:" text={s.who} />
              <div className="flex flex-col gap-3 lg:gap-2">
                <Row icon="source" label="Что смотрит в профиле:" tag="демо" />
                <ProfileSnippet segment={s} />
              </div>
              <Row icon="check" label="Результат:" text={s.result} />
              <p data-scenario className="border-t border-line pt-5 text-[0.9375rem] leading-[1.6] lg:pt-[clamp(0.5rem,1.5svh,1.25rem)] lg:leading-[1.5] short:pt-2 short:leading-[1.45]">
                <strong className="font-semibold text-text">{s.moment}</strong>{" "}
                <span className="text-text/85">{s.scenario}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
