import { NAV, type NavItem, classSlug, detailLectureItems, laterLectureItems } from "./nav";
import { COHORT_DIAGNOSIS, findPlan, FLEX_GUIDE, OPTIONAL_STATS_PLAN, PLAN_GUIDE, WEEKLY_PLANS } from "./plans";
export { stripTeacherSections } from "./studentContent";

export function printSlug(item: NavItem) {
  return classSlug(item);
}

export function studentLectureItems() {
  return NAV.filter((item) => item.group === "上課講義");
}

export function findPrintBundle(slug: string): { title: string; subtitle: string; items: NavItem[] } | null {
  if (slug === "full") {
    return {
      title: "國中科展社團課講義",
      subtitle: "第 1–3 週　對齊全國科展",
      items: studentLectureItems(),
    };
  }
  if (slug === "later") {
    return {
      title: "國中科展社團課後期講義",
      subtitle: "第 4–17 週　十步：先導、建模、兩輪驗證",
      items: laterLectureItems(),
    };
  }
  if (slug === "chapters") {
    return {
      title: "國中科展社團課課後補充",
      subtitle: "第 1–8 章　課後複習用",
      items: detailLectureItems(),
    };
  }
  if (slug === "worksheets") {
    const item = NAV.find((row) => row.href === "/docs/appendix-b");
    if (!item) return null;
    return {
      title: "國中科展社團課學習單",
      subtitle: "第 1–17 週學習單與課後加練　每張可填寫、可撕下繳交",
      items: [item],
    };
  }
  if (slug === "plans") {
    return {
      title: "國中科展社團課教師教案",
      subtitle: "教師用　請勿發給學生　108 課綱素養導向",
        items: [PLAN_GUIDE, FLEX_GUIDE, COHORT_DIAGNOSIS, ...WEEKLY_PLANS, OPTIONAL_STATS_PLAN] as NavItem[],
    };
  }
  if (slug.startsWith("plan-")) {
    const plan = findPlan(slug.slice("plan-".length));
    if (!plan) return null;
    return {
      title: plan.title,
      subtitle: `${plan.group}　教師用，請勿發給學生`,
      items: [plan] as NavItem[],
    };
  }
  const item = NAV.find((row) => printSlug(row) === slug);
  if (!item) return null;
  return {
    title: item.title,
    subtitle: `${item.group}　請附封面繳交或自行保存`,
    items: [item],
  };
}

