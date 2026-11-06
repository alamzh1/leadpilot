import { PlateImage } from "@/components/story/PlateImage";
import { ProcessRail, type ProcessStep } from "@/components/story/ProcessRail";
import { asset, SECTIONS } from "@/lib/site";

const STEPS: readonly ProcessStep[] = [
  { name: "Discover", text: "Поиск компании и публичных сигналов." },
  { name: "Verify", text: "Проверка информации, дат и подтверждающих источников." },
  { name: "Qualify", text: "Формирование профиля с релевантными должностями и потенциальными задачами бизнеса." },
];

/** «Как работает» (ТЗ §5.5): изображение «хаос → структура» и рельс из трёх этапов. */
export function HowItWorks() {
  return (
    <section id={SECTIONS.how} aria-labelledby="how-title" className="border-b border-line">
      <div className="mx-auto flex max-w-page flex-col gap-16 px-gutter py-section lg:gap-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 id="how-title" className="max-w-[12ch] text-section lg:col-span-4">
            Как работает LeadPilot
          </h2>
          <div className="t04-plate relative aspect-[4/3] overflow-hidden sm:aspect-[2/1] border border-line lg:col-span-8">
            <PlateImage
              src={asset("/images/research.webp")}
              srcSet={`${asset("/images/research-800.webp")} 800w, ${asset("/images/research.webp")} 1200w`}
              sizes="(min-width: 1024px) 56vw, 100vw"
              alt="Разрозненные фрагменты данных слева сходятся в один блок и выстраиваются в упорядоченную сеть справа"
              width={1200}
              height={896}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
            />
          </div>
        </div>
        <ProcessRail steps={STEPS} />
      </div>
    </section>
  );
}
