import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

const COMPANIES = [
  { name: "Northstar Bank", id: "northstar-bank", industry: "Финансовые услуги", completeness: "10 из 10" },
  { name: "Vector Logistics", id: "vector-logistics", industry: "Логистика", completeness: "10 из 10" },
  { name: "Atlas Commerce", id: "atlas-commerce", industry: "E-commerce", completeness: "9 из 10" },
] as const;

const demo = (page: Page) => page.locator("#demo");
const chip = (page: Page, name: string) => demo(page).getByRole("group", { name: "Демо-компании" }).getByRole("button", { name: new RegExp(`^${name}`) });
const field = (page: Page) => demo(page).getByLabel("Или введите название");
const startButton = (page: Page) => demo(page).getByRole("button", { name: "Начать исследование" });
const card = (page: Page) => demo(page).locator("article[data-company]");

function collectConsole(page: Page) {
  const problems: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") problems.push(`${msg.type()}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`pageerror: ${err.message}`));
  return problems;
}

async function runCompany(page: Page, name: string) {
  await chip(page, name).click();
  await startButton(page).click();
  await expect(card(page).getByRole("heading", { name })).toBeVisible();
  await expect(demo(page).getByRole("button", { name: "Скопировать профиль" })).toBeVisible();
}

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe("первый экран", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("на 1440×900 видны H1 из трёх фраз, обе кнопки и живая рабочая область", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1");
    await expect(h1).toHaveText("Находите компании.Понимайте их потребности.Выходите на нужных людей.");
    // Каждая фраза начинается с новой строки; длинные фразы переносятся сбалансированно.
    const tops = await h1.locator(":scope > span").evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top));
    expect(tops).toHaveLength(3);
    expect(tops[1]).toBeGreaterThan(tops[0]);
    expect(tops[2]).toBeGreaterThan(tops[1]);
    await expect(h1).toBeInViewport({ ratio: 1 });
    await expect(page.getByRole("link", { name: "Исследовать компанию" })).toBeInViewport({ ratio: 1 });
    await expect(page.getByRole("link", { name: "Как это работает" })).toBeInViewport({ ratio: 1 });
    const desk = page.getByTestId("hero-desk");
    await expect(desk).toBeInViewport({ ratio: 0.6 });
    for (const text of ["Анализ компании", "Формирование профиля", "Повод для контакта", "Кому писать", "Источники (демо)"]) {
      await expect(desk.getByText(text, { exact: true }).first()).toBeAttached();
    }
    const path = desk.getByText("AI RESEARCH WORKSPACE", { exact: true });
    await expect(path).toBeInViewport();
    expect(await path.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(/Plex Mono|monospace/i);
  });

  test("над H1 нет подписи, «AI RESEARCH WORKSPACE» — в строке пути рабочей области", async ({ page }) => {
    await page.goto("/");
    // Первый элемент текстовой колонки — H1.
    expect(await page.locator("h1").evaluate((el) => el.parentElement?.firstElementChild === el)).toBe(true);
    const desk = page.getByTestId("hero-desk");
    await expect(desk.getByText("AI RESEARCH WORKSPACE", { exact: true })).toHaveCount(1);
    const pathRow = desk.getByText("AI RESEARCH WORKSPACE").locator("..");
    await expect(pathRow).toHaveText("leadpilot / AI RESEARCH WORKSPACE / vector-logistics");
    // Курсор — в поисковом поле рабочей области.
    await expect(desk.locator(".px-caret")).toHaveCount(1);
    await expect(desk.locator(".px-caret")).toBeVisible();
  });

  test("кнопки hero ведут к демо и к процессу", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Исследовать компанию" })).toHaveAttribute("href", "#demo");
    await expect(page.getByRole("link", { name: "Как это работает" })).toHaveAttribute("href", "#how");
  });

  test("цикл рабочей области идёт на экране и встаёт на паузу вне его", async ({ page }) => {
    await page.goto("/");
    const desk = page.getByTestId("hero-desk");
    await expect(desk).toHaveAttribute("data-playing", "true");
    await page.locator("#demo").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(desk).toHaveAttribute("data-playing", "false");
  });

  test("при reduced-motion — статичный финальный кадр", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const desk = page.getByTestId("hero-desk");
    await page.waitForTimeout(600);
    await expect(desk).toHaveAttribute("data-playing", "false");
    await expect(desk.locator('[data-state="pending"]')).toHaveCount(0);
    await expect(desk.getByText("Vector Logistics").first()).toBeVisible();
  });
});

test.describe("строка пути на узком экране", () => {
  test.use({ viewport: { width: 390, height: 760 } });

  test("«AI RESEARCH WORKSPACE» в строке пути не обрезана", async ({ page }) => {
    await page.goto("/");
    const path = page.getByTestId("hero-desk").getByText("AI RESEARCH WORKSPACE", { exact: true });
    await expect(path).toBeInViewport({ ratio: 1 });
  });
});

test.describe("без JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });

  test("hero показывает финальный кадр карточки, демо читаемо", async ({ page }) => {
    await page.goto("/");
    const desk = page.getByTestId("hero-desk");
    await expect(desk.getByText("Vector Logistics").first()).toBeVisible();
    await expect(desk.getByText("Demo profile")).toBeVisible();
    await expect(desk.locator('[data-state="pending"]')).toHaveCount(0);
    await expect(demo(page).getByText("Все компании и данные вымышленные — демонстрационный режим")).toBeVisible();
  });
});

test.describe("демо", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("пометка о вымышленных данных видна в секции демо", async ({ page }) => {
    await page.goto("/#demo");
    await expect(demo(page).getByText("Все компании и данные вымышленные — демонстрационный режим")).toBeInViewport();
  });

  test("четыре этапа по очереди с объявлением, запуск и выбор заблокированы, затем карточка", async ({ page }) => {
    const problems = collectConsole(page);
    await page.goto("/#demo");
    await chip(page, "Vector Logistics").click();
    await startButton(page).click();
    const live = demo(page).getByTestId("demo-live");
    await expect(live).toHaveAttribute("aria-live", "polite");
    await expect(live).toHaveText("Этап 1 из 4: Анализ компании");
    await expect(startButton(page)).toHaveAttribute("aria-disabled", "true");
    await expect(chip(page, "Northstar Bank")).toBeDisabled();
    await expect(live).toHaveText("Этап 2 из 4: Поиск IT-инициатив");
    await expect(live).toHaveText("Этап 3 из 4: Определение релевантных должностей");
    await expect(live).toHaveText("Этап 4 из 4: Формирование профиля");
    await expect(live).toHaveText(/^Профиль готов: Vector Logistics/);
    await expect(card(page).getByRole("heading", { name: "Vector Logistics" })).toBeFocused();
    await expect(card(page).locator('[data-state="pending"]')).toHaveCount(0);
    expect(problems).toEqual([]);
  });

  test.describe("с reduced-motion", () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/#demo");
    });

    test("три компании дают разные карточки со всеми полями ТЗ", async ({ page }) => {
      const texts: string[] = [];
      for (const c of COMPANIES) {
        await runCompany(page, c.name);
        const article = card(page);
        await expect(article).toHaveAttribute("data-company", c.id);
        await expect(article).toContainText(c.industry);
        for (const label of [
          "Отрасль",
          "Размер · демоданные",
          "Краткое описание",
          "Возможные IT-потребности",
          "Релевантные должности",
          "Сигналы потенциальной потребности",
          "Источники (демо)",
          "Повод для первого контакта",
          "Кому писать",
          "Demo profile",
        ]) {
          await expect(article.getByText(label, { exact: true })).toBeVisible();
        }
        await expect(article.getByTestId("completeness")).toHaveText(`Полнота профиля (демо): ${c.completeness} полей`);
        texts.push(await article.innerText());
        await demo(page).getByRole("button", { name: "Исследовать другую компанию" }).click();
      }
      expect(new Set(texts).size).toBe(3);
    });

    test("«Исследовать другую компанию» возвращает к выбору с фокусом, повторный запуск проходит заново", async ({ page }) => {
      await runCompany(page, "Northstar Bank");
      await demo(page).getByRole("button", { name: "Исследовать другую компанию" }).click();
      await expect(card(page)).toHaveCount(0);
      const focused = page.locator(":focus");
      await expect(focused).toHaveAttribute("aria-pressed", /true|false/);
      await expect(chip(page, "Northstar Bank")).toBeFocused();
      await runCompany(page, "Atlas Commerce");
      await expect(card(page).getByText("нет в открытых источниках (демо)")).toBeVisible();
      await demo(page).getByRole("button", { name: "Исследовать другую компанию" }).click();
      await runCompany(page, "Atlas Commerce");
    });

    test("ошибки ввода у поля, введённое сохраняется", async ({ page }) => {
      const input = field(page);
      const cases = [
        { value: "", message: "Введите название компании или выберите пример" },
        { value: "A", message: "Слишком короткое название" },
        { value: "x".repeat(81), message: "Название длиннее 80 символов" },
      ];
      for (const { value, message } of cases) {
        await input.fill(value);
        await startButton(page).click();
        await expect(input).toHaveAttribute("aria-invalid", "true");
        const describedBy = (await input.getAttribute("aria-describedby")) ?? "";
        const error = demo(page).getByText(message, { exact: true });
        await expect(error).toBeVisible();
        expect(describedBy.split(" ")).toContain(await error.getAttribute("id"));
        await expect(input).toHaveValue(value);
        await expect(card(page)).toHaveCount(0);
      }
      await input.fill("Vector");
      await expect(input).not.toHaveAttribute("aria-invalid", "true");
    });

    test("чужое название — уведомление о полной версии с чипами, этапы не запускаются", async ({ page }) => {
      await field(page).fill("Рога и копыта");
      await startButton(page).click();
      const notice = demo(page).getByTestId("demo-notice");
      await expect(notice).toContainText("Живой анализ доступен в полной версии LeadPilot. В демо можно исследовать три примера");
      await expect(demo(page).locator('li[data-state="active"], li[data-state="done"]')).toHaveCount(0);
      await expect(card(page)).toHaveCount(0);
      await expect(field(page)).toHaveValue("Рога и копыта");
      await notice.getByRole("button", { name: "Atlas Commerce" }).click();
      await expect(field(page)).toHaveValue("Atlas Commerce");
      await expect(notice).toHaveCount(0);
      await startButton(page).click();
      await expect(card(page).getByRole("heading", { name: "Atlas Commerce" })).toBeVisible();
    });

    test("«northstar bank» в любом регистре запускает Northstar Bank", async ({ page }) => {
      await field(page).fill("  nORTHSTAR   bank ");
      await page.keyboard.press("Enter");
      await expect(card(page).getByRole("heading", { name: "Northstar Bank" })).toBeVisible();
    });

    test("«Скачать CSV» скачивает leadpilot-<id>-demo.csv с BOM", async ({ page }) => {
      await runCompany(page, "Vector Logistics");
      const [download] = await Promise.all([
        page.waitForEvent("download"),
        demo(page).getByRole("button", { name: "Скачать CSV" }).click(),
      ]);
      expect(download.suggestedFilename()).toBe("leadpilot-vector-logistics-demo.csv");
      const content = await readFile((await download.path())!, "utf8");
      expect(content.charCodeAt(0)).toBe(0xfeff);
      expect(content).toContain("Компания;Vector Logistics");
    });
  });
});

test.describe("копирование", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("с правами буфера — «Профиль скопирован» и текст карточки в буфере", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#demo");
    await runCompany(page, "Northstar Bank");
    await demo(page).getByRole("button", { name: "Скопировать профиль" }).click();
    await expect(demo(page).getByText("Профиль скопирован")).toBeVisible();
    const text = await page.evaluate(() => navigator.clipboard.readText());
    expect(text.split("\n")[0]).toBe("LeadPilot — Demo profile (вымышленные данные)");
    expect(text).toContain("Northstar Bank");
  });

  test("без буфера — понятное сообщение", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: () => Promise.reject(new DOMException("denied", "NotAllowedError")) },
      });
      document.execCommand = () => false;
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/#demo");
    await runCompany(page, "Atlas Commerce");
    await demo(page).getByRole("button", { name: "Скопировать профиль" }).click();
    await expect(demo(page).getByText("Не удалось скопировать — выделите текст карточки вручную")).toBeVisible();
  });
});

for (const width of [390, 320]) {
  test.describe(`мобильная ширина ${width}`, () => {
    test.use({ viewport: { width, height: 760 } });

    test("демо работает целиком, без горизонтальной прокрутки", async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/#demo");
      await noHorizontalScroll(page);
      await field(page).fill("");
      await startButton(page).click();
      await expect(demo(page).getByText("Введите название компании или выберите пример")).toBeVisible();
      await runCompany(page, "Vector Logistics");
      await noHorizontalScroll(page);
      for (const name of ["Скопировать профиль", "Скачать CSV", "Исследовать другую компанию"]) {
        const button = demo(page).getByRole("button", { name });
        const box = await button.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      }
      await demo(page).getByRole("button", { name: "Исследовать другую компанию" }).click();
      await runCompany(page, "Northstar Bank");
    });
  });
}
