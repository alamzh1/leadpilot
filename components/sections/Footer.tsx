import { PixelIcon } from "@/components/ui/PixelIcon";
import { REPO_URL, SECTIONS } from "@/lib/site";

type FooterLink = { href: string; label: string; external?: boolean };

const COLUMNS: readonly { title: string; links: readonly FooterLink[] }[] = [
  {
    title: "Продукт",
    links: [
      { href: `#${SECTIONS.features}`, label: "Возможности" },
      { href: `#${SECTIONS.how}`, label: "Как работает" },
      { href: `#${SECTIONS.demo}`, label: "Демо" },
    ],
  },
  {
    title: "Для кого",
    links: [
      { href: "#audience-outsourcing", label: "IT-аутсорсинг" },
      { href: "#audience-sales", label: "B2B-продажи" },
      { href: "#audience-agencies", label: "Агентства" },
    ],
  },
  {
    title: "Проект",
    links: [
      { href: REPO_URL, label: "Исходный код на GitHub", external: true },
      { href: `${REPO_URL}#readme`, label: "Документация", external: true },
    ],
  },
];

/**
 * Подвал: бренд и колонки ссылок сеткой, ниже под линией — копирайт и правовая пометка.
 * Сайт статический: без аналитики, форм отправки и cookies.
 */
export function Footer() {
  return (
    <footer className="bg-bg">
      <div className="mx-auto max-w-page px-gutter pt-14 pb-10 lg:pt-16">
        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-x-6 gap-y-10 lg:grid-cols-[minmax(0,5fr)_repeat(3,minmax(0,2fr))] lg:gap-x-10">
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-1 lg:pr-10">
            <a
              href="#top"
              className="inline-flex items-center gap-2.5 self-start rounded-lg text-text no-underline"
              aria-label="LeadPilot — в начало страницы"
            >
              <PixelIcon name="mark" size={24} className="text-lime" />
              <span className="flex flex-col leading-tight">
                <span className="font-display text-[1.0625rem] font-semibold tracking-[-0.02em]">LeadPilot</span>
                <span className="font-display text-[0.8125rem] text-muted">AI Research Workspace</span>
              </span>
            </a>
            <p className="max-w-[44ch] text-[0.875rem] leading-[1.6] text-muted">
              Концепт сервиса для исследования B2B-компаний по публичным данным. Интерактивное демо на
              вымышленных компаниях.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-labelledby={`footer-${col.title}`} className="flex flex-col gap-3.5">
              <h2
                id={`footer-${col.title}`}
                className="text-[0.8125rem] leading-tight font-semibold tracking-normal text-text"
              >
                {col.title}
              </h2>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="rounded-sm text-[0.875rem] leading-snug text-muted no-underline transition-colors duration-150 hover:text-text hover:underline"
                    >
                      {link.label}
                      {link.external && <span className="sr-only"> (откроется в новой вкладке)</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[0.8125rem] leading-[1.5] text-muted lg:mt-14 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <p className="shrink-0">© 2026 LeadPilot · Product concept · Interactive demo</p>
          <p className="max-w-[62ch] lg:text-right">
            Все компании и данные в демо вымышленные. Сайт не использует cookies и не собирает персональные
            данные.
          </p>
        </div>
      </div>
    </footer>
  );
}
