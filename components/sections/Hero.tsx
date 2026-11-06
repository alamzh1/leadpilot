import { Button } from "@/components/ui/Button";
import { PixelIcon, type PixelIconName } from "@/components/ui/PixelIcon";
import { DEMO_COMPANIES, RESEARCH_STAGES } from "@/lib/demo/companies";
import { profileCompleteness } from "@/lib/demo/profile";
import { SECTIONS } from "@/lib/site";
import { HeroDesk } from "./HeroDesk";

/** Правдивые факты о демо — числа берутся из самих демо-данных, не из маркетинга. */
const FACTS: readonly { value: number; label: string; icon: PixelIconName }[] = [
  { value: DEMO_COMPANIES.length, label: "демо-компании", icon: "building" },
  { value: RESEARCH_STAGES.length, label: "этапа исследования", icon: "signal" },
  { value: profileCompleteness(DEMO_COMPANIES[0]).total, label: "полей профиля", icon: "source" },
  { value: 0, label: "регистраций и ключей", icon: "check" },
];

/**
 * Первый экран. Тексты — дословно из ТЗ §5.2. Подписи над H1 нет: «AI RESEARCH WORKSPACE»
 * стоит в строке пути окна рабочей области (HeroDesk). Раскладка по референсу: крупный
 * заголовок слева, колонка фактов справа, ниже — рабочая область на скруглённой подложке,
 * внизу — полоса с действиями (от 1024px прилипает к низу экрана, пока виден hero).
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative border-b border-line">
      <div className="mx-auto grid max-w-page gap-x-12 gap-y-10 px-gutter pt-10 pb-12 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:pb-0 lg:gap-y-12 lg:pt-12">
        <div className="@container flex min-w-0 flex-col">
          {/* Кегль от ширины колонки: каждая фраза — своей строкой, пока помещается. */}
          <h1
            id="hero-title"
            className="text-[clamp(2.125rem,10.6cqi,4.5rem)] leading-[1.04] text-balance lg:text-[max(3.5rem,min(6.65cqi,4.5rem))]"
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
          <p className="mt-6 max-w-[46ch] text-lead text-muted lg:max-w-[64ch]">
            LeadPilot собирает публичную информацию о B2B-компаниях в один профиль: бизнес,
            IT-проекты, руководители и сигналы потенциальной потребности
          </p>
        </div>

        {/* Колонка фактов о демо — как наградная колонка референса, но только правда о демо. */}
        <ul
          aria-label="Демо в цифрах"
          className="order-5 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-3 sm:grid-cols-[repeat(4,minmax(0,1fr))] lg:order-none lg:flex lg:flex-col lg:items-end lg:gap-3"
        >
          {FACTS.map((f) => (
            <li
              key={f.label}
              className="flex min-w-0 flex-col items-start gap-3 rounded-xl bg-surface p-3 sm:flex-row sm:items-center lg:flex-row-reverse lg:bg-transparent lg:p-0"
            >
              <span
                aria-hidden="true"
                className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-text lg:size-12"
              >
                <PixelIcon name={f.icon} size={16} />
              </span>
              <span className="flex min-w-0 flex-col lg:items-end">
                <span className="tabular font-heading text-[1.375rem] leading-none font-[650] tracking-[-0.03em]">
                  {f.value}
                </span>
                <span className="mt-1 text-[0.8125rem] leading-tight text-muted lg:text-right">{f.label}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="min-w-0 lg:col-span-2">
          <HeroDesk />
        </div>

        {/*
         * Нижняя полоса hero: слева служебная подпись, в середине вторичная кнопка-карточка,
         * справа — основная. Фон продлевается на всю ширину окна тенью без переполнения.
         */}
        <div className="order-4 border-t border-line bg-bg py-4 shadow-[0_0_0_100vmax_var(--color-bg)] [clip-path:inset(0_-100vmax)] lg:sticky lg:bottom-0 lg:z-20 lg:order-none lg:col-span-2 lg:py-5">
          <div className="grid items-center gap-4 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8">
            <p className="order-3 text-[0.8125rem] text-muted sm:col-span-2 lg:order-none lg:col-span-1">
              Product concept · Interactive demo
            </p>
            <a
              href={`#${SECTIONS.how}`}
              className="group flex items-center gap-4 rounded-xl py-1 pr-4 text-text no-underline transition-colors duration-200 hover:bg-surface"
            >
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-lime transition-colors duration-200 group-hover:bg-line-strong"
              >
                <PixelIcon name="fragment" size={24} accent="var(--color-cyan)" />
              </span>
              <span className="flex flex-col text-[0.8125rem] leading-[1.3]">
                <span className="font-semibold">Как это работает</span>
                <span className="font-display text-muted">Discover · Verify · Qualify</span>
                <span className="text-muted">три шага до профиля</span>
              </span>
            </a>
            <Button href={`#${SECTIONS.demo}`} size="lg" className="max-sm:w-full lg:justify-self-end">
              Исследовать компанию
              <PixelIcon name="arrow" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
