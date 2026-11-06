import { Reveal } from "@/components/ui/Reveal";
import { SECTIONS } from "@/lib/site";

type Segment = {
  name: string;
  text: string;
  /** Начало сценария — момент, когда LeadPilot нужен. */
  moment: string;
  scenario: string;
  /** Что именно из профиля решает задачу сегмента (поля карточки). */
  uses: readonly string[];
};

const SEGMENTS: readonly Segment[] = [
  {
    name: "IT-аутсорсинг",
    text: "Поиск компаний с растущими техническими командами.",
    moment: "Планирование недели.",
    scenario:
      "Аккаунт-менеджер ищет, кому предложить выделенную команду. В профиле логистического оператора видны новые склады, вакансии мобильных разработчиков и открытый API для партнёров: команда растёт, и понятно, с чем ей может понадобиться помощь.",
    uses: ["вакансии", "IT-потребности", "Head of Engineering"],
  },
  {
    name: "B2B-продажи",
    text: "Подготовка к первому контакту.",
    moment: "Утро SDR.",
    scenario:
      "В списке на сегодня — региональный банк. Вместо десятка вкладок — один профиль: чем банк живёт сейчас, какие IT-проекты в работе, какая должность отвечает за безопасность и какой повод для первого письма. Источники с датами под рукой, если клиент спросит, откуда информация.",
    uses: ["сигналы", "повод для контакта", "CISO"],
  },
  {
    name: "Агентства",
    text: "Исследование компаний перед персонализированным предложением.",
    moment: "Перед брифом.",
    scenario:
      "Агентство готовит предложение интернет-магазину, который запускает маркетплейс. Профиль собирает публичную информацию о планах, вакансиях и сайте — и предложение строится вокруг их задачи: кабинет продавца и скорость каталога, а не шаблонный слайд с услугами.",
    uses: ["источники", "IT-потребности", "Head of Product"],
  },
];

/** «Для кого» (ТЗ §5.7): три сегмента строками с конкретным сценарием, не карточками. */
export function Audience() {
  return (
    <section id={SECTIONS.audience} aria-labelledby="audience-title" className="border-b border-line">
      <div className="mx-auto flex max-w-page flex-col gap-12 px-gutter py-section lg:gap-16">
        <h2 id="audience-title" className="text-section">
          Для кого
        </h2>
        <ul className="border-b border-line">
          {SEGMENTS.map((s, i) => (
            <Reveal
              as="li"
              key={s.name}
              delay={i * 0.06}
              className="grid gap-6 border-t border-line py-10 lg:grid-cols-12 lg:gap-8 lg:py-14"
            >
              <div className="flex flex-col gap-3 lg:col-span-4">
                <h3 className="text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-[1.05] tracking-[-0.03em]">
                  {s.name}
                </h3>
                <p className="max-w-[30ch] text-lead text-muted">{s.text}</p>
              </div>
              <div className="flex flex-col gap-5 lg:col-span-7 lg:col-start-6">
                <p data-scenario className="max-w-[62ch] text-[1.0625rem] leading-[1.65]">
                  <strong className="font-semibold text-text">{s.moment}</strong>{" "}
                  <span className="text-text/85">{s.scenario}</span>
                </p>
                <p className="flex flex-wrap items-center gap-2 font-mono text-data text-muted">
                  <span className="sr-only">Поля профиля для этого сценария:</span>
                  {s.uses.map((u) => (
                    <span key={u} className="border border-line-strong px-2 py-0.5">
                      {u}
                    </span>
                  ))}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
