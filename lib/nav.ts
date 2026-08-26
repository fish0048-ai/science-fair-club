export type NavItem = {
  title: string;
  href: string;
  file: string;
  group: string;
};

export const NAV: NavItem[] = [
  {
    title: "17 週課程總綱",
    href: "/",
    file: "國中科展社團課程/00_17週課程總綱.md",
    group: "總覽",
  },
  {
    title: "第 1 章 認識全國科展",
    href: "/docs/week-01",
    file: "國中科展社團課程/前半段講義/第01章_認識全國科展.md",
    group: "前期講義",
  },
  {
    title: "第 2 章 科學探究與好問題",
    href: "/docs/week-02",
    file: "國中科展社團課程/前半段講義/第02章_科學探究與好問題.md",
    group: "前期講義",
  },
  {
    title: "第 3 章 實驗設計與三變因",
    href: "/docs/week-03",
    file: "國中科展社團課程/前半段講義/第03章_實驗設計與三變因.md",
    group: "前期講義",
  },
  {
    title: "第 4 章 觀察測量誤差與安全",
    href: "/docs/week-04",
    file: "國中科展社團課程/前半段講義/第04章_觀察測量誤差與安全.md",
    group: "前期講義",
  },
  {
    title: "第 5 章 研究日誌與學術倫理",
    href: "/docs/week-05",
    file: "國中科展社團課程/前半段講義/第05章_研究日誌學術倫理與引用.md",
    group: "前期講義",
  },
  {
    title: "第 6 章 文獻檢索與作品拆解",
    href: "/docs/week-06",
    file: "國中科展社團課程/前半段講義/第06章_文獻檢索與優勝作品拆解.md",
    group: "前期講義",
  },
  {
    title: "第 7 章 數據圖表與基礎統計",
    href: "/docs/week-07",
    file: "國中科展社團課程/前半段講義/第07章_數據整理圖表與基礎統計.md",
    group: "前期講義",
  },
  {
    title: "第 8 章 迷你探究與主題發想",
    href: "/docs/week-08",
    file: "國中科展社團課程/前半段講義/第08章_迷你探究實作與主題發想.md",
    group: "前期講義",
  },
  {
    title: "附錄 A 選題漏斗",
    href: "/docs/appendix-a",
    file: "國中科展社團課程/附錄/A_全國級選題漏斗與可行性檢核.md",
    group: "附錄",
  },
  {
    title: "附錄 B 學習單彙整",
    href: "/docs/appendix-b",
    file: "國中科展社團課程/附錄/B_學習單彙整.md",
    group: "附錄",
  },
  {
    title: "附錄 C 參考資源",
    href: "/docs/appendix-c",
    file: "國中科展社團課程/附錄/C_參考資源與延伸閱讀.md",
    group: "附錄",
  },
  {
    title: "附錄 D 紙直升機模板",
    href: "/docs/appendix-d",
    file: "國中科展社團課程/附錄/D_紙直升機模板.md",
    group: "附錄",
  },
  {
    title: "附錄 E 進階統計（至多因子 ANOVA）",
    href: "/docs/appendix-e",
    file: "國中科展社團課程/附錄/E_進階統計與多因子變異數分析.md",
    group: "附錄",
  },
];

export function findNav(href: string) {
  return NAV.find((item) => item.href === href);
}

export function findNavBySlug(slug: string[]) {
  const href = `/docs/${slug.join("/")}`;
  return NAV.find((item) => item.href === href);
}

export function classSlug(item: NavItem) {
  if (item.href === "/") return "overview";
  return item.href.replace("/docs/", "");
}

export function findNavByClassSlug(slug: string) {
  if (slug === "overview") return NAV.find((item) => item.href === "/");
  return NAV.find((item) => item.href === `/docs/${slug}`);
}

export function classLessons() {
  return NAV.filter((item) => item.group === "總覽" || item.group === "前期講義");
}
