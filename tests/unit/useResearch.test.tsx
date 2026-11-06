// @vitest-environment jsdom
import { act, createElement, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEMO_COMPANIES } from "@/lib/demo/companies";
import { useResearch } from "@/lib/demo/useResearch";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

type Api = ReturnType<typeof useResearch>;
const [northstar, vector] = DEMO_COMPANIES;

let root: Root;
let container: HTMLDivElement;
let api: Api;

function Probe({ stageMs, sink }: { stageMs?: number; sink: (value: Api) => void }) {
  const value = useResearch(stageMs === undefined ? undefined : { stageMs });
  useEffect(() => {
    sink(value);
  });
  return null;
}

function mount(stageMs?: number) {
  container = document.createElement("div");
  root = createRoot(container);
  act(() => root.render(createElement(Probe, { stageMs, sink: (value: Api) => {
    api = value;
  } })));
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useResearch", () => {
  it("idle → running 0..3 → done с шагом stageMs", () => {
    mount(100);
    expect(api.state).toEqual({ status: "idle" });
    act(() => api.start(vector));
    expect(api.state).toEqual({ status: "running", company: vector, stageIndex: 0 });
    for (const stage of [1, 2, 3]) {
      advance(99);
      expect(api.state).toMatchObject({ stageIndex: stage - 1 });
      advance(1);
      expect(api.state).toEqual({ status: "running", company: vector, stageIndex: stage });
    }
    advance(100);
    expect(api.state).toEqual({ status: "done", company: vector });
    act(() => root.unmount());
  });

  it("по умолчанию этап длится 700 мс", () => {
    mount();
    act(() => api.start(northstar));
    advance(699);
    expect(api.state).toMatchObject({ status: "running", stageIndex: 0 });
    advance(1);
    expect(api.state).toMatchObject({ status: "running", stageIndex: 1 });
    advance(700 * 3);
    expect(api.state).toEqual({ status: "done", company: northstar });
    act(() => root.unmount());
  });

  it("игнорирует start во время прогона", () => {
    mount(100);
    act(() => api.start(vector));
    advance(150);
    act(() => api.start(northstar));
    expect(api.state).toEqual({ status: "running", company: vector, stageIndex: 1 });
    advance(300);
    expect(api.state).toEqual({ status: "done", company: vector });
    act(() => root.unmount());
  });

  it("reset возвращает в idle и чистит таймеры; повторный запуск проходит все этапы", () => {
    mount(100);
    act(() => api.start(vector));
    advance(150);
    act(() => api.reset());
    expect(api.state).toEqual({ status: "idle" });
    expect(vi.getTimerCount()).toBe(0);
    advance(1000);
    expect(api.state).toEqual({ status: "idle" });

    act(() => api.start(northstar));
    expect(api.state).toEqual({ status: "running", company: northstar, stageIndex: 0 });
    advance(400);
    expect(api.state).toEqual({ status: "done", company: northstar });
    act(() => api.reset());
    expect(api.state).toEqual({ status: "idle" });
    act(() => root.unmount());
  });

  it("размонтирование во время прогона чистит таймеры без предупреждений React", () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    mount(100);
    act(() => api.start(vector));
    advance(150);
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    act(() => root.unmount());
    expect(vi.getTimerCount()).toBe(0);
    advance(1000);
    expect(errors).not.toHaveBeenCalled();
    errors.mockRestore();
  });

  it("при prefers-reduced-motion этап по умолчанию — 120 мс", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("reduce"),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
    try {
      mount();
      act(() => api.start(vector));
      advance(120 * 4);
      expect(api.state).toEqual({ status: "done", company: vector });
      act(() => root.unmount());
    } finally {
      window.matchMedia = original;
    }
  });
});
