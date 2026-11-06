"use client";

import type { ReactNode } from "react";
import { PixelIcon } from "@/components/ui/PixelIcon";
import {
  DEMO_STATUS,
  PROFILE_FIELDS,
  isFieldFilled,
  profileCompleteness,
  type ProfileFieldKey,
} from "@/lib/demo/profile";
import type { DemoCompany } from "@/lib/demo/types";
import { PixelAssembly } from "./PixelAssembly";

type Props = {
  company: DemoCompany;
  /** Сколько полей (0..11, по порядку `PROFILE_FIELDS`) уже verified; без пропа — все. */
  resolvedCount?: number;
  /** Компактная версия для рабочей области hero. */
  compact?: boolean;
  /** id заголовка с названием компании (для фокуса и `aria-labelledby`). */
  titleId?: string;
  className?: string;
};

type FieldState = "pending" | "verified" | "missing";

/** Ключи полей карточки — общие для карточки и её «призрака» в пустом состоянии демо. */
export const PROFILE_LABELS: Record<ProfileFieldKey, string> = {
  name: "Компания",
  industry: "Отрасль",
  size: "Размер · демоданные",
  description: "Краткое описание",
  itNeeds: "Возможные IT-потребности",
  roles: "Релевантные должности",
  signals: "Сигналы потенциальной потребности",
  sources: "Источники (демо)",
  reason: "Повод для первого контакта",
  contactRole: "Кому писать",
  status: "Статус",
};

const COMPACT_LABELS: Partial<Record<ProfileFieldKey, string>> = {
  itNeeds: "IT-потребности",
  signals: "Сигналы",
  reason: "Повод для контакта",
};

const FIELD_INDEX = Object.fromEntries(PROFILE_FIELDS.map((f, i) => [f.key, i])) as Record<
  ProfileFieldKey,
  number
>;

function cx(...parts: (string | false | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

type CellProps = {
  field: ProfileFieldKey;
  state: FieldState;
  /** Сколько полей уже проверено — для вспышки и пиксельной сборки; `undefined` — статичная карточка. */
  resolved?: number;
  compact: boolean;
  children: ReactNode;
  className?: string;
  labelSuffix?: ReactNode;
};

function Cell({ field, state, resolved, compact, children, className, labelSuffix }: CellProps) {
  const i = FIELD_INDEX[field];
  const animated = resolved !== undefined;
  const label = (compact && COMPACT_LABELS[field]) || PROFILE_LABELS[field];
  const assembling = animated && i >= resolved - 2 && i <= resolved;
  return (
    <div
      data-field={field}
      data-state={state}
      data-flash={animated && state !== "pending" && i >= resolved - 4 ? "true" : undefined}
      className={cx("pf-cell min-w-0 bg-surface", compact ? "px-3 py-2.5" : "px-4 py-4 sm:px-5 lg:px-4 lg:py-[clamp(0.625rem,1.6svh,1rem)]", className)}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={cx(
            "size-1 shrink-0",
            state === "verified" && "bg-lime",
            state === "pending" && "bg-cyan",
            state === "missing" && "bg-line-strong",
          )}
        />
        <span
          className={cx(
            "font-mono uppercase tracking-[0.04em] text-muted",
            compact ? "text-[0.625rem]" : "text-[0.6875rem]",
          )}
        >
          {label}
        </span>
        {labelSuffix}
      </div>
      <div className={cx("relative", compact ? "mt-1.5" : "mt-2.5 lg:mt-1.5")}>
        {state === "pending" ? (
          <>
            {/* Значение держит место (высота карточки не прыгает), но скрыто до проверки. */}
            <div aria-hidden="true" className="invisible">
              {children}
            </div>
            <span aria-hidden="true" className="absolute inset-x-0 top-0 flex flex-col gap-1.5 py-1">
              <span className="pf-skeleton w-4/5" />
              <span className="pf-skeleton w-1/2" />
            </span>
          </>
        ) : (
          children
        )}
        <PixelAssembly active={assembling} seed={i + 1} count={compact ? 8 : 12} />
      </div>
    </div>
  );
}

/**
 * Карточка профиля — общая для hero и демо. Каждое поле — ячейка «досье» на сетке
 * из 1px-линий: до проверки — голубой контур и 4px-заглушка, после — текст и вспышка лайма.
 */
export function ProfileCard({ company, resolvedCount, compact = false, titleId, className }: Props) {
  const resolved = resolvedCount ?? PROFILE_FIELDS.length;
  const { filled, total } = profileCompleteness(company);

  function stateOf(key: ProfileFieldKey): FieldState {
    const i = FIELD_INDEX[key];
    if (i >= resolved) return "pending";
    return isFieldFilled(PROFILE_FIELDS[i].value(company)) ? "verified" : "missing";
  }

  /** Общие пропсы ячейки поля. */
  const cell = (field: ProfileFieldKey) => ({
    field,
    state: stateOf(field),
    resolved: resolvedCount,
    compact,
  });

  const text = compact ? "text-[0.8125rem] leading-snug" : "text-[0.9375rem] leading-relaxed lg:leading-snug";
  const TitleTag = compact ? "p" : "h3";

  const name = (
    <TitleTag
      id={titleId}
      tabIndex={titleId ? -1 : undefined}
      className={cx(
        "font-display font-semibold tracking-[-0.02em] text-text outline-none",
        compact ? "text-[1.125rem] leading-tight" : "text-[1.625rem] leading-tight lg:text-[1.5rem]",
      )}
    >
      {company.name}
    </TitleTag>
  );

  const size = isFieldFilled(company.size) ? (
    <p className={text}>{company.size}</p>
  ) : (
    <p className={cx(text, "text-muted")}>{company.size}</p>
  );

  const roles = (
    <ul className="flex flex-wrap gap-1.5">
      {company.roles.map((role) => (
        <li
          key={role}
          className={cx(
            "rounded-md border px-2 py-0.5 font-mono",
            compact ? "text-[0.6875rem]" : "text-[0.8125rem]",
            role === company.outreach.role ? "border-cyan/60 text-text" : "border-line-strong text-muted",
          )}
        >
          {role}
        </li>
      ))}
    </ul>
  );

  const itNeeds = (
    <ul className={cx("flex flex-col", compact ? "gap-1" : "gap-1.5")}>
      {(compact ? company.itNeeds.slice(0, 2) : company.itNeeds).map((need) => (
        <li key={need} className={cx(text, "grid grid-cols-[4px_minmax(0,1fr)] items-baseline gap-2.5")}>
          <span aria-hidden="true" className="size-1 -translate-y-0.5 bg-muted" />
          {need}
        </li>
      ))}
    </ul>
  );

  const signals = (
    <ul className={cx("flex flex-col", compact ? "gap-1.5" : "gap-2.5 lg:gap-1.5")}>
      {(compact ? company.signals.slice(0, 1) : company.signals).map((signal) => (
        <li key={signal.label} className={text}>
          <span className="font-mono text-[0.75rem] text-cyan">{signal.label}</span>
          {compact ? <span className="line-clamp-2 block">{signal.detail}</span> : <> — {signal.detail}</>}
        </li>
      ))}
    </ul>
  );

  const sources = (
    <ul className="flex flex-col">
      {(compact ? company.sources.slice(0, 2) : company.sources).map((source) => (
        <li
          key={`${source.kind}-${source.title}`}
          className={cx(
            "grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 border-t border-line first:border-t-0",
            compact ? "py-1" : "py-2 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_auto] lg:py-1.5",
          )}
        >
          <span className="flex min-w-0 items-center gap-2 font-mono text-[0.75rem] text-muted">
            <PixelIcon name="source" size={16} className="shrink-0" />
            <span className="truncate">{source.kind}</span>
          </span>
          {!compact && (
            <span className="order-last col-span-2 text-[0.875rem] sm:order-none sm:col-span-1">
              {source.title}
            </span>
          )}
          <span className="tabular font-mono text-[0.75rem] text-muted">{source.date}</span>
        </li>
      ))}
    </ul>
  );

  const reason = (
    <p
      className={
        compact ? "line-clamp-3 text-[0.8125rem] leading-snug" : "text-[1.0625rem] leading-relaxed lg:text-[0.9375rem] lg:leading-snug"
      }
    >
      {company.outreach.reason}
    </p>
  );

  const contactRole = (
    <p className="flex items-center gap-2">
      <PixelIcon name="arrow" size={16} className="shrink-0 text-cyan" />
      <span
        className={cx(
          "font-heading font-[650] tracking-[-0.02em]",
          compact ? "text-[0.9375rem]" : "text-[1.375rem] lg:text-[1.125rem]",
        )}
      >
        {company.outreach.role}
      </span>
    </p>
  );

  const statusTag = (
    <span className="inline-flex items-center gap-2 rounded-md border border-line-strong px-2 py-0.5 font-mono text-[0.75rem] whitespace-nowrap text-text">
      <PixelIcon name="check" size={16} className="text-lime" />
      {DEMO_STATUS}
    </span>
  );

  if (compact) {
    return (
      <article data-company={company.id} className={cx("overflow-hidden rounded-xl border border-line-strong bg-surface", className)}>
        <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-6">
          <Cell {...cell("name")} className="col-span-2 sm:col-span-4">
            {name}
          </Cell>
          <Cell {...cell("status")} className="col-span-2">
            {statusTag}
          </Cell>
          <Cell {...cell("industry")} className="sm:col-span-3">
            <p className={text}>{company.industry}</p>
          </Cell>
          <Cell {...cell("size")} className="sm:col-span-3">
            {size}
          </Cell>
          <Cell {...cell("itNeeds")} className="col-span-2 sm:col-span-3">
            {itNeeds}
          </Cell>
          <Cell {...cell("roles")} className="col-span-2 sm:col-span-3">
            {roles}
          </Cell>
          <Cell {...cell("signals")} className="col-span-2 sm:col-span-3">
            {signals}
          </Cell>
          <Cell {...cell("sources")} className="col-span-2 sm:col-span-3">
            {sources}
          </Cell>
          <Cell {...cell("reason")} className="col-span-2 bg-surface-2 sm:col-span-4">
            {reason}
          </Cell>
          <Cell {...cell("contactRole")} className="col-span-2 bg-surface-2">
            {contactRole}
          </Cell>
        </div>
      </article>
    );
  }

  return (
    <article
      aria-labelledby={titleId}
      data-company={company.id}
      className={cx("overflow-hidden rounded-2xl border border-line-strong bg-surface", className)}
    >
      <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-12">
        <Cell {...cell("name")} className="md:col-span-5 lg:col-span-4">
          {name}
        </Cell>
        <Cell {...cell("industry")} className="md:col-span-3 lg:col-span-4">
          <p className={text}>{company.industry}</p>
        </Cell>
        <Cell {...cell("size")} className="md:col-span-4 lg:col-span-4">
          {size}
        </Cell>
        <Cell {...cell("description")} className="md:col-span-7 lg:col-span-8">
          <p className={cx(text, "max-w-[62ch]")}>{company.description}</p>
        </Cell>
        <Cell {...cell("roles")} className="md:col-span-5 lg:col-span-4">
          {roles}
        </Cell>
        <Cell {...cell("itNeeds")} className="md:col-span-6 lg:col-span-4">
          {itNeeds}
        </Cell>
        <Cell {...cell("signals")} className="md:col-span-6 lg:col-span-8">
          {signals}
        </Cell>
        <Cell {...cell("sources")} className="md:col-span-12 lg:col-span-6">
          {sources}
        </Cell>
        <Cell {...cell("reason")} className="bg-surface-2 md:col-span-8 lg:col-span-6">
          {reason}
        </Cell>
        <Cell {...cell("contactRole")} className="bg-surface-2 md:col-span-4 lg:col-span-4">
          {contactRole}
        </Cell>
        <Cell {...cell("status")} className="md:col-span-12 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            {statusTag}
            <div className="flex flex-col gap-1 sm:items-end">
              <p className="flex items-center gap-3 text-[0.875rem]">
                <span aria-hidden="true" className="flex gap-0.5">
                  {Array.from({ length: total }, (_, k) => (
                    <span key={k} className={cx("h-3 w-1", k < filled ? "bg-lime" : "bg-line-strong")} />
                  ))}
                </span>
                <span data-testid="completeness">
                  Полнота профиля (демо): {filled} из {total} полей
                </span>
              </p>
              <p className="text-[0.8125rem] text-muted">
                Доля заполненных полей карточки — не AI-оценка качества
              </p>
            </div>
          </div>
        </Cell>
      </div>
    </article>
  );
}
