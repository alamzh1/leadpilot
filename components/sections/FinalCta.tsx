import { Button } from "@/components/ui/Button";
import { PlateImage } from "@/components/story/PlateImage";
import { Reveal } from "@/components/ui/Reveal";
import { asset, SECTIONS } from "@/lib/site";

/**
 * Финальный CTA (ТЗ §5.8): заголовок и «Запустить демо», под ними — изображение
 * «проверенная связь между компаниями» — отдельной полосой, кнопка на неё не заходит.
 * Без файла остаётся CSS-фолбэк из палитры.
 */
export function FinalCta() {
  return (
    <section id="final-cta" aria-labelledby="final-cta-title" className="relative overflow-hidden border-b border-line">
      <div className="relative z-10 mx-auto flex max-w-page flex-col items-center gap-10 px-gutter pt-section text-center">
        <Reveal className="flex flex-col items-center gap-10">
          <h2
            id="final-cta-title"
            className="max-w-[20ch] text-[clamp(2.25rem,1.3rem+3.4vw,4.5rem)] leading-[1.04] tracking-[-0.035em]"
          >
            Меньше времени на поиск. Больше контекста для разговора
          </h2>
          <Button href={`#${SECTIONS.demo}`}>Запустить демо</Button>
        </Reveal>
      </div>
      <div aria-hidden="true" className="t04-closing relative mt-6 aspect-[4/3] w-full sm:aspect-[16/8] lg:mt-4 lg:aspect-[16/7]">
        <PlateImage
          src={asset("/images/closing.webp")}
          srcSet={`${asset("/images/closing-1280.webp")} 1280w, ${asset("/images/closing.webp")} 1920w`}
          sizes="100vw"
          alt=""
          width={1920}
          height={1086}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[center_55%]"
        />
      </div>
    </section>
  );
}
