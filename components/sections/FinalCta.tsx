import { Button } from "@/components/ui/Button";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { PlateImage } from "@/components/story/PlateImage";
import { Reveal } from "@/components/ui/Reveal";
import { asset, SECTIONS } from "@/lib/site";

/**
 * Финальный CTA (ТЗ §5.8): крупное центрированное высказывание со встроенными в строку
 * плашками-иконками, под ним «Запустить демо». Ниже — широкая скруглённая плитка
 * «проверенная связь между компаниями»; кнопка на неё не заходит. Без файла — CSS-фолбэк.
 */
export function FinalCta() {
  return (
    <section id="final-cta" aria-labelledby="final-cta-title" className="border-b border-line">
      <div className="mx-auto flex max-w-page flex-col items-center gap-16 px-gutter py-section lg:gap-20">
        <Reveal className="flex flex-col items-center gap-10 text-center">
          <h2
            id="final-cta-title"
            className="max-w-[18ch] text-[clamp(2.25rem,1.3rem+3.4vw,4.25rem)] leading-[1.08] tracking-[-0.035em]"
          >
            Меньше времени на{" "}
            <span className="whitespace-nowrap">
              <span aria-hidden="true" className="inline-badge">
                <PixelIcon name="search" size={32} className="text-text" />
              </span>
              поиск.
            </span>{" "}
            Больше контекста{" "}
            <span className="whitespace-nowrap">
              <span aria-hidden="true" className="inline-badge bg-lime text-lime-ink">
                <PixelIcon name="check" size={32} />
              </span>
              для
            </span>{" "}
            разговора
          </h2>
          <Button href={`#${SECTIONS.demo}`} size="lg">
            Запустить демо
          </Button>
        </Reveal>
        <div aria-hidden="true" className="t04-closing relative aspect-[4/3] w-full overflow-hidden rounded-3xl sm:aspect-[16/7]">
          <PlateImage
            src={asset("/images/closing.webp")}
            srcSet={`${asset("/images/closing-1280.webp")} 1280w, ${asset("/images/closing.webp")} 1920w`}
            sizes="(min-width: 1280px) 1184px, 100vw"
            alt=""
            width={1920}
            height={1086}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[center_55%]"
          />
        </div>
      </div>
    </section>
  );
}
