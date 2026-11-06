# LeadPilot — материалы к тестовому заданию

**Публичная ссылка:** https://alamzh1.github.io/leadpilot/
**Репозиторий:** https://github.com/alamzh1/leadpilot

Лендинг концепт-продукта LeadPilot с интерактивным демо по ТЗ (само ТЗ в репозиторий не входит). Все компании и данные в демо вымышленные и помечены как демонстрационные.

Скриншоты: [desktop 1440](screenshots/desktop-1440.png), [mobile 390](screenshots/mobile-390.png). Запуск и результаты проверок — в [README](../README.md).

## Инструменты

- **Claude Code** — основной исполнитель: чтение ТЗ, запуск скиллов, написание кода и тестов, проверки.
- **Autopilot** (скилл Claude Code) — управление реализацией: бриф и спецификация, разбиение на 6 задач с зависимостями и критериями готовности, учёт прогресса, исполнители по задачам, проверка каждого результата.
- **Impeccable** (скилл Claude Code) — дизайн: контекст проекта, дизайн-контракт поверхности страницы, механический детектор антипаттернов, финальное ревью агентом `impeccable-finish-reviewer`.
- **Higgsfield** (CLI `higgsfield`) — три фоновых изображения (hero, «Как работает», финальный блок); модель GPT Image 2.6, job-id и промпты — в [`higgsfield-prompts.md`](higgsfield-prompts.md).

## Ключевые промпты

Промпты и сообщения даны дословно.

**1. Сообщение пользователя, с которого началась работа** (к нему приложено ТЗ; полный текст брифа — в локальном журнале Autopilot, не публикуется):

> @plan.md  согласно тз создай лендинг. 
> Используй скилл impeccable для дизайна,

**2. Промпт Higgsfield для фона первого экрана** (job `429f4b73-4e51-42ee-aa2f-d5d35605b562`, GPT Image 2.6, 16:9):

> Abstract premium data intelligence environment, dark graphite background, precise luminous lime and icy cyan data paths, layered translucent glass panels, subtle depth, restrained cinematic lighting, sophisticated enterprise SaaS aesthetic, editorial art direction, no text, no logos, no human figures, wide 16:9 composition, negative space for product UI overlay.

**3. Промпт Higgsfield для иллюстрации «Как работает»** (job `4ed56c0d-6e9e-4f24-91f7-a63496396f89`, 4:3):

> Conceptual visualization of structured business intelligence: fragmented data fragments converging into an organized information network, dark background, fine lines, translucent surfaces, lime green highlights, precise geometry, premium technological editorial style, no text, no logos, no fake dashboards, 4:3 composition.

Решения по публикации и дизайну были приняты в диалоге с пользователем и записаны в «Дополнениях» брифа: публикация на GitHub Pages (с повторным вопросом перед push), генерация трёх изображений Higgsfield, «смешанный» вариант дизайн-системы (палитра и шрифты из ТЗ, пиксельные акценты).

## Реализованные функции

- Первый экран: заголовок и подзаголовок из ТЗ, две кнопки, справа анимированная рабочая область (поиск, четыре этапа, карточка профиля), которая сама проигрывает исследование Vector Logistics.
- Интерактивное демо: выбор одной из трёх вымышленных компаний, ввод названия, исследование в четыре этапа («Анализ компании», «Поиск IT-инициатив», «Определение релевантных должностей», «Формирование профиля»), карточка профиля с описанием, IT-потребностями, должностями, сигналами, источниками, поводом для первого контакта и пометкой «Demo profile».
- Проверка ввода (пусто, слишком коротко или длинно) и уведомление, что произвольное название в демо не анализируется.
- Копирование профиля в буфер (с запасным способом) и экспорт в CSV (UTF-8 с BOM, разделитель «;»).
- Секции: проблема, «Как работает» (Discover / Verify / Qualify), «Возможности» (Company Intelligence, Decision Makers, Buying Signals, CRM-ready Export с фрагментами интерфейса), «Для кого», финальный призыв, подвал.
- Адаптивность на 1440, 1024, 768, 390 и 320 px; мобильное меню с закрытием по Esc и возвратом фокуса.
- Доступность: `lang="ru"`, `alt` у изображений, управление с клавиатуры с видимым фокусом, `prefers-reduced-motion` отключает анимации, контент виден без JS.
- Авторские пиксельные иконки и анимация «пиксельной сборки» при появлении профиля.
- Статический экспорт под GitHub Pages (`basePath` из переменной окружения) и workflow деплоя.

## Как задачи были разбиты

ТЗ и журнал Autopilot (задачи, спецификация, интерфейсы) — в локальном репозитории, не публикуются.

| Задача | Содержание |
|---|---|
| 01 | Каркас, дизайн-токены, навигация и логика демо |
| 02 | Три изображения Higgsfield |
| 03 | Первый экран и интерактивное демо |
| 04 | Проблема, процесс, возможности, сегменты, финальный блок |
| 05 | Проверка, аудит, документы, подготовка публикации |
| 06 | Исправления по финальному ревью Impeccable |

Зависимости: 01 и 02 — первые; 03 и 04 зависят от 01 и 02; 06 — на 03 и 04; 05 — на 03, 04 и 06. Коммиты в истории: `Autopilot: план сборки`, `T02` (изображения), `T01`, `T04`, `T03`, `T06`.

## Как велась работа

Только реально выполнявшиеся шаги и команды.

1. **Подготовка.** Перед кодом изучены установленные скиллы Autopilot и Impeccable и доступные инструменты (CLI `higgsfield`, `gh`, Chromium Playwright, Node).
2. **Autopilot** — локальный скрипт Autopilot: `init`, `stage`, `set`, `tickets`, `check-plan`; по ходу — `ticket NN start`, `ticket NN done`, `ticket NN review`, `add` и `coverage` (сверка требований с задачами). Результат каждого таска проверялся по его критериям и `npm run check`.
3. **Impeccable** — `impeccable context`, `impeccable surface-brief write` / `read` (дизайн-контракт `.impeccable/surfaces/app-page-tsx.md`), `impeccable concept-seed`, `impeccable detect --json` по `app/` и `components/`. Финальное ревью агентом `impeccable-finish-reviewer` дало вердикт «fix», из него сделан таск 06.
4. **Higgsfield** — генерация трёх изображений командой `higgsfield` (параметры и job-id в `higgsfield-prompts.md`), конвертация в WebP.
5. **Проверки** — `npm run check` (eslint, `tsc --noEmit`, vitest), `npm run build`, `npm run e2e` (Playwright по `out/`), Lighthouse 12, сборка с `NEXT_PUBLIC_BASE_PATH=/leadpilot` и `scripts/check-basepath.mjs`.
6. **Одно замечание ревью сознательно не применено**: изображения оставлены по промптам ТЗ §6. Строка «AI RESEARCH WORKSPACE» перенесена в путь рабочей области hero по решению пользователя (G02).
7. **Публикация** — репозиторий не создавался и push не выполнялся до согласия пользователя; публикация выполнена на GitHub Pages, адрес указан выше.
