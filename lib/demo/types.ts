export type DemoCompanyId = "northstar-bank" | "vector-logistics" | "atlas-commerce";

/** Демонстрационный источник: тип и дата, без URL. `date` в формате "2026-09". */
export interface DemoSource {
  kind: string;
  title: string;
  date: string;
}

export interface DemoSignal {
  label: string;
  detail: string;
}

export interface DemoCompany {
  id: DemoCompanyId;
  name: string;
  industry: string;
  /** Демоданные, например "1 200–1 500 сотрудников". */
  size: string;
  description: string;
  itNeeds: string[];
  /** Только должности, без имён. */
  roles: string[];
  signals: DemoSignal[];
  sources: DemoSource[];
  /** Блок решения: повод для первого контакта и кому писать (должность). */
  outreach: { reason: string; role: string };
}

export type ResearchStageId = "analyze" | "initiatives" | "roles" | "profile";

export interface ResearchStage {
  id: ResearchStageId;
  label: string;
}
