import { describe, expect, it } from "vitest";
import { DEMO_COMPANIES, RESEARCH_STAGES, findDemoCompany } from "@/lib/demo/companies";
import type { DemoCompany } from "@/lib/demo/types";

describe("DEMO_COMPANIES", () => {
  it("содержит три компании в порядке из ТЗ", () => {
    expect(DEMO_COMPANIES.map((c) => c.name)).toEqual([
      "Northstar Bank",
      "Vector Logistics",
      "Atlas Commerce",
    ]);
  });

  it("профили различаются по всем полям", () => {
    const keys: (keyof DemoCompany)[] = [
      "id",
      "name",
      "industry",
      "size",
      "description",
      "itNeeds",
      "roles",
      "signals",
      "sources",
    ];
    for (const key of keys) {
      const values = new Set(DEMO_COMPANIES.map((c) => JSON.stringify(c[key])));
      expect(values.size, key).toBe(3);
    }
    expect(new Set(DEMO_COMPANIES.map((c) => c.outreach.reason)).size).toBe(3);
    expect(new Set(DEMO_COMPANIES.map((c) => c.outreach.role)).size).toBe(3);
  });

  it("источники помечены как демо, с датой и без URL", () => {
    for (const c of DEMO_COMPANIES) {
      expect(c.sources.length).toBeGreaterThanOrEqual(3);
      expect(c.sources.length).toBeLessThanOrEqual(5);
      for (const s of c.sources) {
        expect(s.kind).toMatch(/\(демо\)$/);
        expect(s.date).toMatch(/^\d{4}-\d{2}$/);
        expect(JSON.stringify(s)).not.toMatch(/https?:|www\.|\.ru\b|\.com\b/);
      }
    }
  });

  it("в должностях и блоке решения нет имён — только должности", () => {
    const rolePattern = /^(C[A-Z]{1,3}O|Head of [A-Z][a-z]+|Директор по [а-яё ]+)$/;
    for (const c of DEMO_COMPANIES) {
      expect(c.roles.length).toBeGreaterThanOrEqual(3);
      for (const r of c.roles) expect(r).toMatch(rolePattern);
      expect(c.outreach.role).toMatch(rolePattern);
      expect(c.roles).toContain(c.outreach.role);
    }
  });

  it("у каждой 3–4 IT-потребности и 3–4 сигнала", () => {
    for (const c of DEMO_COMPANIES) {
      expect(c.itNeeds.length).toBeGreaterThanOrEqual(3);
      expect(c.itNeeds.length).toBeLessThanOrEqual(4);
      expect(c.signals.length).toBeGreaterThanOrEqual(3);
      expect(c.signals.length).toBeLessThanOrEqual(4);
    }
  });
});

describe("RESEARCH_STAGES", () => {
  it("четыре этапа из ТЗ по порядку", () => {
    expect(RESEARCH_STAGES.map((s) => s.label)).toEqual([
      "Анализ компании",
      "Поиск IT-инициатив",
      "Определение релевантных должностей",
      "Формирование профиля",
    ]);
  });
});

describe("findDemoCompany", () => {
  it("находит компанию по точному названию", () => {
    expect(findDemoCompany("Vector Logistics")?.id).toBe("vector-logistics");
  });

  it("не учитывает регистр, пробелы по краям и повторные пробелы", () => {
    expect(findDemoCompany("  northstar   BANK ")?.id).toBe("northstar-bank");
    expect(findDemoCompany("ATLAS\tcommerce")?.id).toBe("atlas-commerce");
  });

  it("не находит частичные и чужие названия", () => {
    expect(findDemoCompany("Atlas")).toBeUndefined();
    expect(findDemoCompany("Яндекс")).toBeUndefined();
    expect(findDemoCompany("")).toBeUndefined();
  });
});
