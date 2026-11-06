/** Префикс путей для GitHub Pages (`/leadpilot` в CI, пусто локально). */
export const BASE_PATH: string = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Путь к собственной статике с учётом basePath. `path` начинается с `/`. */
export function asset(path: string): string {
  return BASE_PATH + path;
}

/** id якорей секций. */
export const SECTIONS = {
  demo: "demo",
  features: "features",
  how: "how",
  audience: "audience",
  problem: "problem",
} as const;

export type SectionId = (typeof SECTIONS)[keyof typeof SECTIONS];

export const SITE = {
  name: "LeadPilot",
  title: "LeadPilot — AI research workspace для B2B-продаж",
  description:
    "LeadPilot собирает публичную информацию о B2B-компаниях в один профиль: бизнес, IT-проекты, руководители и сигналы потенциальной потребности. Концепт продукта с интерактивным демо.",
  /** Origin публикации; путь (basePath) добавляется в `SITE_URL`. */
  url: "https://alamzh1.github.io",
} as const;

export const NAV_LINKS: readonly { href: `#${SectionId}`; label: string }[] = [
  { href: `#${SECTIONS.features}`, label: "Возможности" },
  { href: `#${SECTIONS.how}`, label: "Как работает" },
  { href: `#${SECTIONS.demo}`, label: "Демо" },
  { href: `#${SECTIONS.audience}`, label: "Для кого" },
];

/** Полный адрес публикации с путём (в CI — https://alamzh1.github.io/leadpilot). */
export const SITE_URL: string = SITE.url + BASE_PATH;
