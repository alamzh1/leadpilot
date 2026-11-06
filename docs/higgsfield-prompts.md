# Промпты Higgsfield

Все три изображения сгенерированы через CLI `higgsfield` 2026-11-06. Модель: GPT Image 2.6 (`gpt_image_2_6`), `--resolution 2k`, качество по умолчанию (в параметрах job указано `low`), по одному прогону на картинку, повторных генераций не было. Промпты дословно из плана (§6). Исходные PNG лежат в `assets-src/` (в git не попадают), в репозитории только WebP (sharp, quality 78).

Проверка глазами: на всех трёх изображениях нет текста, логотипов, людей и фиолетовых градиентов.

## 1. Hero background

- Промпт: `Abstract premium data intelligence environment, dark graphite background, precise luminous lime and icy cyan data paths, layered translucent glass panels, subtle depth, restrained cinematic lighting, sophisticated enterprise SaaS aesthetic, editorial art direction, no text, no logos, no human figures, wide 16:9 composition, negative space for product UI overlay.`
- Соотношение сторон: 16:9 (`--aspect_ratio 16:9`), исходник 2688x1520
- Job-id: `429f4b73-4e51-42ee-aa2f-d5d35605b562`
- Файлы: `public/images/hero-plate.webp` (1920x1086), `public/images/hero-plate-1280.webp` (1280x724)

## 2. Research visualization

- Промпт: `Conceptual visualization of structured business intelligence: fragmented data fragments converging into an organized information network, dark background, fine lines, translucent surfaces, lime green highlights, precise geometry, premium technological editorial style, no text, no logos, no fake dashboards, 4:3 composition.`
- Соотношение сторон: 4:3 (`--aspect_ratio 4:3`), исходник 2336x1744
- Job-id: `4ed56c0d-6e9e-4f24-91f7-a63496396f89`
- Файлы: `public/images/research.webp` (1200x896), `public/images/research-800.webp` (800x597)
- Оговорка: голубой в палитре почти не проявился, доминирует лайм на графитовом.

## 3. Closing visual

- Промпт: `Minimal abstract visualization of a verified connection between companies, elegant data nodes, dark charcoal background, restrained lime accent, clean architectural geometry, subtle dimensionality, high-end B2B software branding, no text, no logos, 16:9 composition.`
- Соотношение сторон: 16:9 (`--aspect_ratio 16:9`), исходник 2688x1520
- Job-id: `437f0a48-1625-4e92-b63c-9fce6c71e056`
- Файлы: `public/images/closing.webp` (1920x1086), `public/images/closing-1280.webp` (1280x724)
- Оговорка: в центре галочка-символ (не текст); два изометрических здания.

## Альтернативный CSS-фон

Каждая секция с изображением должна иметь CSS-фолбэк (градиент или сетка из палитры, без фиолетового) и работать без файла.
