import { DemoWorkspace } from "@/components/demo/DemoWorkspace";
import { SECTIONS } from "@/lib/site";

/** Секция интерактивного демо (ТЗ §5.3). Заголовок — дословно из ТЗ. */
export function Demo() {
  return (
    <section id={SECTIONS.demo} aria-labelledby="demo-title" className="border-b border-line">
      {/* Сверху меньше обычного отступа секции: заголовок демо начинается на сгибе 1440×900. */}
      <div className="mx-auto max-w-page px-gutter pt-16 pb-section xl:pt-12">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-start">
          <h2 id="demo-title" className="text-section lg:col-span-7">
            От названия компании до готового профиля
          </h2>
          <div className="flex flex-col gap-4 lg:col-span-5 lg:pt-1">
            <p className="text-lead text-muted">
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
        <div className="mt-10 lg:mt-12">
          <DemoWorkspace />
        </div>
      </div>
    </section>
  );
}
