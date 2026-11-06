import { Button } from "@/components/ui/Button";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { NAV_LINKS, SECTIONS } from "@/lib/site";

const FOOTER_LINKS = [
  ...NAV_LINKS,
  { href: `#${SECTIONS.problem}`, label: "Проблема" },
] as const;

/** Футер как у референса: основная кнопка слева, разделы крупным текстом в середине, логотип справа. */
export function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-page px-gutter pt-12 pb-10 lg:pt-16">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,3fr)]">
          <div className="md:col-span-2 lg:col-span-1">
            <Button href={`#${SECTIONS.demo}`} size="lg" className="max-sm:w-full">
              Попробовать демо
            </Button>
          </div>
          <nav aria-label="Разделы сайта">
            <ul className="flex flex-col gap-1.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-heading text-[clamp(1.375rem,1.1rem+0.8vw,1.75rem)] leading-tight font-[650] tracking-[-0.03em] text-text no-underline transition-colors duration-150 hover:text-muted"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="flex items-start gap-2.5 font-display text-lg leading-tight font-semibold tracking-[-0.02em] md:justify-self-end">
            <PixelIcon name="mark" size={24} className="shrink-0 text-lime" />
            <span className="flex flex-col">
              LeadPilot
              <span className="text-[0.9375rem] font-medium text-muted">AI Research Workspace</span>
            </span>
          </p>
        </div>
        <p className="mt-16 border-t border-line pt-6 text-[0.8125rem] text-muted">Product concept · Interactive demo</p>
      </div>
    </footer>
  );
}
