<!-- autopilot:start -->
# LeadPilot

Лендинг AI-сервиса для исследования B2B-компаний с интерактивным демо — тестовое задание на позицию «Помощник руководителя / AI-ассистент / Vibe Coder».

## Команды

| Что | Команда |
|---|---|
| установка | `npm ci` |
| dev-сервер | `npm run dev` |
| eslint + tsc + vitest (31 тест) | `npm run check` |
| статический экспорт в `out/` | `npm run build` |
| Playwright по `out/` (81 тест, нужен свежий build) | `npm run e2e` |
| сборка с basePath + проверка ресурсов | `NEXT_PUBLIC_BASE_PATH=/leadpilot npm run build && node scripts/check-basepath.mjs` |
| один unit-файл | `npx vitest run tests/unit/<file>` |
| один e2e-файл | `npx playwright test tests/e2e/<file>` |
| снимки в `docs/screenshots/` | `PORT=4310 node tests/e2e/serve.mjs out & node scripts/screenshots.mjs` |

## Где что

- Архитектура, поток данных демо, границы модулей, соглашения — `docs/architecture.md`.
- Демо-данные и чистая логика — `lib/demo/`; константы и `asset()` — `lib/site.ts`.
- Секции — `components/sections/`, сборка в `app/page.tsx`; стили и токены — `app/globals.css`.
- Тексты секций — `plan.md` §5; термины — `CONTEXT.md`; решения — `docs/adr/`.
- Дизайн: `DESIGN.md`, `design-system.md`, `PRODUCT.md`, контракт `.impeccable/surfaces/app-page-tsx.md`; перед любой правкой UI прочитай `.claude/skills/impeccable/reference/craft-floor.md`.
- Тесты — `tests/unit/`, `tests/e2e/` (сервер `tests/e2e/serve.mjs`); деплой — `.github/workflows/deploy.yml`.

## Подводные камни

- Публикация: push в `main` публичного репозитория github.com/alamzh1/leadpilot → `.github/workflows/deploy.yml` (npm ci, check, build с `/leadpilot`; e2e в CI нет) → https://alamzh1.github.io/leadpilot/. Публичный репозиторий собирается из копии без папки `.autopilot`.
- Любой путь к статике — через `asset()` из `lib/site.ts`, иначе страница сломается под `/leadpilot`.
- `npm run e2e` читает готовый `out/`, сам не собирает; после правок сначала `npm run build`. Сборка с `NEXT_PUBLIC_BASE_PATH` затирает `out/` — перед e2e пересобери без неё.
- Playwright поднимает сервер на порту 4173 и переиспользует уже занятый (`reuseExistingServer`) — устаревший сервер даст устаревшие результаты.
- Демо — три вымышленные компании без поиска; любой другой ввод даёт `not-in-demo`, это задумано (ADR 0002).
- `assets-src/`, `out/`, `.next/`, `test-results/` в `.gitignore`; в `public/images/` лежат только готовые webp.

## Окружение

- `NEXT_PUBLIC_BASE_PATH` — префикс для GitHub Pages (`/leadpilot`); в dev и e2e пуст.
- `PORT` — порт `tests/e2e/serve.mjs` (по умолчанию 4173 для Playwright); `URL` — адрес для `scripts/screenshots.mjs`.
- `CI` — переключает retries и `forbidOnly` в Playwright.

Подробнее об устройстве — `docs/architecture.md`.

## Как здесь работает Autopilot

Сборка ведётся навыком `/autopilot`. Требования, спецификация и таски — в `.autopilot/`.
Прогресс — `.autopilot/dashboard.html`. Требование из `manifest.md` может снять
только пользователь. Прерванную сборку продолжает «продолжи автопилот».

### Правка без автопилота

Мелкий баг или доводка после сборки — обычная сессия, без прогона.

Сначала прочитай:
1. `.autopilot/PROGRESS.md` — что не доделано, известные баги, о чём договорились с пользователем.
2. Что правили после последней сборки — первая строка таблицы в «История git».
3. Только если правка их касается: почему сделано так — `docs/adr/`; что значат слова — `CONTEXT.md`;
   что именно просили — `manifest.md` в папке сборки (указана в начале `PROGRESS.md`).

После правки:
- коммит — по правилам из «История git»;
- строка в «Правки без автопилота» в `PROGRESS.md`: дата — что — почему;
- починенный пункт из «Не доделано» или «Известные баги» — удали;
- договорились с пользователем о том, что следующая сборка не должна пересматривать, —
  строка в «Договорились», его словами.

### История git

Целиком не читай — бери срез под вопрос:

| Вопрос | Команда |
|---|---|
| что правили после последней сборки | `git log --oneline "$(git log -1 --format=%h --grep='^Autopilot: сборка сдана')"..HEAD -- . ':(exclude).autopilot'` |
| всё, что делали ради требования | `git log --oneline --grep="R02"` |
| история файла | `git log --oneline -10 -- <файл>` |
| когда появился или исчез код | `git log --oneline -S "<фрагмент>"` |
| почему строка такая | `git blame -L <с>,<по> <файл>`, затем `git show <sha>` |
| что внутри коммита | `git show --stat <sha>` |

Срез длиннее ~30 коммитов — отдай его субагенту и возьми выжимку в десять строк.

Коммит: заголовок — что (`fix: даты в одном формате`), тело — почему, трейлер
`--trailer "Requirements: R02"`, если правка касается требования из `manifest.md`.
Заголовок `Autopilot: сборка сдана` пишет только автопилот — по нему находят последнюю сборку.
<!-- autopilot:end -->
