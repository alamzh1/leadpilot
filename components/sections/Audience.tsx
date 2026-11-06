import { Button } from "@/components/ui/Button";
import { SECTIONS } from "@/lib/site";
import { SegmentCarousel } from "./SegmentCarousel";

export type Segment = {
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

/**
 * «Для кого» (ТЗ §5.7), как блок кейса референса: слева заголовок, серый абзац и кнопка
 * к демо; справа — ряд крупных карточек сегментов с прокруткой по snap и стрелками.
 */
export function Audience() {
  return (
    <section id={SECTIONS.audience} aria-labelledby="audience-title" className="border-b border-line">
      <div className="mx-auto grid max-w-page grid-cols-[minmax(0,1fr)] gap-10 px-gutter py-section lg:grid-cols-[repeat(12,minmax(0,1fr))] lg:gap-0">
        <div className="flex flex-col items-start gap-6 lg:col-span-4 lg:border-r lg:border-line lg:pr-10">
          <h2 id="audience-title" className="text-section">
            Для кого
          </h2>
          <p className="max-w-[34ch] text-lead text-muted">
            Три сценария: кто открывает LeadPilot и какие поля профиля использует.
          </p>
          <Button href={`#${SECTIONS.demo}`} className="mt-2">
            Попробовать демо
          </Button>
        </div>
        <div className="min-w-0 lg:col-span-8 lg:pl-10">
          <SegmentCarousel segments={SEGMENTS} />
        </div>
      </div>
    </section>
  );
}
