import { NAV, type NavItem, classSlug } from "./nav";
import { ALL_PLANS, findPlan } from "./plans";
export { stripTeacherSections } from "./studentContent";

export function printSlug(item: NavItem) {
  return classSlug(item);
}

export function studentLectureItems() {
  return NAV.filter((item) => item.group === "前期講義");
}

export function findPrintBundle(slug: string): { title: string; subtitle: string; items: NavItem[] } | null {
  if (slug === "full") {
    return {
      title: "國中科展社團課講義",
      subtitle: "第 1–8 週　基本能力（對齊全國科展）",
      items: studentLectureItems(),
    };
  }
  if (slug === "worksheets") {
    const item = NAV.find((row) => row.href === "/docs/appendix-b");
    if (!item) return null;
    return {
      title: "國中科展社團課學習單",
      subtitle: "第 1–8 週學習單彙整",
      items: [item],
    };
  }
  if (slug === "plans") {
    return {
      title: "國中科展社團課教師教案",
      subtitle: "教師用　請勿發給學生　108 課綱素養導向",
        items: ALL_PLANS as NavItem[],
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

