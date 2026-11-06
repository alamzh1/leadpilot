import { Button } from "@/components/ui/Button";
import { PixelIcon, type PixelIconName } from "@/components/ui/PixelIcon";
import { DEMO_COMPANIES, RESEARCH_STAGES } from "@/lib/demo/companies";
import { profileCompleteness } from "@/lib/demo/profile";
import { SECTIONS } from "@/lib/site";
import { HeroDesk } from "./HeroDesk";

/** Правдивые факты о демо — числа берутся из самих демо-данных, не из маркетинга. */
const FACTS: readonly { value: number; label: string; short: string; icon: PixelIconName }[] = [
  { value: DEMO_COMPANIES.length, label: "демо-компании", short: "компании", icon: "building" },
  { value: RESEARCH_STAGES.length, label: "этапа исследования", short: "этапа", icon: "signal" },
  { value: profileCompleteness(DEMO_COMPANIES[0]).total, label: "полей профиля", short: "полей", icon: "source" },
  { value: 0, label: "регистраций и ключей", short: "регистраций", icon: "check" },
];

/**
 * Первый экран — ровно одно окно под навигацией (`100svh − nav`), без прокрутки.
 * Тексты — дословно из ТЗ §5.2. Раскладка — колонка: заголовок и факты, рабочая область
 * забирает оставшуюся высоту (`flex-1 min-h-0`, низ окна мягко срезан), последняя строка —
 * полоса действий. Кегль H1 ограничен и шириной колонки, и высотой окна.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      data-testid="hero"
      className="relative flex h-[calc(100svh-var(--nav-h)-1px)] min-h-[33rem] flex-col border-b border-line"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-page flex-1 flex-col gap-[clamp(0.5rem,1.8svh,1.75rem)] px-gutter pt-[clamp(0.75rem,2.6svh,3rem)] lg:pt-[clamp(1.25rem,4svh,3rem)]">
        <div className="grid shrink-0 gap-x-12 gap-y-[clamp(0.625rem,1.8svh,1.5rem)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="@container flex min-w-0 flex-col">
            {/* Кегль — от ширины колонки и от высоты окна; каждая фраза — своей строкой. */}
            <h1
              id="hero-title"
              className="text-[clamp(1.625rem,min(9.2cqi,5.2svh),4.5rem)] leading-[1.04] text-balance sm:text-[clamp(2rem,min(6.8cqi,5.6svh),4.5rem)] lg:text-[clamp(2.5rem,min(6.65cqi,7.4svh),4.5rem)]"
            >
              <span className="block">Находите компании.</span>
              <span className="block">
                Понимайте их{" "}
                <span className="whitespace-nowrap">
                  <span aria-hidden="true" className="inline-badge">
                    <PixelIcon name="search" size={32} />
                  </span>
                  потребности.
                </span>
              </span>
              <span className="block">Выходите на нужных людей.</span>
            </h1>
            <p className="mt-[clamp(0.5rem,1.8svh,1.5rem)] max-w-[46ch] text-[0.875rem] leading-[1.45] min-[380px]:text-[0.9375rem] text-muted sm:text-lead lg:max-w-[64ch]">
              LeadPilot собирает публичную информацию о B2B-компаниях в один профиль: бизнес,
              IT-проекты, руководители и сигналы потенциальной потребности
            </p>
          </div>

          {/* Факты о демо: строка на телефоне, четыре плитки на планшете, колонка справа на десктопе. */}
          <ul
            aria-label="Демо в цифрах"
            className="flex flex-wrap gap-x-4 gap-y-1 sm:grid sm:grid-cols-[repeat(4,minmax(0,1fr))] sm:gap-3 lg:flex lg:flex-col lg:flex-nowrap lg:items-end lg:gap-[clamp(0.5rem,1.2svh,0.75rem)]"
          >
            {FACTS.map((f) => (
              <li
                key={f.label}
                className="flex min-w-0 items-center gap-3 sm:rounded-xl sm:bg-surface sm:p-3 lg:flex-row-reverse lg:bg-transparent lg:p-0"
              >
                <span
                  aria-hidden="true"
                  className="hidden shrink-0 items-center justify-center rounded-lg bg-surface-2 text-text sm:flex sm:size-11 lg:size-[clamp(2.5rem,5.4svh,3rem)]"
                >
                  <PixelIcon name={f.icon} size={16} />
                </span>
                <span className="flex min-w-0 items-baseline gap-1 sm:flex-col sm:items-start sm:gap-0 lg:items-end">
                  <span className="tabular font-heading text-[0.9375rem] leading-none font-[650] tracking-[-0.02em] sm:text-[1.375rem] sm:tracking-[-0.03em]">
                    {f.value}
                  </span>
                  <span className="text-[0.8125rem] leading-tight text-muted sm:mt-1 lg:text-right">
                    <span className="sm:hidden">{f.short}</span>
                    <span className="max-sm:hidden">{f.label}</span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <HeroDesk className="min-h-0 flex-1" />

        {/* Нижняя полоса hero — последняя строка первого экрана. */}
        <div className="shrink-0 border-t border-line py-[clamp(0.75rem,1.8svh,1.25rem)]">
          <div className="flex flex-col-reverse gap-2 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8">
            <p className="hidden text-[0.8125rem] text-muted lg:block">Product concept · Interactive demo</p>
            <a
              href={`#${SECTIONS.how}`}
              className="group flex items-center gap-4 self-center rounded-xl text-text no-underline transition-colors duration-200 sm:py-1 sm:pr-4 sm:hover:bg-surface"
            >
              <span
                aria-hidden="true"
                className="hidden size-12 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-lime transition-colors duration-200 group-hover:bg-line-strong sm:flex"
              >
                <PixelIcon name="fragment" size={24} accent="var(--color-cyan)" />
              </span>
              <span className="flex flex-col text-[0.8125rem] leading-[1.3] max-sm:flex-row max-sm:items-baseline max-sm:gap-2">
                <span className="font-semibold max-sm:underline max-sm:decoration-line-strong max-sm:underline-offset-4">
                  Как это работает
                </span>
                <span className="font-display text-muted">Discover · Verify · Qualify</span>
                <span className="hidden text-muted sm:inline">три шага до профиля</span>
              </span>
            </a>
            <Button
              href={`#${SECTIONS.demo}`}
              size="lg"
              className="max-sm:min-h-[52px] max-sm:w-full max-sm:py-3 lg:justify-self-end"
            >
              Исследовать компанию
              <PixelIcon name="arrow" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
