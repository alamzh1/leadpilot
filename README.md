# LeadPilot

Одностраничный русскоязычный лендинг концепт-продукта **LeadPilot** — AI research workspace для B2B-продаж: из названия компании получается структурированный профиль (описание, IT-потребности, релевантные должности, сигналы, источники, повод для первого контакта). На странице есть интерактивное демо на трёх вымышленных компаниях (Northstar Bank, Vector Logistics, Atlas Commerce): исследование в четыре этапа, копирование профиля и экспорт в CSV. Все компании и данные вымышленные, живого анализа нет.

Проект сделан по ТЗ как тестовое задание (само ТЗ в репозиторий не входит); сопроводительные материалы — в [`docs/submission.md`](docs/submission.md).

## Стек

Next.js 16 (App Router, статический экспорт `output: "export"`), React 19, TypeScript, Tailwind CSS v4, Motion, Lucide. Шрифты — Inter, Space Grotesk, IBM Plex Mono (`next/font`). Тесты: Vitest (unit) и Playwright (e2e по собранному `out/`).

## Запуск

```bash
npm install
npm run dev      # локальная разработка, http://localhost:3000
npm run check    # eslint + tsc --noEmit + vitest
npm run build    # статический экспорт в out/
npm run e2e      # Playwright по out/ (нужен свежий npm run build)
```

Для `npm run e2e` нужен Chromium Playwright: `npx playwright install chromium`. Тесты сами поднимают статический сервер `tests/e2e/serve.mjs` на `out/`.

Проверка сборки с `basePath` GitHub Pages:

```bash
NEXT_PUBLIC_BASE_PATH=/leadpilot npm run build
node scripts/check-basepath.mjs   # отдаёт out/ под /leadpilot/ и проверяет, что все ресурсы отвечают 200
```

Скриншоты (`docs/screenshots/`): `PORT=4310 node tests/e2e/serve.mjs out &`, затем `node scripts/screenshots.mjs`.

## Деплой

GitHub Pages через `.github/workflows/deploy.yml`: на push в `main` — `npm ci`, `npm run check`, `npm run build` с `NEXT_PUBLIC_BASE_PATH=/leadpilot`, затем `actions/upload-pages-artifact` и `actions/deploy-pages`. Файл `public/.nojekyll` попадает в `out/` (в workflow добавлен и `touch out/.nojekyll`). Все пути к статике идут через `asset()` из `lib/site.ts`, поэтому сайт работает и в корне, и под `/leadpilot/`. В репозиторий workflow включается настройкой Pages → Source: GitHub Actions. Адрес публикации: <https://alamzh1.github.io/leadpilot/>; репозиторий: <https://github.com/alamzh1/leadpilot>.

Проверено после публикации 2026-11-06: страница отвечает 200, демо проходит на 1440 и 390, ошибок в консоли нет.

## Результаты проверок

На момент сдачи: `npm run check` — 31 unit-тест, `npm run e2e` — 55 тестов, все зелёные (ширины 1440/1024/768/390/320 без горизонтальной прокрутки, консоль и сеть без ошибок, проход Tab с видимым фокусом, `alt` у всех изображений, `lang="ru"`).

### Lighthouse

Lighthouse 12 (desktop — `--preset=desktop`, mobile — настройки по умолчанию), Chromium из кэша Playwright, production-сборка `out/` без `basePath`, локальный сервер `tests/e2e/serve.mjs` с `GZIP=1` (имитирует сжатие GitHub Pages; без сжатия JS отдаётся в несколько раз больше).

| Профиль | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| Desktop | 100 | 100 | 100 | 100 |
| Mobile | 93 | 100 | 100 | 100 |

Цели (90+/95+/95+) достигнуты. На mobile LCP 3.2 с — это симуляция медленной 4G с замедлением CPU; элемент LCP — текстовый абзац первого экрана, основной вклад дают JS-чанки Next.js (около 560 КБ без сжатия). Без `GZIP=1` Performance на mobile — 78: это следствие несжатой отдачи локальным сервером, а не сборки. Замеры по опубликованному адресу не делались.

Детектор Impeccable (`impeccable detect --json app components`): одна advisory-находка — сетка из линий в `app/globals.css`; она включается только как запасной фон, если изображение hero не загрузилось (по ТЗ каждая секция с изображением имеет CSS-фолбэк), при загруженной картинке не рисуется.

## Дизайн и процесс

- Дизайн-контракт: [`.impeccable/surfaces/app-page-tsx.md`](.impeccable/surfaces/app-page-tsx.md); правила проекта — `AGENTS.md`, `PRODUCT.md`.
- ТЗ и журнал Autopilot (разбиение на задачи, спецификация, интерфейсы) — в локальном репозитории, не публикуются.
- Архитектурные решения: [`docs/adr/`](docs/adr/); словарь проекта — [`CONTEXT.md`](CONTEXT.md).
- Промпты изображений Higgsfield: [`docs/higgsfield-prompts.md`](docs/higgsfield-prompts.md).

## Известные ограничения

- Данные демо вымышленные; ручной ввод названия не запускает анализ, а показывает уведомление, что в демо доступны три компании.
- Изображения (hero, «Как работает», финальный блок) сгенерированы по промптам ТЗ §6 без правок; строка «AI RESEARCH WORKSPACE» перенесена в строку пути рабочей области hero по решению пользователя (G02), над H1 её нет. Спорным остаётся только вопрос изображений: финальное ревью Impeccable отметило их, но они оставлены по промптам ТЗ §6.
