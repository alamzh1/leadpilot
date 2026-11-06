import { PixelIcon } from "@/components/ui/PixelIcon";
import { RESEARCH_STAGES } from "@/lib/demo/companies";

type Props = {
  /** Индекс идущего этапа (0..3); -1 — прогон не начат. */
  activeIndex: number;
  /** Все этапы пройдены. */
  done: boolean;
  orientation?: "horizontal" | "vertical";
  /** Компактный размер — для рабочей области hero. */
  compact?: boolean;
  className?: string;
};

type StageState = "done" | "active" | "pending";

function stageState(index: number, activeIndex: number, done: boolean): StageState {
  if (done || index < activeIndex) return "done";
  if (index === activeIndex) return "active";
  return "pending";
}

const STATE_TEXT: Record<StageState, string> = {
  done: "готово",
  active: "идёт",
  pending: "ожидает",
};

/** Рельс четырёх этапов исследования: блок-индикатор и линия, заполняемая ступенями. */
export function StageRail({
  activeIndex,
  done,
  orientation = "horizontal",
  compact = false,
  className,
}: Props) {
  const vertical = orientation === "vertical";

  if (compact) {
    // Компактный рельс для hero: четыре сегмента и подпись текущего этапа одной строкой.
    const current = done ? RESEARCH_STAGES.length - 1 : Math.max(activeIndex, 0);
    return (
      <div className={["flex items-center gap-4", className ?? ""].filter(Boolean).join(" ")}>
        <ol aria-label="Этапы исследования" className="flex shrink-0 gap-1">
          {RESEARCH_STAGES.map((stage, i) => {
            const state = stageState(i, activeIndex, done);
            return (
              <li
                key={stage.id}
                data-state={state}
                title={stage.label}
                className={[
                  "h-2 w-8",
                  state === "done" ? "bg-lime" : "",
                  state === "active" ? "bg-cyan stage-blink" : "",
                  state === "pending" ? "bg-line-strong" : "",
                ].join(" ")}
              >
                <span className="sr-only">{stage.label}</span>
              </li>
            );
          })}
        </ol>
        <p className="min-w-0 truncate text-[0.8125rem]">
          <span className="font-mono text-[0.75rem] text-muted">
            {activeIndex < 0 && !done ? "00" : String(current + 1).padStart(2, "0")}/04
          </span>{" "}
          <span className={activeIndex < 0 && !done ? "text-muted" : "text-text"}>
            {activeIndex < 0 && !done ? "ожидает запуска" : RESEARCH_STAGES[current].label}
          </span>
        </p>
      </div>
    );
  }

  return (
    <ol
      aria-label="Этапы исследования"
      className={[
        vertical ? "flex flex-col" : "grid grid-cols-4",
        compact ? "gap-0" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {RESEARCH_STAGES.map((stage, i) => {
        const state = stageState(i, activeIndex, done);
        const last = i === RESEARCH_STAGES.length - 1;
        return (
          <li
            key={stage.id}
            data-state={state}
            aria-current={state === "active" ? "step" : undefined}
            className={
              vertical
                ? "relative grid grid-cols-[16px_minmax(0,1fr)] gap-x-3 pb-4 last:pb-0"
                : "relative flex min-w-0 flex-col gap-2 pr-2"
            }
          >
            {/* Соединительная линия к следующему этапу: 1px, лайм — за пройденным. */}
            {!last && (
              <span
                aria-hidden="true"
                className={[
                  "absolute",
                  vertical ? "top-5 bottom-1 left-[7px] w-px" : "top-[7px] right-0 left-5 h-px",
                  state === "done" ? "bg-lime/70" : "bg-line-strong",
                ].join(" ")}
              />
            )}
            <span
              aria-hidden="true"
              className={[
                "relative z-10 flex size-4 shrink-0 items-center justify-center",
                state === "done" ? "bg-lime text-lime-ink" : "",
                state === "active" ? "bg-cyan stage-blink" : "",
                state === "pending" ? "border border-line-strong bg-bg" : "",
              ].join(" ")}
            >
              {state === "done" && <PixelIcon name="check" size={16} />}
            </span>
            <span className="min-w-0">
              <span
                className={[
                  "block leading-snug",
                  compact ? "text-[0.75rem]" : "text-[0.9375rem]",
                  state === "pending" ? "text-muted" : "text-text",
                ].join(" ")}
              >
                {stage.label}
              </span>
              {!compact && (
                <span
                  className={[
                    "mt-0.5 block font-mono text-[0.75rem]",
                    state === "active" ? "text-cyan" : state === "done" ? "text-lime" : "text-muted",
                  ].join(" ")}
                >
                  {String(i + 1).padStart(2, "0")} · {STATE_TEXT[state]}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
