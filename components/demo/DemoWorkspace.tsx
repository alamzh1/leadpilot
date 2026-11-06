"use client";

import { Check, Copy, Download, RotateCcw } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { copyText, downloadText } from "@/lib/clipboard";
import { DEMO_COMPANIES, RESEARCH_STAGES, findDemoCompany } from "@/lib/demo/companies";
import {
  PROFILE_FIELDS,
  QUERY_MESSAGES,
  checkQuery,
  csvFileName,
  profileCompleteness,
  profileToCsv,
  profileToText,
} from "@/lib/demo/profile";
import type { DemoCompany, DemoCompanyId } from "@/lib/demo/types";
import { useResearch } from "@/lib/demo/useResearch";
import { ProfileCard } from "./ProfileCard";
import { ProfileGhost } from "./ProfileGhost";
import { StageRail } from "./StageRail";

type InputError = keyof typeof QUERY_MESSAGES;
type CopyStatus = "idle" | "copied" | "failed";

/** Сколько полей карточки «проверено» к началу каждого этапа: поля собираются вместе с этапами. */
const RESOLVED_AT_STAGE = [0, 3, 5, 7] as const;
const FIELDS = PROFILE_FIELDS.length;
const RAMP_MS = 150;

const NOTICE_TEXT = "Живой анализ доступен в полной версии LeadPilot. В демо можно исследовать три примера";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Интерактивное демо: выбор компании или ручной ввод → четыре этапа → карточка
 * с «пиксельной сборкой» → копирование, CSV, повторный запуск.
 */
export function DemoWorkspace() {
  const { state, start, reset } = useResearch();
  const [selectedId, setSelectedId] = useState<DemoCompanyId | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<InputError | null>(null);
  const [notice, setNotice] = useState(false);
  const [ramp, setRamp] = useState(0);
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  const ids = useId();
  const inputId = `${ids}-query`;
  const hintId = `${ids}-hint`;
  const errorId = `${ids}-error`;
  const titleId = `${ids}-profile-title`;
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const running = state.status === "running";
  const done = state.status === "done";

  // После прогона оставшиеся поля собираются по одному (при reduced-motion — сразу).
  useEffect(() => {
    if (!done) return;
    const reduced = prefersReducedMotion();
    const id = setInterval(
      () => {
        setRamp((r) => {
          const next = reduced ? FIELDS : r + 1;
          if (RESOLVED_AT_STAGE[3] + next >= FIELDS) clearInterval(id);
          return next;
        });
      },
      reduced ? 0 : RAMP_MS,
    );
    return () => clearInterval(id);
  }, [done]);

  // Готовая карточка получает фокус: клавиатура и скринридер сразу у результата.
  useEffect(() => {
    if (!done) return;
    const title = document.getElementById(titleId);
    title?.focus({ preventScroll: true });
    title?.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [done, titleId]);

  useEffect(() => {
    if (copyStatus !== "copied") return;
    const id = setTimeout(() => setCopyStatus("idle"), 2200);
    return () => clearTimeout(id);
  }, [copyStatus]);

  function choose(company: DemoCompany) {
    if (running) return;
    setSelectedId(company.id);
    setQuery(company.name);
    setError(null);
    setNotice(false);
  }

  function onInput(value: string) {
    setQuery(value);
    setSelectedId(findDemoCompany(value)?.id ?? null);
    setError(null);
    setNotice(false);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (running) return;
    const check = checkQuery(query);
    if (!check.ok) {
      if (check.reason === "not-in-demo") {
        setError(null);
        setNotice(true);
      } else {
        setNotice(false);
        setError(check.reason);
      }
      return;
    }
    setError(null);
    setNotice(false);
    setRamp(0);
    setCopyStatus("idle");
    setSelectedId(check.company.id);
    start(check.company);
  }

  function onReset() {
    reset();
    setRamp(0);
    setCopyStatus("idle");
    setSelectedId(null);
    setQuery("");
    // Возврат к выбору: фокус на первом чипе селектора.
    requestAnimationFrame(() => chipRefs.current[0]?.focus());
  }

  async function onCopy(company: DemoCompany) {
    const ok = await copyText(profileToText(company));
    setCopyStatus(ok ? "copied" : "failed");
  }

  const company = state.status === "idle" ? null : state.company;
  const resolved = running
    ? RESOLVED_AT_STAGE[state.stageIndex]
    : done
      ? Math.min(FIELDS, RESOLVED_AT_STAGE[3] + ramp)
      : 0;

  let liveText = "";
  if (running) {
    liveText = `Этап ${state.stageIndex + 1} из ${RESEARCH_STAGES.length}: ${RESEARCH_STAGES[state.stageIndex].label}`;
  } else if (done) {
    const { filled, total } = profileCompleteness(state.company);
    liveText = `Профиль готов: ${state.company.name}. Полнота профиля (демо): ${filled} из ${total} полей`;
  }

  const describedBy = [hintId, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className="grid gap-px overflow-hidden rounded-3xl border border-line-strong bg-line lg:grid-cols-12">
      {/* Панель запроса */}
      <div className="flex min-w-0 flex-col gap-8 bg-surface p-5 sm:p-7 lg:col-span-4">
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p aria-hidden="true" className="text-[0.9375rem] font-medium">
              Выберите компанию
            </p>
            <div role="group" aria-label="Демо-компании" className="flex flex-col gap-2">
              {DEMO_COMPANIES.map((c, i) => (
                <button
                  key={c.id}
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  type="button"
                  aria-pressed={selectedId === c.id}
                  disabled={running}
                  onClick={() => choose(c)}
                  className="px-chip px-chip--lg w-full justify-between gap-3"
                >
                  <span className="font-display">{c.name}</span>
                  <span className="chip-sub font-mono text-[0.75rem] font-normal">{c.industry.toLocaleLowerCase("ru-RU")}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={inputId} className="text-[0.9375rem] font-medium">
              Или введите название
            </label>
            <input
              id={inputId}
              name="company"
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={query}
              readOnly={running}
              aria-disabled={running || undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              onChange={(e) => onInput(e.target.value)}
              placeholder="Например, Northstar Bank"
              className="px-field"
            />
            {error ? (
              <p id={errorId} className="flex items-start gap-2 text-[0.875rem] text-text">
                <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 bg-cyan" />
                {QUERY_MESSAGES[error]}
              </p>
            ) : null}
            <p id={hintId} className="text-[0.8125rem] text-muted">
              В демо доступны три вымышленные компании; от 2 до 80 символов.
            </p>
          </div>

          <Button
            type="submit"
            variant={done ? "ghost" : "primary"}
            aria-disabled={running || undefined}
            className="w-full"
          >
            Начать исследование
            <PixelIcon name="arrow" size={16} />
          </Button>
        </form>

        {notice && (
          <div data-testid="demo-notice" role="status" className="rounded-xl border border-cyan/50 bg-bg p-4">
            <p className="text-[0.9375rem]">{NOTICE_TEXT}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {DEMO_COMPANIES.map((c) => (
                <button key={c.id} type="button" onClick={() => choose(c)} className="px-chip font-display">
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-line pt-6">
          <StageRail
            activeIndex={running ? state.stageIndex : -1}
            done={done}
            orientation="vertical"
          />
        </div>

        <p data-testid="demo-live" aria-live="polite" role="status" className="sr-only">
          {liveText}
        </p>
      </div>

      {/* Результат */}
      <div className="min-w-0 bg-bg p-4 sm:p-7 lg:col-span-8">
        {company ? (
          <div className="flex flex-col gap-5">
            <ProfileCard company={company} resolvedCount={resolved} titleId={titleId} />
            {done && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => onCopy(company)} className="max-sm:w-full">
                    {copyStatus === "copied" ? <Check size={16} strokeWidth={2} /> : <Copy size={16} strokeWidth={2} />}
                    Скопировать профиль
                  </Button>
                  <Button variant="ghost" className="max-sm:w-full" onClick={() => downloadText(csvFileName(company), profileToCsv(company), "text/csv;charset=utf-8")}>
                    <Download size={16} strokeWidth={2} />
                    Скачать CSV
                  </Button>
                  <Button variant="ghost" className="max-sm:w-full" onClick={onReset}>
                    <RotateCcw size={16} strokeWidth={2} />
                    Исследовать другую компанию
                  </Button>
                </div>
                <p role="status" className="min-h-6 text-[0.875rem]">
                  {copyStatus === "copied" && <span className="text-lime">Профиль скопирован</span>}
                  {copyStatus === "failed" && (
                    <span className="text-text">Не удалось скопировать — выделите текст карточки вручную</span>
                  )}
                </p>
              </div>
            )}
          </div>
        ) : (
          <ProfileGhost />
        )}
      </div>
    </div>
  );
}
