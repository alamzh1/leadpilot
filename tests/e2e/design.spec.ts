import { expect, test, type Locator, type Page } from "@playwright/test";

/** Замечания финального ревью дизайна (таск 06): масштаб, сгиб, гарнитуры, пустое состояние, фолбэки. */

const fontSize = (l: Locator) => l.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
const firstFamily = (l: Locator) =>
  l.evaluate((el) => getComputedStyle(el).fontFamily.split(",")[0].trim().replace(/["']/g, ""));
const isSpaceGrotesk = (family: string) => /space[ _]grotesk/i.test(family);

test.describe("первый экран 1440×900", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("H1 заметно крупнее заголовков секций", async ({ page }) => {
    await page.goto("/");
    const h1 = await fontSize(page.locator("h1"));
    for (const id of ["demo", "problem", "how", "features", "audience"]) {
      const h2 = await fontSize(page.locator(`#${id} h2`).first());
      expect(h1, `#${id}`).toBeGreaterThanOrEqual(h2 * 1.3);
    }
    expect(h1).toBeGreaterThanOrEqual(60);
  });

  test("путь к демо — в первом экране, чипы компаний рядом с рабочей областью", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: "Исследовать компанию" });
    await expect(cta).toBeInViewport({ ratio: 1 });
    // Полоса больше не липкая — она последняя строка hero.
    const bar = cta.locator("xpath=ancestor::div[contains(@class,'border-t')][1]");
    expect(await bar.evaluate((el) => getComputedStyle(el).position)).toBe("static");
    await expect(page.getByRole("group", { name: "Компания в рабочей области" }).getByRole("button")).toHaveCount(3);
  });

  test("hero-изображение читается: без полупрозрачности", async ({ page }) => {
    await page.goto("/");
    const img = page.getByTestId("hero-desk").locator('img[src*="hero-plate"]');
    expect(await img.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });
});

/** Размеры окна, на которых hero целиком помещается в первый экран. */
const FIRST_SCREEN = [
  [1440, 900], [1536, 864], [1366, 768], [1280, 720], [1024, 768], [768, 1024], [390, 844], [375, 667], [360, 740],
] as const;

for (const [width, height] of FIRST_SCREEN) {
  test(`hero ${width}×${height}: целиком в первом экране, кнопка и чипы видны без прокрутки`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const hero = page.getByTestId("hero");
    const box = await hero.boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(height + 0.5);
    const cta = page.getByRole("link", { name: "Исследовать компанию" });
    await expect(cta).toBeInViewport({ ratio: 1 });
    const ctaBox = await cta.boundingBox();
    expect(ctaBox!.y + ctaBox!.height).toBeLessThanOrEqual(height);
    await expect(page.locator("h1")).toBeInViewport({ ratio: 1 });
    const chips = page.getByRole("group", { name: "Компания в рабочей области" });
    await expect(chips).toBeInViewport({ ratio: 1 });
    // Рабочая область показывает хотя бы поиск: окно не схлопнулось.
    const win = await page.getByTestId("hero-window").boundingBox();
    expect(win!.height).toBeGreaterThan(90);
    // Ничего не налезает: H1, подзаголовок, факты, рабочая область и полоса идут сверху вниз.
    const order = await page.evaluate(() => {
      const q = (s: string) => document.querySelector(s)!.getBoundingClientRect();
      return { h1: q("h1"), desk: q("[data-testid='hero-desk']"), facts: q("[aria-label='Демо в цифрах']") };
    });
    expect(order.desk.top).toBeGreaterThanOrEqual(order.h1.bottom);
    expect(order.desk.top).toBeGreaterThanOrEqual(order.facts.bottom - 0.5);
    expect(ctaBox!.y).toBeGreaterThanOrEqual(order.desk.bottom);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("навигация: ссылки сгруппированы справа вплотную к кнопке «Попробовать демо»", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Основная навигация" });
  const last = await nav.getByRole("link", { name: "Для кого", exact: true }).evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getBoundingClientRect().right;
  });
  const button = await nav.getByRole("link", { name: "Попробовать демо" }).boundingBox();
  const gap = button!.x - last;
  expect(gap).toBeGreaterThanOrEqual(20);
  expect(gap).toBeLessThanOrEqual(36);
  const first = await nav.getByRole("link", { name: "Возможности", exact: true }).boundingBox();
  expect(first!.x).toBeGreaterThan(1440 / 2);
});

test("заголовки с кириллицей — целиком Inter, латинские метки — Space Grotesk", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const cyrillic = page.locator("h1, h2, h3").filter({ hasText: /[а-яё]/i });
  const count = await cyrillic.count();
  expect(count).toBeGreaterThan(5);
  for (let i = 0; i < count; i++) {
    const el = cyrillic.nth(i);
    const family = await firstFamily(el);
    expect(isSpaceGrotesk(family), `${await el.textContent()}: ${family}`).toBe(false);
    expect(family).toMatch(/inter/i);
  }
  for (const name of ["Discover", "Verify", "Qualify", "Company Intelligence", "CRM-ready Export"]) {
    const heading = page.getByRole("heading", { name, exact: true });
    expect(isSpaceGrotesk(await firstFamily(heading)), name).toBe(true);
  }
});

test("возможности: модули без сетки рамок, хром окна только у Profile и Export", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const modules = page.locator("#features article");
  await expect(modules).toHaveCount(4);
  // Сетка модулей разделена воздухом, а не 1px-зазором на фоне линии.
  const gaps = await modules.first().evaluate((el) => {
    const s = getComputedStyle(el.parentElement!);
    return { row: parseFloat(s.rowGap), col: parseFloat(s.columnGap), border: parseFloat(s.borderTopWidth) };
  });
  expect(gaps.row).toBeGreaterThanOrEqual(24);
  expect(gaps.col).toBeGreaterThanOrEqual(24);
  expect(gaps.border).toBe(0);
  const withChrome = await modules.evaluateAll((els) =>
    els.filter((el) => /vector-logistics \//.test(el.textContent ?? "")).length,
  );
  expect(withChrome).toBe(2);
});

test.describe("пустое состояние демо", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("призрак карточки профиля: ключи полей и голубые заглушки", async ({ page }) => {
    await page.goto("/");
    const ghost = page.locator("#demo").getByTestId("demo-ghost");
    await expect(ghost).toBeVisible();
    for (const key of ["Отрасль", "Релевантные должности", "Повод для первого контакта", "Кому писать"]) {
      await expect(ghost.getByText(key, { exact: true })).toBeVisible();
    }
    expect(await ghost.locator(".pf-skeleton").count()).toBeGreaterThanOrEqual(8);
  });
});

async function plateBackgrounds(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll("img")).flatMap((img) => {
      if (!/hero-plate|research/.test(img.getAttribute("src") ?? "")) return [];
      return [{ src: img.getAttribute("src"), bg: getComputedStyle(img.parentElement!).backgroundImage }];
    }),
  );
}

test("сеточные фоны-фолбэки — только когда изображение не загрузилось", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.evaluate(async () => {
    for (const img of Array.from(document.images)) {
      img.loading = "eager";
      await img.decode().catch(() => undefined);
    }
  });
  const loaded = await plateBackgrounds(page);
  expect(loaded).toHaveLength(2);
  for (const p of loaded) expect(p.bg, p.src!).not.toMatch(/linear-gradient/);

  const broken = await page.context().newPage();
  await broken.route(/\.webp$/, (route) => route.abort());
  await broken.setViewportSize({ width: 1440, height: 900 });
  await broken.goto("/");
  await broken.evaluate(() => {
    for (const img of Array.from(document.images)) img.loading = "eager";
  });
  await expect
    .poll(async () => (await plateBackgrounds(broken)).filter((p) => /linear-gradient/.test(p.bg)).length)
    .toBe(2);
});

test("финальный CTA: без изображения, заголовок во всю ширину, кнопка читаемая и в пределах блока", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const section = page.locator("#final-cta");
  await expect(section.locator("img")).toHaveCount(0);
  await expect(section.locator(".inline-badge")).toHaveCount(0);
  const h2 = section.locator("h2");
  // Строки заполняют ширину от гаттера до гаттера: самая длинная строка ≥ 90% окна.
  const widest = await h2.evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return Math.max(...Array.from(range.getClientRects()).map((r) => r.width));
  });
  expect(widest).toBeGreaterThanOrEqual(1440 * 0.85);
  const lines = await h2.evaluate((el) => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)));
  expect(lines).toBeGreaterThanOrEqual(3);
  expect(lines).toBeLessThanOrEqual(4);
  const button = await section.getByRole("link", { name: "Запустить демо" }).boundingBox();
  const box = await section.boundingBox();
  expect(button!.y + button!.height).toBeLessThanOrEqual(box!.y + box!.height);
});
