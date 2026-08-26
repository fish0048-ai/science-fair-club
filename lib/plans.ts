export type PlanItem = {
  week: number;
  title: string;
  slug: string;
  href: string;
  file: string;
  group: "教師教案";
  phase: "說明" | "前期" | "後期" | "期末";
  lectureHref?: string;
};

export const PLAN_GUIDE: PlanItem = {
  week: 0,
  title: "教案格式與 108 課綱對照",
  slug: "guide",
  href: "/plans/guide",
  file: "國中科展社團課程/教師教案/00_教案格式與108課綱對照.md",
  group: "教師教案",
  phase: "說明",
};

export const WEEKLY_PLANS: PlanItem[] = [
  {
    week: 1,
    title: "第 1 週　認識全國科展",
    slug: "week-01",
    lectureHref: "/docs/week-01",
    phase: "前期",
    file: "國中科展社團課程/教師教案/第01週_認識全國科展.md",
  },
  {
    week: 2,
    title: "第 2 週　科學探究與好問題",
    slug: "week-02",
    lectureHref: "/docs/week-02",
    phase: "前期",
    file: "國中科展社團課程/教師教案/第02週_科學探究與好問題.md",
  },
  {
    week: 3,
    title: "第 3 週　實驗設計與三變因",
    slug: "week-03",
    lectureHref: "/docs/week-03",
    phase: "前期",
    file: "國中科展社團課程/教師教案/第03週_實驗設計與三變因.md",
  },
  {
    week: 4,
    title: "第 4 週　觀察測量誤差與安全",
    slug: "week-04",
    lectureHref: "/docs/week-04",
    phase: "前期",
    file: "國中科展社團課程/教師教案/第04週_觀察測量誤差與安全.md",
  },
  {
    week: 5,
    title: "第 5 週　研究日誌與學術倫理",
    slug: "week-05",
    lectureHref: "/docs/week-05",
    phase: "前期",
    file: "國中科展社團課程/教師教案/第05週_研究日誌與學術倫理.md",
  },
  {
    week: 6,
    title: "第 6 週　文獻檢索與作品拆解",
    slug: "week-06",
    lectureHref: "/docs/week-06",
    phase: "前期",
    file: "國中科展社團課程/教師教案/第06週_文獻檢索與作品拆解.md",
  },
  {
    week: 7,
    title: "第 7 週　數據圖表與基礎統計",
    slug: "week-07",
    lectureHref: "/docs/week-07",
    phase: "前期",
    file: "國中科展社團課程/教師教案/第07週_數據圖表與基礎統計.md",
  },
  {
    week: 8,
    title: "第 8 週　迷你探究與主題發想",
    slug: "week-08",
    lectureHref: "/docs/week-08",
    phase: "前期",
    file: "國中科展社團課程/教師教案/第08週_迷你探究與主題發想.md",
  },
  {
    week: 9,
    title: "第 9 週　主題定案與分組",
    slug: "week-09",
    phase: "後期",
    file: "國中科展社團課程/教師教案/第09週_主題定案與分組.md",
  },
  {
    week: 10,
    title: "第 10 週　研究計畫書",
    slug: "week-10",
    phase: "後期",
    file: "國中科展社團課程/教師教案/第10週_研究計畫書.md",
  },
  {
    week: 11,
    title: "第 11 週　預實驗",
    slug: "week-11",
    phase: "後期",
    file: "國中科展社團課程/教師教案/第11週_預實驗.md",
  },
  {
    week: 12,
    title: "第 12 週　正式實驗 I",
    slug: "week-12",
    phase: "後期",
    file: "國中科展社團課程/教師教案/第12週_正式實驗I.md",
  },
  {
    week: 13,
    title: "第 13 週　正式實驗 II",
    slug: "week-13",
    phase: "後期",
    file: "國中科展社團課程/教師教案/第13週_正式實驗II.md",
  },
  {
    week: 14,
    title: "第 14 週　深化或轉向",
    slug: "week-14",
    phase: "後期",
    file: "國中科展社團課程/教師教案/第14週_深化或轉向.md",
  },
  {
    week: 15,
    title: "第 15 週　分析討論與限制",
    slug: "week-15",
    phase: "後期",
    file: "國中科展社團課程/教師教案/第15週_分析討論與限制.md",
  },
  {
    week: 16,
    title: "第 16 週　說明書海報與口試",
    slug: "week-16",
    phase: "後期",
    file: "國中科展社團課程/教師教案/第16週_說明書海報與口試.md",
  },
  {
    week: 17,
    title: "第 17 週　成果發表",
    slug: "week-17",
    phase: "期末",
    file: "國中科展社團課程/教師教案/第17週_成果發表.md",
  },
].map((item) => ({
  ...item,
  href: `/plans/${item.slug}`,
  group: "教師教案" as const,
})) as PlanItem[];

export const ALL_PLANS: PlanItem[] = [PLAN_GUIDE, ...WEEKLY_PLANS];

export function findPlan(slug: string) {
  return ALL_PLANS.find((item) => item.slug === slug) || null;
}

export function printPlanSlug(item: PlanItem) {
  if (item.slug === "guide") return "plan-guide";
  return `plan-${item.slug}`;
}
