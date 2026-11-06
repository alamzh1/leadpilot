import { Button } from "@/components/ui/Button";
import { SECTIONS } from "@/lib/site";
import { HeroDesk } from "./HeroDesk";

/**
 * Первый экран. Тексты — дословно из ТЗ §5.2. Подписи над H1 нет: «AI RESEARCH WORKSPACE»
 * стоит в строке пути окна рабочей области (HeroDesk).
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line">
      <div className="mx-auto grid max-w-page items-center gap-x-12 gap-y-14 px-gutter pt-12 pb-16 sm:pt-16 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-x-12 xl:py-10">
        <div className="@container flex min-w-0 flex-col">
          {/* Кегль от ширины колонки: «нужных людей.» помещается в строку; на xl обычный перенос — по две строки на фразу. */}
          <h1
            id="hero-title"
            className="text-[clamp(2.5rem,12cqi,4.75rem)] leading-[1.02] text-balance xl:text-[min(12.9cqi,4.75rem)] xl:text-wrap"
          >
            <span className="block">Находите компании.</span>
            <span className="block">Понимайте их потребности.</span>
            <span className="block">Выходите на нужных людей.</span>
          </h1>
          <p className="mt-6 max-w-[46ch] text-lead text-muted">
            LeadPilot собирает публичную информацию о B2B-компаниях в один профиль: бизнес,
            IT-проекты, руководители и сигналы потенциальной потребности
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`#${SECTIONS.demo}`}>Исследовать компанию</Button>
            <Button href={`#${SECTIONS.how}`} variant="ghost">
              Как это работает
            </Button>
          </div>
        </div>
        {/* Рабочая область уходит за правый край окна. */}
        <div className="w-full max-w-[44rem] min-w-0 hero-bleed max-xl:mx-auto xl:w-auto xl:max-w-none">
          <HeroDesk />
        </div>
      </div>
    </section>
  );
}
