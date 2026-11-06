import { describe, expect, it } from "vitest";
import { DEMO_COMPANIES } from "@/lib/demo/companies";
import {
  QUERY_MESSAGES,
  checkQuery,
  csvFileName,
  profileCompleteness,
  profileToCsv,
  profileToText,
} from "@/lib/demo/profile";
import type { DemoCompany } from "@/lib/demo/types";

const [northstar, vector, atlas] = DEMO_COMPANIES;

/** Синтетическая компания для краёв CSV: кавычки, «;», перенос строки. */
const tricky: DemoCompany = {
  id: "atlas-commerce",
  name: 'ООО "Тест; Компания"',
  industry: "Ритейл",
  size: "10–20 сотрудников",
  description: "Первая строка\nвторая строка",
  itNeeds: ["CRM", 'Сайт "под ключ"'],
  roles: ["CTO", "CIO"],
  signals: [{ label: "Вакансии", detail: "Ищут разработчика" }],
  sources: [{ kind: "Сайт (демо)", title: "Главная", date: "2026-01" }],
  outreach: { reason: "Повод", role: "CTO" },
};

describe("checkQuery", () => {
  it("пустой ввод и одни пробелы → empty", () => {
    expect(checkQuery("")).toEqual({ ok: false, reason: "empty" });
    expect(checkQuery("   \t ")).toEqual({ ok: false, reason: "empty" });
  });

  it("меньше двух символов после trim → too-short", () => {
    expect(checkQuery(" A ")).toEqual({ ok: false, reason: "too-short" });
  });

  it("длиннее 80 символов → too-long, ровно 80 — не ошибка длины", () => {
    expect(checkQuery("x".repeat(81))).toEqual({ ok: false, reason: "too-long" });
    expect(checkQuery("x".repeat(80))).toEqual({ ok: false, reason: "not-in-demo" });
  });

  it("неизвестное название → not-in-demo", () => {
    expect(checkQuery("Рога и копыта")).toEqual({ ok: false, reason: "not-in-demo" });
  });

  it("демо-название без учёта регистра и пробелов → ok с компанией", () => {
    expect(checkQuery("  vector   LOGISTICS ")).toEqual({ ok: true, company: vector });
    expect(checkQuery("Northstar Bank")).toEqual({ ok: true, company: northstar });
  });

  it("тексты ошибок из спецификации", () => {
    expect(QUERY_MESSAGES).toEqual({
      empty: "Введите название компании или выберите пример",
      "too-short": "Слишком короткое название",
      "too-long": "Название длиннее 80 символов",
    });
  });
});

describe("profileCompleteness", () => {
  it("считает 10 полей данных: статус «Demo profile» — не поле исследования", () => {
    expect(profileCompleteness(northstar)).toEqual({ filled: 10, total: 10 });
    expect(profileCompleteness(vector)).toEqual({ filled: 10, total: 10 });
  });

  it("у Atlas Commerce размер не найден в открытых источниках — 9 из 10", () => {
    expect(atlas.size).toBe("нет в открытых источниках (демо)");
    expect(profileCompleteness(atlas)).toEqual({ filled: 9, total: 10 });
  });

  it("полнота различается между компаниями", () => {
    const filled = new Set(DEMO_COMPANIES.map((c) => profileCompleteness(c).filled));
    expect(filled.size).toBeGreaterThan(1);
  });

  it("пустые поля и пометка «нет в открытых источниках» не считаются заполненными", () => {
    const partial: DemoCompany = { ...vector, size: " ", signals: [], outreach: { reason: "", role: "CTO" } };
    expect(profileCompleteness(partial)).toEqual({ filled: 7, total: 10 });
    const missing: DemoCompany = { ...vector, industry: "нет в открытых источниках (демо)" };
    expect(profileCompleteness(missing)).toEqual({ filled: 9, total: 10 });
  });
});

describe("profileToText", () => {
  it("первая строка — пометка демо, дальше все поля карточки", () => {
    const text = profileToText(vector);
    const lines = text.split("\n");
    expect(lines[0]).toBe("LeadPilot — Demo profile (вымышленные данные)");
    expect(text).toContain("Vector Logistics");
    expect(text).toContain("Логистика");
    expect(text).toContain("600–800 сотрудников");
    for (const need of vector.itNeeds) expect(text).toContain(need);
    for (const role of vector.roles) expect(text).toContain(role);
    for (const s of vector.signals) expect(text).toContain(s.detail);
    for (const s of vector.sources) {
      expect(text).toContain(s.kind);
      expect(text).toContain(s.date);
    }
    expect(text).toContain(vector.outreach.reason);
    expect(text).toContain("Demo profile");
  });

  it("текст разный для разных компаний", () => {
    expect(profileToText(northstar)).not.toBe(profileToText(atlas));
  });
});

describe("profileToCsv", () => {
  it("начинается с BOM и заголовка «Поле;Значение»", () => {
    const csv = profileToCsv(northstar);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv.slice(1).split("\r\n")[0]).toBe("Поле;Значение");
  });

  it("списки склеены через « | », по строке на поле", () => {
    const rows = profileToCsv(vector).slice(1).split("\r\n");
    expect(rows).toContain("Компания;Vector Logistics");
    expect(rows).toContain(`Релевантные должности;${vector.roles.join(" | ")}`);
    expect(rows).toContain(`IT-потребности;${vector.itNeeds.join(" | ")}`);
  });

  it("экранирует кавычки, «;» и переносы по RFC 4180", () => {
    const csv = profileToCsv(tricky);
    expect(csv).toContain('Компания;"ООО ""Тест; Компания"""');
    expect(csv).toContain('Описание;"Первая строка\nвторая строка"');
    expect(csv).toContain('IT-потребности;"CRM | Сайт ""под ключ"""');
  });
});

describe("csvFileName", () => {
  it("leadpilot-<id>-demo.csv", () => {
    expect(csvFileName(northstar)).toBe("leadpilot-northstar-bank-demo.csv");
    expect(csvFileName(atlas)).toBe("leadpilot-atlas-commerce-demo.csv");
  });
});
