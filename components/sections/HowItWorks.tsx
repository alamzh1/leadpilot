import { PlateImage } from "@/components/story/PlateImage";
import { ProcessRail, type ProcessStep } from "@/components/story/ProcessRail";
import { asset, SECTIONS } from "@/lib/site";

const STEPS: readonly ProcessStep[] = [
  { name: "Discover", text: "Поиск компании и публичных сигналов.", icon: "search" },
  { name: "Verify", text: "Проверка информации, дат и подтверждающих источников.", icon: "check" },
  {
    name: "Qualify",
    text: "Формирование профиля с релевантными должностями и потенциальными задачами бизнеса.",
    icon: "role",
  },
];

/** «Как работает» (ТЗ §5.5): шапка с переключателями, крупная плитка «хаос → структура», три шага на рельсе. */
export function HowItWorks() {
  return (
    <section id={SECTIONS.how} aria-labelledby="how-title" className="border-b border-line">
      <div className="mx-auto max-w-page px-gutter py-section">
        <ProcessRail
          steps={STEPS}
          heading={
            <h2 id="how-title" className="max-w-[14ch] text-section">
              Как работает LeadPilot
            </h2>
          }
          media={
            <div className="t04-plate relative aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-[21/9]">
              <PlateImage
                src={asset("/images/research.webp")}
                srcSet={`${asset("/images/research-800.webp")} 800w, ${asset("/images/research.webp")} 1200w`}
                sizes="(min-width: 1280px) 1184px, 100vw"
                alt="Разрозненные фрагменты данных слева сходятся в один блок и выстраиваются в упорядоченную сеть справа"
                width={1200}
                height={896}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-[center_45%]"
              />
            </div>
          }
        />
      </div>
    </section>
  );
}
