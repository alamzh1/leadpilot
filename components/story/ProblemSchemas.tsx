/**
 * Три схемы блока проблемы на пиксельной сетке 4px. Каждая — своя форма, не иконка:
 * разбросанные фрагменты, устаревшая должность → актуальная, много точек → один вывод.
 * Все надписи — HTML (читаются и без JS), сами схемы помечены role="img".
 */

const SCATTER = [
  { label: "новости", x: 4, y: 10 },
  { label: "вакансии", x: 54, y: 2 },
  { label: "корп. сайт", x: 30, y: 44 },
  { label: "публичный профиль", x: 2, y: 74 },
  { label: "пресс-релиз", x: 62, y: 66 },
] as const;

// Одиночные «пиксели» информации — в процентах, чтобы схема тянулась.
const SPECKS = [
  [22, 6, 8],
  [44, 20, 4],
  [88, 30, 8],
  [12, 52, 4],
  [80, 50, 4],
  [50, 86, 8],
  [92, 88, 4],
  [38, 66, 4],
  [70, 18, 4],
] as const;

export function ScatterSchema() {
  return (
    <div
      role="img"
      aria-label="Схема: фрагменты о компании разбросаны по новостям, вакансиям, сайту и публичным профилям"
      className="t04-schema relative h-40 w-full"
    >
      {SPECKS.map(([x, y, s], i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute bg-cyan/70"
          style={{ left: `${x}%`, top: `${y}%`, width: s, height: s }}
        />
      ))}
      {SCATTER.map((f) => (
        <span
          key={f.label}
          aria-hidden="true"
          className="absolute whitespace-nowrap border border-cyan/60 bg-bg px-2 py-0.5 font-mono text-[0.6875rem] leading-5 text-cyan"
          style={{ left: `${f.x}%`, top: `${f.y}%` }}
        >
          {f.label}
        </span>
      ))}
    </div>
  );
}

export function StaleRoleSchema() {
  return (
    <div
      role="img"
      aria-label="Схема: устаревшая должность в CRM перечёркнута и заменена актуальной с новой датой"
      className="t04-schema flex h-40 w-full flex-col justify-center gap-3 px-3 font-mono text-[0.75rem] leading-5"
    >
      <div aria-hidden="true" className="flex items-center gap-3 border border-line bg-bg px-3 py-2 text-muted">
        <span className="w-16 shrink-0">2024-03</span>
        <span className="min-w-0 truncate line-through decoration-muted">Head of IT</span>
        <span className="ml-auto shrink-0 text-[0.6875rem]">устарело</span>
      </div>
      <div aria-hidden="true" className="flex h-4 items-center gap-1 pl-[4.75rem]">
        <span className="size-1 bg-line-strong" />
        <span className="size-1 bg-line-strong" />
        <span className="size-1 bg-cyan" />
        <span className="size-1 bg-lime" />
      </div>
      <div aria-hidden="true" className="flex items-center gap-3 border border-lime/70 bg-bg px-3 py-2 text-text">
        <span className="w-16 shrink-0 text-muted">2026-10</span>
        <span className="min-w-0 truncate">CIO</span>
        <span className="ml-auto flex shrink-0 items-center gap-1.5 text-[0.6875rem] text-lime">
          <span className="size-2 bg-lime" />
          проверено
        </span>
      </div>
    </div>
  );
}

// Точки слева (столбец, строка) на сетке 4px; не все клетки заняты — шум неровный.
const DOTS: readonly [number, number][] = [
  [0, 0], [2, 0], [4, 0], [1, 1], [3, 1], [0, 2], [2, 2], [4, 2],
  [1, 3], [3, 3], [0, 4], [2, 4], [4, 4], [1, 5], [3, 5], [0, 6], [2, 6], [4, 6],
];
// Какие точки «доезжают» до вывода (индексы в DOTS).
const ROUTED = [1, 5, 9, 12, 16];

export function ConvergeSchema() {
  const cell = 12;
  const ox = 8;
  const oy = 10;
  const target = { x: 196, y: 50 };
  return (
    <div
      role="img"
      aria-label="Схема: много разрозненных точек данных сходятся в один вывод — повод для контакта"
      className="t04-schema relative h-40 w-full"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 240 100"
        preserveAspectRatio="xMinYMid meet"
        shapeRendering="crispEdges"
        className="absolute inset-0 h-full w-full"
      >
        {ROUTED.map((i) => {
          const [c, r] = DOTS[i];
          const x = ox + c * cell + 4;
          const y = oy + r * cell + 2;
          const mid = 120 + (i % 3) * 12;
          return (
            <path
              key={i}
              d={`M${x} ${y}H${mid}V${target.y + 2}H${target.x}`}
              fill="none"
              stroke="var(--color-cyan)"
              strokeOpacity={0.45}
              strokeWidth={1}
            />
          );
        })}
        {DOTS.map(([c, r], i) => (
          <rect
            key={i}
            x={ox + c * cell}
            y={oy + r * cell}
            width={4}
            height={4}
            fill={ROUTED.includes(i) ? "var(--color-cyan)" : "var(--color-line-strong)"}
          />
        ))}
        <rect x={target.x} y={target.y - 6} width={16} height={16} fill="var(--color-lime)" />
      </svg>
      <span
        aria-hidden="true"
        className="absolute right-0 bottom-3 border border-lime/70 bg-bg px-2 py-0.5 font-mono text-[0.6875rem] leading-5 text-lime"
      >
        повод для контакта
      </span>
    </div>
  );
}
