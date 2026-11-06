# Архитектура LeadPilot

Одностраничный лендинг (Next.js, статический экспорт `output: "export"`) с интерактивным демо на локальных вымышленных данных. Бэкенда и сетевых запросов в рантайме нет.

## Поток данных демо

1. `lib/demo/companies.ts` — `DEMO_COMPANIES` (ровно три: Northstar Bank, Vector Logistics, Atlas Commerce), `RESEARCH_STAGES` (4 этапа), `findDemoCompany(query)` (без учёта регистра и лишних пробелов).
2. `components/demo/DemoWorkspace.tsx` (client) берёт ввод или чип → `checkQuery` из `lib/demo/profile.ts` (`empty` / `too-short` / `too-long` / `not-in-demo`, тексты ошибок — `QUERY_MESSAGES`) → `start(company)` из `lib/demo/useResearch.ts`.
3. `useResearch` — машина `idle → running(stageIndex 0..3) → done`. Этап 700 мс, при reduced-motion 120 мс; таймеры чистятся при `reset` и размонтировании; `start` при `running` игнорируется.
4. Отрисовка: `StageRail` (рельс этапов, `li[data-state]`), `PixelAssembly` (4px-фрагменты; при reduced-motion `null`), `ProfileCard` (`resolvedCount` 0..11 — сколько полей перешло из pending в verified; порядок полей задаёт `PROFILE_FIELDS`).
5. Экспорт: `profileToText` / `profileToCsv` / `csvFileName` (`lib/demo/profile.ts`) → `copyText` / `downloadText` (`lib/clipboard.ts`; запасной путь через скрытую `textarea`, исключений наружу не бросает).
6. `HeroDesk` (hero) — анимированная aria-hidden копия демо на тех же данных (`data-testid="hero-desk"`), только чтение. Hero (`data-testid="hero"`) — ровно `100svh − nav`: рабочая область забирает остаток высоты и срезана маской `.hero-window`.
7. «Для кого» — три карточки с id `audience-outsourcing` / `audience-sales` / `audience-agencies` (на них ссылается подвал).

Полнота профиля: `profileCompleteness().total = 10`; значение «нет в открытых источниках (демо)» (`NOT_IN_PUBLIC_SOURCES`) не считается заполненным — у Atlas Commerce 9 из 10. Статус «Demo profile» не в счёте.

## Границы модулей

- `lib/site.ts` — `SITE`, `REPO_URL`, `NAV_LINKS`, `SECTIONS` (id якорей), `NAV_HEIGHT_PX`, `BASE_PATH`, `asset()`.
- `lib/demo/*` — данные и чистые функции, без React, кроме `useResearch.ts`. Unit-тесты — `tests/unit/`.
- `components/ui/` — примитивы: `Button` (primary/ghost, с `href` — `<a>`), `Chip` (`aria-pressed`), `PixelIcon` (авторские SVG на сетке 8px), `Reveal` (появление при скролле).
- `components/demo/` — всё про демо-карточку и рельс (`ProfileCard`, `ProfileGhost`, `StageRail`, `PixelAssembly`, `DemoWorkspace`).
- `components/story/` — иллюстрации секций: `ProcessPipeline` (конвейер Discover → Verify → Qualify на данных Vector Logistics), `ProblemSchemas`, `CapabilityFragments` (данные Vector Logistics, только чтение), `PlateImage` (ставит `data-img-failed` на родителя при ошибке загрузки; сеточные фолбэки включаются только по нему).
- `components/sections/` — секции; `app/page.tsx` только собирает их по порядку: Nav, Hero, Demo, Problem, HowItWorks, Capabilities, Audience, FinalCta, Footer. Демо стоит сразу после hero ради критерия «30 секунд до демо».
- Стили и токены — `app/globals.css` (`@theme`), классы `.px-btn` (скруглённые, размеры lg/md/sm), `.px-chip`, `.px-field`, `.inline-badge` (плашка-иконка в строке заголовка), `.t04-*`.
- Изображения — `public/images/{hero-plate,research}.webp` (+ уменьшенные `-1280`/`-800`); у каждой секции с изображением есть CSS-фолбэк. `closing*.webp` на странице больше не используется: финальный блок — текстовый заголовок `.closing-statement` (кегль в `cqi`, строки во всю ширину).
- Раскладка — во всю ширину окна (только гаттеры `--spacing-gutter`, без контейнера `max-w-page`). От 1024px каждая секция — один экран: класс `.screen` (min-height `100svh − nav`, центрирование), отступ `py-fold`; вариант `short:` (≥1024px и высота ≤ 800px) укорачивает фрагменты UI. Демо — ровно экран: карточка профиля при нехватке высоты прокручивается внутри (`scroll-panel`, `data-testid="demo-card-scroll"`).

## Соглашения

- Язык интерфейса — русский; английские названия только из ТЗ (Discover/Verify/Qualify, «Demo profile», «AI RESEARCH WORKSPACE»).
- Тексты секций — дословно из `plan.md` §5; новые тексты в том же тоне: спокойно, без превосходных степеней и цифр эффективности.
- Нельзя: отзывы, логотипы клиентов, проценты и обещания результата, имена реальных людей, ссылки на реальные публикации как источники.
- Пути к статике — только через `asset()`, иначе ломается `basePath` на GitHub Pages.
- Никаких сетевых запросов в рантайме, кроме собственных ресурсов страницы.
- Цвет — состояние: лайм = verified и единственное основное действие в зоне видимости; голубой = непроверенное и вторичные акценты. Других акцентов нет.
- Моноширинный шрифт — только для данных (ключи полей, источники, даты, статусы, путь рабочей области).
- Шрифты: заголовки h1–h3 и `.px-btn` — Inter (`--font-heading`, кириллица заголовков в Inter, см. ADR 0005); `--font-display` (Space Grotesk) — только точечно для латинских меток.
- Все анимации учитывают `prefers-reduced-motion` (`useReducedMotion` или CSS); контент виден по умолчанию, без JS тоже.
- Дизайн-контракт: `.impeccable/surfaces/app-page-tsx.md`. Нельзя: кикер/eyebrow над заголовком (строка «AI RESEARCH WORKSPACE» — хром рабочей области, ADR 0004), градиентный текст, стекло ради стекла, жёсткие смещённые тени, цветной `border-left` толще 1px, одинаковые карточки «иконка + заголовок + текст», эмодзи и юникод-символы вместо иконок.

## Тестовые швы

- Unit (`tests/unit/`): `profile`, `companies`, `useResearch`.
- E2E (`tests/e2e/`) идёт по статическому серверу `tests/e2e/serve.mjs` на `out/` (учитывает basePath): якоря, демо по трём компаниям, ошибки ввода, копирование, CSV, ширины 1440/1024/768/390/320, консоль без ошибок, `design.spec.ts` (иерархия заголовков, гарнитуры, фолбэки), `fold.spec.ts` (секции в один экран на 1440×900/1366×768/1280×720/1920×1080, ширина сетки на 1920).
- Testid: `demo-live`, `demo-notice`, `demo-ghost`, `hero-desk`, `completeness`.
