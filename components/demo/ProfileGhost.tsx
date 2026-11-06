import { PROFILE_LABELS } from "./ProfileCard";
import type { ProfileFieldKey } from "@/lib/demo/profile";

/** Раскладка призрака повторяет полную карточку: те же поля и колонки, вместо значений — 4px-заглушки. */
const GHOST_CELLS: readonly { field: ProfileFieldKey; span: string; rows: readonly string[] }[] = [
  { field: "name", span: "col-span-2 md:col-span-5", rows: ["w-3/5"] },
  { field: "industry", span: "md:col-span-3", rows: ["w-4/5"] },
  { field: "size", span: "md:col-span-4", rows: ["w-2/3"] },
  { field: "description", span: "col-span-2 md:col-span-7", rows: ["w-full", "w-4/5"] },
  { field: "roles", span: "md:col-span-5", rows: ["w-1/2", "w-3/4"] },
  { field: "itNeeds", span: "md:col-span-6", rows: ["w-4/5", "w-3/5"] },
  { field: "signals", span: "md:col-span-6", rows: ["w-3/4", "w-1/2"] },
  { field: "reason", span: "col-span-2 md:col-span-8", rows: ["w-full", "w-2/3"] },
  { field: "contactRole", span: "md:col-span-4", rows: ["w-1/2"] },
];

/**
 * Пустое состояние демо: «призрак» карточки профиля. Ключи полей видны сразу,
 * значения — голубые 4px-строки (непроверенные данные), пока не выбрана компания.
 */
export function ProfileGhost() {
  return (
    <div data-testid="demo-ghost" className="flex h-full flex-col gap-6">
      <div>
        <p className="font-heading text-[1.375rem] leading-tight font-[650] tracking-[-0.025em]">
          Здесь соберётся профиль компании
        </p>
        <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-muted">
          Описание, IT-потребности, должности, сигналы и источники — в одной карточке. Четыре
          этапа занимают около трёх секунд.
        </p>
      </div>
      <div aria-hidden="true" className="flex-1 border border-dashed border-line-strong">
        <div className="grid h-full grid-cols-2 gap-px bg-line md:auto-rows-fr md:grid-cols-12">
          {GHOST_CELLS.map(({ field, span, rows }) => (
            <div key={field} className={`min-w-0 bg-bg px-3 py-3 sm:px-5 sm:py-4 ${span}`}>
              <div className="flex items-center gap-2">
                <span className="size-1 shrink-0 bg-cyan/60" />
                <span className="min-w-0 font-mono text-[0.6875rem] tracking-[0.04em] text-muted uppercase">
                  {PROFILE_LABELS[field]}
                </span>
              </div>
              <span className="mt-3 flex flex-col gap-2">
                {rows.map((w, k) => (
                  <span key={k} className={`pf-skeleton ${w}`} />
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
