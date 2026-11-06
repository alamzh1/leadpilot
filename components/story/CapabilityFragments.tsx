import type { ReactNode } from "react";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { DEMO_COMPANIES } from "@/lib/demo/companies";
import { csvFileName, DEMO_STATUS, PROFILE_FIELDS } from "@/lib/demo/profile";
import type { DemoCompany } from "@/lib/demo/types";

/**
 * Фрагменты интерфейса для модулей «Возможностей». Данные — та же вымышленная
 * Vector Logistics, что и в hero. Фрагмент — единственная рамка модуля. Хром окна
 * (`vector-logistics / …`) — только у Profile и Export; у Roles и Signals пометка «демо»
 * стоит в нижней строке, чтобы шапка окна не повторялась четыре раза.
 */
const company: DemoCompany =
  DEMO_COMPANIES.find((c) => c.id === "vector-logistics") ?? DEMO_COMPANIES[0];

function DemoTag() {
  return <span className="shrink-0 rounded-sm border border-line-strong px-1.5">демо</span>;
}

type FrameProps = { path?: string; note?: string; children: ReactNode; className?: string };

function Frame({ path, note, children, className = "" }: FrameProps) {
  return (
    <div className={`overflow-hidden rounded-xl border border-line-strong bg-bg ${className}`}>
      {path && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 font-mono text-[0.6875rem] leading-4 text-muted">
          <span className="min-w-0 truncate">
            {company.id} / {path}
          </span>
          <DemoTag />
        </div>
      )}
      {children}
      {note && (
        <p className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 font-mono text-[0.6875rem] leading-4 text-muted">
          <span className="min-w-0">{note}</span>
          <DemoTag />
        </p>
      )}
    </div>
  );
}

function Verified() {
  return (
    <>
      <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 bg-lime" />
      <span className="sr-only">проверено</span>
    </>
  );
}

export function ProfileFragment() {
  const rows: ProfileRowProps[] = [
    { label: "Компания", value: company.name },
    { label: "Отрасль", value: company.industry },
    { label: "Размер", value: `${company.size} · демоданные`, short: true },
    {
      label: "IT-потребности",
      value: (
        <ul className="flex flex-wrap gap-1.5">
          {company.itNeeds.map((need) => (
            <li key={need} className="rounded-md border border-line-strong px-2 py-0.5 text-[0.8125rem] leading-5 lg:truncate">
              {need}
            </li>
          ))}
        </ul>
      ),
    },
    { label: "Источники", value: `${company.sources.length} — с типом и датой`, pending: true, short: true },
  ];
  return (
    <Frame path="profile">
      <dl className="divide-y divide-line">
        {rows.map((row) => (
          <ProfileRow key={row.label} {...row} />
        ))}
      </dl>
      <div className="border-t border-lime/60 px-4 py-4 lg:py-[clamp(0.625rem,1.6svh,1rem)]">
        <p className="font-mono text-data text-lime">Повод для первого контакта</p>
        <p className="mt-1.5 max-w-[58ch] text-[0.9375rem] leading-[1.45]">{company.outreach.reason}</p>
        <p className="mt-1.5 font-mono text-data text-muted">кому писать: {company.outreach.role}</p>
      </div>
    </Frame>
  );
}

/** `short` — строка скрывается на низком окне десктопа, чтобы модуль помещался в экран. */
type ProfileRowProps = { label: string; value: ReactNode; pending?: boolean; short?: boolean };

function ProfileRow({ label, value, pending, short }: ProfileRowProps) {
  return (
    <div className={`${short ? "short:hidden " : ""}grid gap-1 px-4 py-3 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-4 lg:grid-cols-[7.5rem_minmax(0,1fr)] lg:py-[clamp(0.375rem,1.2svh,0.75rem)]`}>
      <dt className="font-mono text-data text-muted">{label}</dt>
      <dd className="grid min-w-0 gap-4 text-[0.9375rem] leading-6 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">{value}</div>
        {pending ? (
          <span className="hidden items-start gap-1.5 font-mono text-[0.6875rem] leading-5 text-cyan sm:flex">
            <span className="mt-1.5 size-2 shrink-0 border border-cyan" />
            проверка
          </span>
        ) : (
          <span className="hidden sm:flex">
            <Verified />
          </span>
        )}
      </dd>
    </div>
  );
}

export function RolesFragment() {
  return (
    <Frame note="только должности — без имён и контактов">
      <ul className="divide-y divide-line">
        {company.roles.map((role) => {
          const primary = role === company.outreach.role;
          return (
            <li key={role} className="flex items-center gap-3 px-4 py-3 lg:py-[clamp(0.5rem,1.3svh,0.75rem)]">
              <PixelIcon name="role" className={primary ? "text-lime" : "text-muted"} />
              <span className="min-w-0 flex-1 text-[0.9375rem]">{role}</span>
              {primary && (
                <span className="shrink-0 rounded-sm border border-lime/70 px-1.5 font-mono text-[0.6875rem] leading-5 text-lime">
                  кому писать
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </Frame>
  );
}

export function SignalsFragment() {
  return (
    <Frame note="вымышленная компания и события">
      <ul className="flex flex-col gap-4 px-4 py-4 lg:gap-3 lg:py-[clamp(0.625rem,1.6svh,1rem)]">
        {company.signals.slice(0, 2).map((s) => (
          <li key={s.label} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3">
            <span aria-hidden="true" className="mt-1.5 size-2 bg-cyan" />
            <span className="font-mono text-data text-cyan">{s.label}</span>
            <span className="col-start-2 text-[0.9375rem] leading-6 text-text">{s.detail}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

const EXPORT_KEYS = new Set(["name", "industry", "roles", "contactRole", "status"]);

export function ExportFragment() {
  const rows = PROFILE_FIELDS.filter((f) => EXPORT_KEYS.has(f.key)).map((f) => {
    const v = f.value(company);
    return { key: f.key, label: f.label, value: Array.isArray(v) ? v.join(" | ") : v };
  });
  return (
    <Frame path="export">
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-3 font-mono text-data lg:py-2 short:hidden">
        <PixelIcon name="export" className="shrink-0 text-lime" />
        <span className="min-w-0 truncate">{csvFileName(company)}</span>
        <span className="ml-auto hidden shrink-0 text-muted sm:inline">UTF-8 · «;»</span>
      </div>
      <table className="w-full table-fixed border-collapse font-mono text-[0.75rem] leading-5">
        <caption className="sr-only">Превью CSV демо-профиля {company.name}</caption>
        <thead>
          <tr className="text-muted">
            <th scope="col" className="w-[38%] px-4 py-2 text-left font-normal lg:py-1.5">
              Поле
            </th>
            <th scope="col" className="px-4 py-2 text-left font-normal lg:py-1.5">
              Значение
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className={`border-t border-line ${r.key === "industry" ? "short:hidden" : ""}`}>
              <td className="px-4 py-2 align-top break-words text-muted sm:truncate lg:py-1.5">{r.label}</td>
              <td className={`truncate px-4 py-2 lg:py-1.5 ${r.value === DEMO_STATUS ? "text-cyan" : "text-text"}`}>
                {r.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Frame>
  );
}
