// Полные снимки страницы для docs/screenshots/. Нужен собранный out/ и запущенный сервер:
//   PORT=4310 node tests/e2e/serve.mjs out &  node scripts/screenshots.mjs
import { chromium } from "@playwright/test";

const url = process.env.URL ?? "http://127.0.0.1:4310/";
const shots = [
  { file: "docs/screenshots/desktop-1440.png", width: 1440, height: 900 },
  { file: "docs/screenshots/mobile-390.png", width: 390, height: 844 },
];

const browser = await chromium.launch();
for (const { file, width, height } of shots) {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
  await page.goto(url, { waitUntil: "networkidle" });
  // Прокрутка всей страницы, чтобы сработали появления, затем наверх.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight / 2);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  // Полоса hero прилипает к низу экрана (sticky): снимаем при высоте окна во всю страницу,
  // чтобы она стояла на своём месте под рабочей областью, а не поверх неё.
  const full = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewportSize({ width, height: full });
  await page.waitForTimeout(300);
  await page.screenshot({ path: file, fullPage: true });
  await page.close();
  console.log("saved", file);
}
await browser.close();
