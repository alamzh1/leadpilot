import type { ReactNode } from "react";
import { ConvergeSchema, ScatterSchema, StaleRoleSchema } from "@/components/story/ProblemSchemas";
import { PixelIcon } from "@/components/ui/PixelIcon";
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

/**
 * Блок проблемы (ТЗ §5.4): центрированное высказывание с пиксельной «звёздочкой» над ним,
 * ниже — три карточки как карточки проектов референса: крупная скруглённая плитка со схемой,
 * под ней заголовок и серый текст, без общей рамки.
 */
export function Problem() {
  return (
    <section id={SECTIONS.problem} aria-labelledby="problem-title" className="border-b border-line">
      <div className="mx-auto flex max-w-page flex-col gap-14 px-gutter py-section lg:gap-20">
        <div className="flex flex-col items-center gap-6 text-center">
          <PixelIcon name="spark" size={24} className="text-text" />
          <h2 id="problem-title" className="max-w-[22ch] text-section">
            Исследование компании не должно занимать полдня
          </h2>
        </div>
        <ol className="grid gap-x-5 gap-y-12 md:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.08} className="flex min-w-0 flex-col">
              <div className="flex aspect-[5/4] rounded-2xl bg-surface p-5 sm:p-6">{p.schema}</div>
              <div className="flex flex-col gap-2 px-1 pt-6 sm:px-5">
                <h3 className="text-[1.375rem] leading-tight tracking-[-0.02em]">{p.title}</h3>
                <p className="max-w-[40ch] text-[0.9375rem] text-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
