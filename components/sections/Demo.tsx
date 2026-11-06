import { DemoWorkspace } from "@/components/demo/DemoWorkspace";
import { SECTIONS } from "@/lib/site";

/**
 * Секция интерактивного демо (ТЗ §5.3). Заголовок — дословно из ТЗ.
 * От 1024px секция ровно в один экран под навигацией: рабочая область забирает остаток
 * высоты, а карточка профиля при нехватке места прокручивается внутри себя.
 */
export function Demo() {
  return (
    <section
      id={SECTIONS.demo}
      aria-labelledby="demo-title"
      className="border-b border-line lg:flex lg:h-[calc(100svh-var(--nav-h)-1px)] lg:min-h-[34rem] lg:flex-col"
    >
      <div className="flex w-full flex-col px-gutter pt-16 pb-section lg:min-h-0 lg:flex-1 lg:py-[clamp(1rem,3svh,2.5rem)]">
        <div className="grid shrink-0 gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end lg:gap-y-0">
          <h2 id="demo-title" className="text-section lg:col-span-6 2xl:col-span-5">
            От названия компании до готового профиля
          </h2>
          <div className="flex flex-col gap-4 lg:col-span-6 lg:gap-2 2xl:col-span-7">
            <p className="max-w-[64ch] text-lead text-muted lg:text-[1.0625rem] lg:leading-[1.5]">
              Выберите компанию и запустите исследование: четыре этапа, затем профиль, который
              можно скопировать или выгрузить в CSV.
            </p>
            <p className="flex items-center gap-3 text-[0.9375rem] text-text">
              <span aria-hidden="true" className="grid shrink-0 grid-cols-2 gap-0.5">
                <span className="size-1 bg-cyan" />
                <span className="size-1" />
                <span className="size-1" />
                <span className="size-1 bg-cyan" />
              </span>
              Все компании и данные вымышленные — демонстрационный режим
            </p>
          </div>
        </div>
        <div className="mt-10 lg:mt-[clamp(1rem,2.6svh,2rem)] lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
          <DemoWorkspace />
        </div>
      </div>
    </section>
  );
}
