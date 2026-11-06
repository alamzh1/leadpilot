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

  test("верх заголовка демо — в первом экране", async ({ page }) => {
    await page.goto("/");
    const box = await page.locator("#demo-title").boundingBox();
    expect(box).not.toBeNull();
    // Видна хотя бы верхняя половина первой строки заголовка.
    expect(box!.y + 28).toBeLessThanOrEqual(900);
  });

  test("hero-изображение читается: без полупрозрачности", async ({ page }) => {
    await page.goto("/");
    const img = page.getByTestId("hero-desk").locator('img[src*="hero-plate"]');
    expect(await img.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });
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
      if (!/hero-plate|research|closing/.test(img.getAttribute("src") ?? "")) return [];
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
  expect(loaded).toHaveLength(3);
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
    .toBe(3);
});

test("финальный CTA: кнопка не лежит на изображении", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const section = page.locator("#final-cta");
  const button = await section.getByRole("link", { name: "Запустить демо" }).boundingBox();
  const img = await section.locator('img[src*="closing"]').boundingBox();
  expect(button && img).toBeTruthy();
  expect(button!.y + button!.height).toBeLessThanOrEqual(img!.y);
});
