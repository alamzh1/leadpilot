import { expect, test } from "@playwright/test";

/** Секции истории ниже демо (таск 04). Ожидаемые тексты — дословно из ТЗ §5.4–5.8. */
const STORY_SECTIONS = ["#problem", "#how", "#features", "#audience", "#final-cta"] as const;

const PROBLEMS = [
  ["Разрозненные источники", "Информация находится в новостях, вакансиях, корпоративных сайтах и публичных профилях."],
  ["Неактуальные контакты", "Должности меняются, а старые данные продолжают попадать в CRM."],
  ["Много данных, мало выводов", "Менеджеру важно понять не только кто клиент, но и зачем с ним связываться."],
] as const;

const STEPS = [
  ["Discover", "Поиск компании и публичных сигналов."],
  ["Verify", "Проверка информации, дат и подтверждающих источников."],
  ["Qualify", "Формирование профиля с релевантными должностями и потенциальными задачами бизнеса."],
] as const;

const MODULES = [
  ["Company Intelligence", "структурированный профиль компании"],
  ["Decision Makers", "поиск релевантных должностей"],
  ["Buying Signals", "признаки потенциальной потребности"],
  ["CRM-ready Export", "копирование и экспорт информации"],
] as const;

const SEGMENTS = [
  ["IT-аутсорсинг", "поиск компаний с растущими техническими командами"],
  ["B2B-продажи", "подготовка к первому контакту"],
  ["Агентства", "исследование компаний перед персонализированным предложением"],
] as const;

test("проблема: заголовок, три проблемы дословно и три разные схемы", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#problem");
  await expect(section.locator("h2")).toHaveText("Исследование компании не должно занимать полдня");
  for (const [title, text] of PROBLEMS) {
    await expect(section.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(section.getByText(text, { exact: true })).toBeVisible();
  }
  const schemas = section.getByRole("img");
  await expect(schemas).toHaveCount(3);
  const names = await schemas.evaluateAll((els) => els.map((el) => el.getAttribute("aria-label") ?? ""));
  expect(new Set(names).size).toBe(3);
  names.forEach((name) => expect(name.length).toBeGreaterThan(10));
});

test.describe("процесс", () => {
  test("горизонтальный на 1440, тексты дословно, изображение research", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const section = page.locator("#how");
    await expect(section.locator("h2")).toHaveText("Как работает LeadPilot");
    const steps = section.locator("ol > li");
    await expect(steps).toHaveCount(3);
    for (const [i, [name, text]] of STEPS.entries()) {
      await expect(steps.nth(i)).toContainText(`0${i + 1}`);
      await expect(steps.nth(i).getByRole("heading", { name, exact: true })).toBeVisible();
      await expect(steps.nth(i).getByText(text, { exact: true })).toBeVisible();
    }
    const boxes = await steps.evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
    expect(Math.abs(boxes[0].top - boxes[2].top)).toBeLessThan(2);
    expect(boxes[1].left).toBeGreaterThan(boxes[0].left);
    expect(boxes[2].left).toBeGreaterThan(boxes[1].left);
    await expect(page.locator('img[src*="/images/research"]')).toHaveCount(1);
  });

  test("вертикальный на 390", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const boxes = await page
      .locator("#how ol > li")
      .evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
    expect(boxes).toHaveLength(3);
    expect(boxes[1].top).toBeGreaterThan(boxes[0].bottom - 1);
    expect(boxes[2].top).toBeGreaterThan(boxes[1].bottom - 1);
  });
});

test("возможности: четыре модуля разного размера с фрагментами UI, помеченными как демо", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const section = page.locator("#features");
  await expect(section.locator("h2")).toHaveText("Возможности");
  const modules = section.locator("article");
  await expect(modules).toHaveCount(4);
  for (const [i, [name, text]] of MODULES.entries()) {
    const mod = modules.nth(i);
    await expect(mod.getByRole("heading", { name, exact: true })).toBeVisible();
    await expect(mod).toContainText(new RegExp(text, "i"));
    await expect(mod).toContainText(/демо/i);
  }
  const sizes = await modules.evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return `${Math.round(r.width)}x${Math.round(r.height)}`;
    }),
  );
  expect(new Set(sizes).size).toBeGreaterThanOrEqual(3);
  // Фрагменты UI, а не иконки: в модулях есть списки/таблица с данными.
  await expect(section.locator("article dl, article ul, article table")).not.toHaveCount(0);
  await expect(section.locator("article table")).toHaveCount(1);
});

test("для кого: три сегмента дословно, у каждого сценарий без процентов", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("#audience");
  await expect(section.locator("h2")).toHaveText("Для кого");
  const items = section.locator("ul > li");
  await expect(items).toHaveCount(3);
  for (const [i, [name, text]] of SEGMENTS.entries()) {
    const item = items.nth(i);
    await expect(item.getByRole("heading", { name, exact: true })).toBeVisible();
    await expect(item).toContainText(new RegExp(text, "i"));
    const scenario = item.locator("[data-scenario]");
    await expect(scenario).toHaveCount(1);
    const words = (await scenario.innerText()).trim().split(/\s+/);
    expect(words.length).toBeGreaterThan(15);
  }
  await expect(section).not.toContainText(/%|в \d+ раз/);
});

test("финальный CTA: заголовок дословно, фон closing, «Запустить демо» ведёт к демо", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const section = page.locator("#final-cta");
  await expect(section.locator("h2")).toHaveText("Меньше времени на поиск. Больше контекста для разговора");
  await expect(section.locator('img[src*="/images/closing"]')).toHaveCount(1);
  const cta = section.getByRole("link", { name: "Запустить демо" });
  await expect(cta).toHaveAttribute("href", "#demo");
  await cta.click();
  await expect(page).toHaveURL(/#demo$/);
  await expect(page.locator("#demo h2").first()).toBeInViewport();
});

test("все ссылки и кнопки секций ведут к существующим якорям", async ({ page }) => {
  await page.goto("/");
  for (const sel of STORY_SECTIONS) {
    await expect(page.locator(sel)).toHaveCount(1);
    const controls = page.locator(`${sel} a, ${sel} button`);
    const hrefs = await controls.evaluateAll((els) =>
      els.map((el) => (el.tagName === "A" ? el.getAttribute("href") : "button")),
    );
    for (const href of hrefs) {
      expect(href, `${sel}: кнопка без действия`).not.toBe("button");
      expect(href).toMatch(/^#[a-z-]+$/);
      await expect(page.locator(href!)).toHaveCount(1);
    }
  }
});

for (const width of [1440, 1024, 768, 390, 320]) {
  test(`ширина ${width}: нет горизонтальной прокрутки и обрезанных кнопок`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    for (const sel of STORY_SECTIONS) {
      const clipped = await page.locator(`${sel} .px-btn, ${sel} h2, ${sel} h3`).evaluateAll((els) =>
        els
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.left < -0.5 || r.right > window.innerWidth + 0.5 || el.scrollWidth > el.clientWidth + 1;
          })
          .map((el) => el.textContent),
      );
      expect(clipped, `${sel} @${width}`).toEqual([]);
    }
  });
}
