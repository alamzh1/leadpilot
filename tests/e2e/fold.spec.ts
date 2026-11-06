import { expect, test, type Page } from "@playwright/test";

/**
 * Каждый блок — в один экран (от 1024px) и контент во всю ширину окна.
 * Высота каждой секции `main > section` не больше окна; у демо после прогона карточка
 * видна целиком или прокручивается внутри себя — страница внутри секции не прокручивается.
 */
const VIEWPORTS = [
  [1440, 900],
  [1366, 768],
  [1280, 720],
  [1920, 1080],
] as const;

async function sectionHeights(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll("main > section")).map((s) => ({
      id: s.id || "hero",
      height: s.getBoundingClientRect().height,
    })),
  );
}

for (const [width, height] of VIEWPORTS) {
  test.describe(`${width}×${height}`, () => {
    test.use({ viewport: { width, height } });

    test("каждая секция не выше окна", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/");
      const sections = await sectionHeights(page);
      expect(sections.length).toBe(7);
      for (const s of sections) expect(s.height, `#${s.id}`).toBeLessThanOrEqual(height);
    });

    test("демо после прогона: секция в один экран, карточка целиком или с внутренней прокруткой", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/#demo");
      const demo = page.locator("#demo");
      await demo.getByRole("group", { name: "Демо-компании" }).getByRole("button", { name: /^Vector Logistics/ }).click();
      await demo.getByRole("button", { name: "Начать исследование" }).click();
      await expect(demo.getByRole("button", { name: "Скопировать профиль" })).toBeVisible();
      await expect(demo.locator("article[data-company] [data-state='pending']")).toHaveCount(0);

      const box = (await demo.boundingBox())!;
      expect(box.height).toBeLessThanOrEqual(height);
      const card = await demo.getByTestId("demo-card-scroll").evaluate((el) => {
        const r = el.getBoundingClientRect();
        return {
          bottom: r.bottom,
          overflowY: getComputedStyle(el).overflowY,
          scrolls: el.scrollHeight > el.clientHeight + 1,
        };
      });
      // Карточка не выходит за секцию: либо помещается, либо прокручивается сама.
      expect(card.bottom).toBeLessThanOrEqual(box.y + box.height + 0.5);
      if (card.scrolls) expect(["auto", "scroll"]).toContain(card.overflowY);
      // Действия под карточкой — в пределах секции.
      const copy = (await demo.getByRole("button", { name: "Скопировать профиль" }).boundingBox())!;
      expect(copy.y + copy.height).toBeLessThanOrEqual(box.y + box.height);
    });
  });
}

test("1920: сетка каждой секции занимает не меньше 90% ширины окна", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/");
  const widths = await page.evaluate(() =>
    Array.from(document.querySelectorAll("main > section, header nav, footer")).map((s) => {
      const inner = (s.tagName === "SECTION" || s.tagName === "FOOTER" ? s.firstElementChild : s) as HTMLElement;
      const cs = getComputedStyle(inner);
      const content = inner.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      return { id: s.id || s.tagName.toLowerCase(), content };
    }),
  );
  expect(widths.length).toBe(9);
  for (const w of widths) expect(w.content, w.id).toBeGreaterThanOrEqual(1920 * 0.9);
});

test("финальный блок: нет <img>", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#final-cta img")).toHaveCount(0);
});
