import type { ReactNode } from "react";
import { ConvergeSchema, ScatterSchema, StaleRoleSchema } from "@/components/story/ProblemSchemas";
import { Reveal } from "@/components/ui/Reveal";
import { SECTIONS } from "@/lib/site";

const PROBLEMS: readonly { title: string; text: string; schema: ReactNode }[] = [
  {
    title: "Разрозненные источники",
    text: "Информация находится в новостях, вакансиях, корпоративных сайтах и публичных профилях.",
    schema: <ScatterSchema />,
  },
  {
    title: "Неактуальные контакты",
    text: "Должности меняются, а старые данные продолжают попадать в CRM.",
    schema: <StaleRoleSchema />,
  },
  {
    title: "Много данных, мало выводов",
    text: "Менеджеру важно понять не только кто клиент, но и зачем с ним связываться.",
    schema: <ConvergeSchema />,
  },
];

/** Блок проблемы (ТЗ §5.4): заголовок слева, три проблемы со своими схемами справа. */
export function Problem() {
  return (
    <section id={SECTIONS.problem} aria-labelledby="problem-title" className="border-b border-line">
      <div className="mx-auto grid max-w-page gap-12 px-gutter py-section lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5 xl:col-span-4">
          <h2 id="problem-title" className="max-w-[14ch] text-section lg:sticky lg:top-[calc(var(--nav-h)+3rem)]">
            Исследование компании не должно занимать полдня
          </h2>
        </div>
        <ol className="lg:col-span-7 lg:col-start-6">
          {PROBLEMS.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delay={i * 0.08}
              className="grid gap-6 border-t border-line py-10 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center md:gap-10 lg:first:pt-2"
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl tracking-[-0.02em]">{p.title}</h3>
                <p className="max-w-[40ch] text-muted">{p.text}</p>
              </div>
              {p.schema}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
