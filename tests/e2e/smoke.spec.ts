import { expect, test, type Page } from "@playwright/test";

const NAV = [
  { label: "Возможности", id: "features" },
  { label: "Как работает", id: "how" },
  { label: "Демо", id: "demo" },
  { label: "Для кого", id: "audience" },
] as const;

function collectConsole(page: Page) {
  const problems: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") problems.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));
  return problems;
}

async function expectHeadingFullyVisible(page: Page, id: string) {
  const heading = page.locator(`#${id} h2`).first();
  // Ждём конца плавной прокрутки: верх секции перестаёт меняться.
  await expect
    .poll(async () => {
      const a = await page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().top);
      await page.waitForTimeout(120);
      const b = await page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().top);
      return a === b;
    })
    .toBe(true);
  await expect(heading).toBeInViewport({ ratio: 1 });
  const navBottom = await page.locator("header").first().evaluate((el) => el.getBoundingClientRect().bottom);
  const sectionTop = await page.locator(`#${id}`).evaluate((el) => el.getBoundingClientRect().top);
  expect(Math.abs(sectionTop - navBottom)).toBeLessThanOrEqual(2);
}

test("страница открывается: lang, title, один H1, OG, консоль чистая", async ({ page }) => {
  const problems = collectConsole(page);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page).toHaveTitle(/LeadPilot/);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/images\/hero-plate\.webp$/);
  for (const tag of ["header", "nav", "main", "footer"]) await expect(page.locator(tag).first()).toBeAttached();
  await page.waitForLoadState("networkidle");
  expect(problems).toEqual([]);
});

test.describe("desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const { label, id } of NAV) {
    test(`ссылка «${label}» прокручивает к #${id} и не прячет заголовок под навигацией`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("navigation", { name: "Основная навигация" }).getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expectHeadingFullyVisible(page, id);
    });
  }

  test("«Попробовать демо» ведёт к демо, навигация остаётся сверху", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Основная навигация" }).getByRole("link", { name: "Попробовать демо" }).click();
    await expect(page).toHaveURL(/#demo$/);
    await expectHeadingFullyVisible(page, "demo");
    await expect(page.locator("header").first()).toBeInViewport();
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("открывается и закрывается по Esc с возвратом фокуса", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Открыть меню" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.focus();
    await page.keyboard.press("Enter");
    const opened = page.getByRole("button", { name: "Закрыть меню" });
    await expect(opened).toHaveAttribute("aria-expanded", "true");
    const panel = page.locator(`#${await opened.getAttribute("aria-controls")}`);
    await expect(panel).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(page.getByRole("button", { name: "Открыть меню" })).toBeFocused();
    await page.keyboard.press("Space");
    await expect(panel).toBeVisible();
  });

  test("клик по ссылке закрывает меню и ведёт к секции", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Открыть меню" }).click();
    const panelId = await page.getByRole("button", { name: "Закрыть меню" }).getAttribute("aria-controls");
    await page.locator(`#${panelId}`).getByRole("link", { name: "Для кого", exact: true }).click();
    await expect(page).toHaveURL(/#audience$/);
    await expect(page.getByRole("button", { name: "Открыть меню" })).toHaveAttribute("aria-expanded", "false");
    await expectHeadingFullyVisible(page, "audience");
  });

  test("нет горизонтальной прокрутки на 320", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
