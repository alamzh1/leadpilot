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
    <section id={SECTIONS.how} aria-labelledby="how-title" className="border-b border-line">
      <div className="mx-auto flex max-w-page flex-col gap-10 px-gutter py-section lg:gap-14">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-5 sm:gap-10">
          <div className="flex flex-col gap-4">
            <h2 id="how-title" className="max-w-[14ch] text-section">
              Как работает LeadPilot
            </h2>
            <p className="max-w-[52ch] text-lead text-muted max-sm:text-[1rem]">
              Три шага от названия компании до профиля. Каждый шаг берёт результат предыдущего:
              сначала находки, затем проверенные факты, в конце — кому писать и зачем.
            </p>
          </div>
          <div className="t04-plate relative row-span-1 aspect-square w-20 self-start overflow-hidden rounded-xl sm:aspect-[4/3] sm:w-56 sm:self-end sm:rounded-2xl lg:w-72">
            <PlateImage
              src={asset("/images/research-800.webp")}
              srcSet={`${asset("/images/research-800.webp")} 800w, ${asset("/images/research.webp")} 1200w`}
              sizes="(min-width: 1024px) 288px, (min-width: 640px) 224px, 80px"
              alt="Разрозненные фрагменты данных слева сходятся в один блок и выстраиваются в упорядоченную сеть справа"
              width={1200}
              height={896}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[center_45%]"
            />
          </div>
        </div>

        <ProcessPipeline steps={STEPS} />

        <div className="flex flex-col items-start gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[56ch] text-[1rem] leading-[1.55] text-muted">
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
