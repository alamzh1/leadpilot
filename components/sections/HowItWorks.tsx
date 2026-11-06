import { Button } from "@/components/ui/Button";
import { PlateImage } from "@/components/story/PlateImage";
import { ProcessPipeline, type PipelineStep } from "@/components/story/ProcessPipeline";
import { asset, SECTIONS } from "@/lib/site";

/** Тексты шагов — дословно из ТЗ §5.5; подписи и «На выходе» — пояснения к конвейеру. */
const STEPS: readonly PipelineStep[] = [
  {
    name: "Discover",
    label: "Поиск",
    text: "Поиск компании и публичных сигналов.",
    output: "находки из новостей, вакансий и сайтов — пока без проверки.",
  },
  {
    name: "Verify",
    label: "Проверка",
    text: "Проверка информации, дат и подтверждающих источников.",
    output: "подтверждённые факты с датой и источником, устаревшее отброшено.",
  },
  {
    name: "Qualify",
    label: "Квалификация",
    text: "Формирование профиля с релевантными должностями и потенциальными задачами бизнеса.",
    output: "профиль компании: кому писать и с каким поводом.",
  },
];

/**
 * «Как работает» (ТЗ §5.5): шапка с заголовком, пояснением и небольшой плиткой research.webp;
 * ниже — один конвейер из трёх шагов на данных Vector Logistics; под ним — итог и ссылка на демо.
 */
export function HowItWorks() {
  return (
    <section id={SECTIONS.how} aria-labelledby="how-title" className="screen border-b border-line">
      {/* От 1024px — одна сетка: заголовок и пояснение слева, плитка и итог справа, конвейер ниже. */}
      <div className="flex w-full flex-col gap-10 px-gutter py-section lg:grid lg:grid-cols-12 lg:gap-x-[clamp(1.5rem,2.5vw,3rem)] lg:gap-y-[clamp(0.75rem,2.4svh,2rem)] lg:py-fold">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-5 sm:gap-10 lg:contents">
          <h2 id="how-title" className="max-w-[14ch] text-section lg:col-span-6 lg:row-start-1 lg:max-w-none lg:self-end">
            Как работает LeadPilot
          </h2>
          <p className="col-start-1 max-w-[52ch] text-lead text-muted max-sm:text-[1rem] lg:col-span-6 lg:row-start-2 lg:-mt-[clamp(0.25rem,1.2svh,1rem)] lg:max-w-[64ch] lg:text-[1rem] lg:leading-[1.5]">
            Три шага от названия компании до профиля. Каждый шаг берёт результат предыдущего:
            сначала находки, затем проверенные факты, в конце — кому писать и зачем.
          </p>
          <div className="t04-plate relative col-start-2 row-span-2 row-start-1 aspect-square w-20 self-start overflow-hidden rounded-xl sm:aspect-[4/3] sm:w-56 sm:self-end sm:rounded-2xl lg:col-span-2 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:aspect-auto lg:h-full lg:min-h-[4.5rem] lg:w-full lg:self-stretch">
            <PlateImage
              src={asset("/images/research-800.webp")}
              srcSet={`${asset("/images/research-800.webp")} 800w, ${asset("/images/research.webp")} 1200w`}
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 224px, 80px"
              alt="Разрозненные фрагменты данных слева сходятся в один блок и выстраиваются в упорядоченную сеть справа"
              width={1200}
              height={896}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[center_45%]"
            />
          </div>
        </div>

        <div className="lg:col-span-12 lg:row-start-3">
          <ProcessPipeline steps={STEPS} />
        </div>

        <div className="flex flex-col items-start gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1 lg:flex-col lg:items-start lg:justify-end lg:gap-3 lg:border-t-0 lg:pt-0">
          <p className="max-w-[56ch] text-[1rem] leading-[1.55] text-muted lg:text-[0.9375rem] lg:leading-[1.45]">
            <span className="font-semibold text-text">Итог — один профиль компании</span> с источниками
            и датами, который можно скопировать или выгрузить в CSV.
          </p>
          <Button href={`#${SECTIONS.demo}`} variant="ghost">
            Посмотреть на примере
          </Button>
        </div>
      </div>
    </section>
  );
}
