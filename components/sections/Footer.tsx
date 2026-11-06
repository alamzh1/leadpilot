import { PixelIcon } from "@/components/ui/PixelIcon";
import { NAV_LINKS, SECTIONS } from "@/lib/site";

const FOOTER_LINKS = [
  ...NAV_LINKS,
  { href: `#${SECTIONS.problem}`, label: "Проблема" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-page gap-10 px-gutter py-14 md:grid-cols-[1fr_auto] md:items-end">
        <div className="flex flex-col gap-3">
          <p className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-[-0.02em]">
            <PixelIcon name="mark" size={24} className="text-lime" />
            <span>
              LeadPilot <span className="text-muted">/</span> AI Research Workspace
            </span>
          </p>
          <p className="font-mono text-data text-muted">Product concept · Interactive demo</p>
        </div>
        <nav aria-label="Разделы сайта">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-[0.9375rem] text-muted no-underline transition-colors duration-150 hover:text-text hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
