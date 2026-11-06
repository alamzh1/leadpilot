import { Button } from "@/components/ui/Button";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { SECTIONS } from "@/lib/site";

/**
 * Финальный CTA (ТЗ §5.8): высказывание огромным гротеском во всю ширину окна — от гаттера
 * до гаттера, тоном чуть светлее фона (без выделений цветом), под ним одна лаймовая кнопка
 * «Запустить демо». Весь блок — один экран. Это текст (h2), не картинка.
 */
export function FinalCta() {
  return (
    <section id="final-cta" aria-labelledby="final-cta-title" className="screen border-b border-line">
      {/* От 640px кнопка стоит в одной ячейке с текстом — справа внизу, в свободном месте последней строки. */}
      <div className="@container grid w-full gap-8 px-gutter py-section sm:grid-cols-[minmax(0,1fr)] lg:py-fold">
        <h2 id="final-cta-title" className="closing-statement sm:col-start-1 sm:row-start-1">
          Меньше времени на поиск. Больше контекста для разговора
        </h2>
        <Button
          href={`#${SECTIONS.demo}`}
          size="lg"
          className="max-sm:w-full sm:col-start-1 sm:row-start-1 sm:self-end sm:justify-self-end"
        >
          Запустить демо
          <PixelIcon name="arrow" size={16} />
        </Button>
      </div>
    </section>
  );
}
