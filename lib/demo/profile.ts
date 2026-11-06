import { NOT_IN_PUBLIC_SOURCES, findDemoCompany } from "./companies";
import type { DemoCompany } from "./types";

export type QueryCheck =
  | { ok: true; company: DemoCompany }
  | { ok: false; reason: "empty" | "too-short" | "too-long" | "not-in-demo" };

export const QUERY_MESSAGES: Record<"empty" | "too-short" | "too-long", string> = {
  empty: "Введите название компании или выберите пример",
  "too-short": "Слишком короткое название",
  "too-long": "Название длиннее 80 символов",
};

export const QUERY_MAX_LENGTH = 80;
const QUERY_MIN_LENGTH = 2;

/** Проверка ручного ввода в демо. */
export function checkQuery(input: string): QueryCheck {
  const value = input.trim();
  if (value.length === 0) return { ok: false, reason: "empty" };
  if (value.length < QUERY_MIN_LENGTH) return { ok: false, reason: "too-short" };
  if (value.length > QUERY_MAX_LENGTH) return { ok: false, reason: "too-long" };
  const company = findDemoCompany(value);
  return company ? { ok: true, company } : { ok: false, reason: "not-in-demo" };
}

export const DEMO_STATUS = "Demo profile";

export type ProfileFieldKey =
  | "name"
  | "industry"
  | "size"
  | "description"
  | "itNeeds"
  | "roles"
  | "signals"
  | "sources"
  | "reason"
  | "contactRole"
  | "status";

/**
 * Поля карточки профиля в порядке показа. Этот порядок задаёт и очерёдность
 * «verified» в `ProfileCard` (`resolvedCount`), и строки текста/CSV.
 */
export const PROFILE_FIELDS: readonly {
  key: ProfileFieldKey;
  label: string;
  value: (c: DemoCompany) => string | string[];
}[] = [
  { key: "name", label: "Компания", value: (c) => c.name },
  { key: "industry", label: "Отрасль", value: (c) => c.industry },
  { key: "size", label: "Размер (демоданные)", value: (c) => c.size },
  { key: "description", label: "Описание", value: (c) => c.description },
  { key: "itNeeds", label: "IT-потребности", value: (c) => c.itNeeds },
  { key: "roles", label: "Релевантные должности", value: (c) => c.roles },
  { key: "signals", label: "Сигналы", value: (c) => c.signals.map((s) => `${s.label}: ${s.detail}`) },
  {
    key: "sources",
    label: "Источники",
    value: (c) => c.sources.map((s) => `${s.kind} — ${s.title}, ${s.date}`),
  },
  { key: "reason", label: "Повод для первого контакта", value: (c) => c.outreach.reason },
  { key: "contactRole", label: "Кому писать", value: (c) => c.outreach.role },
  { key: "status", label: "Статус", value: () => DEMO_STATUS },
];

function isFilledText(value: string): boolean {
  const text = value.trim();
  return text.length > 0 && text !== NOT_IN_PUBLIC_SOURCES;
}

/** Заполнено ли поле: пустое значение и пометка «нет в открытых источниках» — не заполнено. */
export function isFieldFilled(value: string | string[]): boolean {
  return Array.isArray(value) ? value.some(isFilledText) : isFilledText(value);
}

/**
 * Полнота полей карточки (не AI-оценка). Считаются 10 полей данных;
 * статус «Demo profile» — пометка режима, а не результат исследования.
 */
export function profileCompleteness(c: DemoCompany): { filled: number; total: number } {
  const dataFields = PROFILE_FIELDS.filter((f) => f.key !== "status");
  const filled = dataFields.filter((f) => isFieldFilled(f.value(c))).length;
  return { filled, total: dataFields.length };
}

const LIST_FIELDS: ReadonlySet<ProfileFieldKey> = new Set(["itNeeds", "signals", "sources"]);

/** Текстовая версия карточки для буфера обмена. */
export function profileToText(c: DemoCompany): string {
  const lines = ["LeadPilot — Demo profile (вымышленные данные)", ""];
  for (const field of PROFILE_FIELDS) {
    const value = field.value(c);
    if (Array.isArray(value)) {
      if (LIST_FIELDS.has(field.key)) {
        lines.push(`${field.label}:`, ...value.map((item) => `- ${item}`));
      } else {
        lines.push(`${field.label}: ${value.join(", ")}`);
      }
    } else {
      lines.push(`${field.label}: ${value}`);
    }
  }
  return lines.join("\n");
}

function csvCell(value: string): string {
  return /[";\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** CSV для русского Excel: UTF-8 с BOM, разделитель «;», строки через CRLF. */
export function profileToCsv(c: DemoCompany): string {
  const rows = [["Поле", "Значение"]];
  for (const field of PROFILE_FIELDS) {
    const value = field.value(c);
    rows.push([field.label, Array.isArray(value) ? value.join(" | ") : value]);
  }
  return "﻿" + rows.map((row) => row.map(csvCell).join(";")).join("\r\n");
}

export function csvFileName(c: DemoCompany): string {
  return `leadpilot-${c.id}-demo.csv`;
}
