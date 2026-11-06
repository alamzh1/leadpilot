"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import { RESEARCH_STAGES } from "./companies";
import type { DemoCompany } from "./types";

export type ResearchState =
  | { status: "idle" }
  | { status: "running"; company: DemoCompany; stageIndex: number }
  | { status: "done"; company: DemoCompany };

type Action =
  | { type: "start"; company: DemoCompany }
  | { type: "advance" }
  | { type: "reset" };

const LAST_STAGE = RESEARCH_STAGES.length - 1;
export const STAGE_MS = 700;
export const STAGE_MS_REDUCED = 120;

function reducer(state: ResearchState, action: Action): ResearchState {
  switch (action.type) {
    case "start":
      return state.status === "running"
        ? state
        : { status: "running", company: action.company, stageIndex: 0 };
    case "advance":
      if (state.status !== "running") return state;
      return state.stageIndex >= LAST_STAGE
        ? { status: "done", company: state.company }
        : { ...state, stageIndex: state.stageIndex + 1 };
    case "reset":
      return { status: "idle" };
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Машина демо: idle → running(0..3) → done. Все таймеры живут здесь. */
export function useResearch(opts?: { stageMs?: number }): {
  state: ResearchState;
  start(company: DemoCompany): void;
  reset(): void;
} {
  const [state, dispatch] = useReducer(reducer, { status: "idle" });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const running = useRef(false);
  const stageMs = opts?.stageMs;

  const clearTimers = useCallback(() => {
    for (const id of timers.current) clearTimeout(id);
    timers.current = [];
  }, []);

  const start = useCallback(
    (company: DemoCompany) => {
      if (running.current) return;
      running.current = true;
      dispatch({ type: "start", company });
      const step = stageMs ?? (prefersReducedMotion() ? STAGE_MS_REDUCED : STAGE_MS);
      for (let i = 1; i <= RESEARCH_STAGES.length; i++) {
        const isLast = i === RESEARCH_STAGES.length;
        timers.current.push(
          setTimeout(() => {
            if (isLast) {
              running.current = false;
              timers.current = [];
            }
            dispatch({ type: "advance" });
          }, step * i),
        );
      }
    },
    [stageMs],
  );

  const reset = useCallback(() => {
    clearTimers();
    running.current = false;
    dispatch({ type: "reset" });
  }, [clearTimers]);

  useEffect(() => {
    return () => {
      clearTimers();
      running.current = false;
    };
  }, [clearTimers]);

  return { state, start, reset };
}
