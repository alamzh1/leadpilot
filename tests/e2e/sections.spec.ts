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
  const items = section.locator("li[id^='audience-']");
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

test("все ссылки секций ведут к существующим якорям, кнопки управляют существующими блоками", async ({ page }) => {
  await page.goto("/");
  for (const sel of STORY_SECTIONS) {
    await expect(page.locator(sel)).toHaveCount(1);
    const controls = page.locator(`${sel} a, ${sel} button`);
    const targets = await controls.evaluateAll((els) =>
      els.map((el) =>
        el.tagName === "A"
          ? { kind: "link", target: el.getAttribute("href") }
          : { kind: "button", target: el.getAttribute("aria-controls") },
      ),
    );
    for (const { kind, target } of targets) {
      if (kind === "link") {
        expect(target).toMatch(/^#[a-z-]+$/);
        await expect(page.locator(target!)).toHaveCount(1);
      } else {
        // Кнопка без ссылки — переключатель или стрелка: обязана указывать, чем управляет.
        expect(target, `${sel}: кнопка без действия`).toBeTruthy();
        await expect(page.locator(`[id="${target}"]`)).toHaveCount(1);
      }
    }
  }
});

test("процесс: один конвейер без переключателей — у шага подпись, фрагмент на данных демо и «На выходе»", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const section = page.locator("#how");
  await expect(section.locator("button")).toHaveCount(0);
  const steps = section.locator("ol > li");
  const labels = ["Поиск", "Проверка", "Квалификация"];
  for (let i = 0; i < 3; i++) {
    const step = steps.nth(i);
    await expect(step.getByText(labels[i], { exact: true })).toBeVisible();
    await expect(step).toContainText("vector-logistics /");
    await expect(step).toContainText(/На выходе:/);
  }
  // Discover — непроверенное, Verify — подтверждено и одно устаревшее, Qualify — кому писать.
  await expect(steps.nth(0)).toContainText("не проверено");
  await expect(steps.nth(1)).toContainText("подтверждено");
  await expect(steps.nth(1)).toContainText("устарело");
  await expect(steps.nth(2)).toContainText("Head of Engineering");
  // Соединители-стрелки между шагами (их два) стоят в промежутках между карточками.
  const cards = await steps.locator("article").evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
  const arrows = await steps.locator(":scope > [aria-hidden='true']").evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
  expect(arrows).toHaveLength(2);
  for (let i = 0; i < 2; i++) {
    expect(arrows[i].left).toBeGreaterThanOrEqual(cards[i].right - 1);
    expect(arrows[i].right).toBeLessThanOrEqual(cards[i + 1].left + 1);
  }
  await expect(section.getByRole("link", { name: "Посмотреть на примере" })).toHaveAttribute("href", "#demo");
  // research.webp — небольшая плитка в шапке, а не на всю ширину.
  const tile = await section.locator('img[src*="/images/research"]').boundingBox();
  expect(tile!.width).toBeLessThan(400);
});

test("для кого: три сегмента видны сразу — в ряд на 1440, стопкой на 390, без карусели", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const section = page.locator("#audience");
  await expect(section.locator("button")).toHaveCount(0);
  const cards = section.locator("li[id^='audience-']");
  await expect(cards).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    const card = cards.nth(i);
    for (const label of ["Кто:", "Что смотрит в профиле:", "Результат:"]) await expect(card).toContainText(label);
    await expect(card.locator("dl > div")).not.toHaveCount(0);
  }
  let boxes = await cards.evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
  expect(Math.abs(boxes[0].top - boxes[2].top)).toBeLessThan(2);
  expect(boxes[2].right).toBeLessThanOrEqual(1440);
  // Мини-визуалы разные: разный набор полей профиля.
  const keys = await cards.evaluateAll((els) => els.map((el) => Array.from(el.querySelectorAll("dt")).map((d) => d.textContent).join("|")));
  expect(new Set(keys).size).toBe(3);

  await page.setViewportSize({ width: 390, height: 844 });
  boxes = await cards.evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
  expect(boxes[1].top).toBeGreaterThan(boxes[0].bottom - 1);
  expect(boxes[2].top).toBeGreaterThan(boxes[1].bottom - 1);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("подвал: колонки ссылок ведут к существующим якорям, внешние — в новой вкладке с noopener", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  for (const name of ["Продукт", "Для кого", "Проект"]) {
    await expect(footer.getByRole("heading", { name, exact: true })).toBeVisible();
  }
  const segments = { "IT-аутсорсинг": "#audience-outsourcing", "B2B-продажи": "#audience-sales", "Агентства": "#audience-agencies" };
  for (const [label, href] of Object.entries(segments)) {
    await expect(footer.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", href);
  }
  const links = await footer.locator("a[href^='#']").evaluateAll((els) => els.map((el) => el.getAttribute("href")!));
  expect(links.length).toBeGreaterThanOrEqual(7);
  for (const href of links) await expect(page.locator(href)).toHaveCount(1);
  const external = footer.locator("a[href^='http']");
  await expect(external).toHaveCount(2);
  await expect(external.nth(0)).toHaveAttribute("href", "https://github.com/alamzh1/leadpilot");
  await expect(external.nth(1)).toHaveAttribute("href", "https://github.com/alamzh1/leadpilot#readme");
  for (let i = 0; i < 2; i++) {
    await expect(external.nth(i)).toHaveAttribute("target", "_blank");
    await expect(external.nth(i)).toHaveAttribute("rel", /\bnoopener\b/);
  }
  await expect(footer).toContainText("© 2026 LeadPilot · Product concept · Interactive demo");
  await expect(footer).toContainText("Сайт не использует cookies и не собирает персональные данные.");
  // Никакой крупной лаймовой кнопки в подвале.
  await expect(footer.locator(".px-btn")).toHaveCount(0);
});

test("подвал: ссылка на сегмент прокручивает к его карточке", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("footer").getByRole("link", { name: "B2B-продажи", exact: true }).click();
  await expect(page).toHaveURL(/#audience-sales$/);
  await expect(page.locator("#audience-sales h3")).toBeInViewport({ ratio: 1 });
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
            // Карточки карусели уходят за край намеренно: они внутри горизонтального скроллера,
            // поэтому проверяется сам скроллер — он не должен выходить за окно.
            let target: Element = el;
            for (let p = el.parentElement; p; p = p.parentElement) {
              if (/(auto|scroll)/.test(getComputedStyle(p).overflowX)) target = p;
            }
            if (target !== el) {
              const s = target.getBoundingClientRect();
              return s.left < -0.5 || s.right > window.innerWidth + 0.5;
            }
            const r = el.getBoundingClientRect();
            return r.left < -0.5 || r.right > window.innerWidth + 0.5 || el.scrollWidth > el.clientWidth + 1;
          })
          .map((el) => el.textContent),
      );
      expect(clipped, `${sel} @${width}`).toEqual([]);
    }
  });
}
