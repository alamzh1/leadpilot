import { expect, test, type Page } from "@playwright/test";

const WIDTHS = [1440, 1024, 768, 390, 320] as const;

function collectConsole(page: Page) {
  const problems: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") problems.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));
  page.on("requestfailed", (req) => problems.push(`requestfailed: ${req.url()}`));
  page.on("response", (res) => {
    if (res.status() >= 400) problems.push(`${res.status()}: ${res.url()}`);
  });
  return problems;
}

for (const width of WIDTHS) {
  test(`ширина ${width}: консоль и сеть чистые, нет горизонтальной прокрутки после полного скролла`, async ({ page }) => {
    const problems = collectConsole(page);
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
    });
    await page.waitForLoadState("networkidle");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(problems).toEqual([]);
  });
}

test("у каждого <img> есть alt; lang=ru; ровно один main", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.locator("main")).toHaveCount(1);
  const imgs = await page.locator("img").evaluateAll((els) =>
    els.map((el) => ({ src: el.getAttribute("src"), alt: el.getAttribute("alt") })),
  );
  expect(imgs.length).toBeGreaterThan(0);
  for (const img of imgs) expect(img.alt, `alt у ${img.src}`).not.toBeNull();
});

test("Tab проходит по всем интерактивным элементам, фокус виден у каждого", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const total = await page.evaluate(
    () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("a[href], button, input, textarea, select, [tabindex]:not([tabindex='-1'])"),
      ).filter((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return !el.hasAttribute("disabled") && cs.visibility !== "hidden" && cs.display !== "none" && r.width > 0 && r.height > 0;
      }).length,
  );
  expect(total).toBeGreaterThan(10);

  const seen = new Set<string>();
  const invisible: string[] = [];
  for (let i = 0; i < total + 5; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const outlined = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
      const shadow = cs.boxShadow !== "none";
      const r = el.getBoundingClientRect();
      const label = `${el.tagName.toLowerCase()}:${(el.getAttribute("aria-label") ?? el.textContent ?? el.getAttribute("href") ?? "").trim().slice(0, 40)}`;
      return { label, visible: outlined || shadow, key: label + "@" + Math.round(r.top + window.scrollY) + "," + Math.round(r.left) };
    });
    if (!info) continue;
    if (!info.visible) invisible.push(info.label);
    seen.add(info.key);
  }
  expect(invisible, "элементы без видимого фокуса").toEqual([]);
  expect(seen.size).toBeGreaterThanOrEqual(Math.floor(total * 0.9));
});
