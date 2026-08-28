import { notFound } from "next/navigation";
import { PrintHandbook } from "@/components/PrintHandbook";
import { getDoc } from "@/lib/content";
import { NAV, classSlug } from "@/lib/nav";
import { ALL_PLANS, printPlanSlug } from "@/lib/plans";
import { findPrintBundle, stripTeacherSections } from "@/lib/print";

export function generateStaticParams() {
  return [
    { slug: "full" },
    { slug: "chapters" },
    { slug: "worksheets" },
    { slug: "plans" },
    ...NAV.map((item) => ({ slug: classSlug(item) })),
    ...ALL_PLANS.map((item) => ({ slug: printPlanSlug(item) })),
  ];
}

export default async function PrintBundlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = findPrintBundle(slug);
  if (!bundle) notFound();
  const keepTeacher = slug === "plans" || slug.startsWith("plan-");

  const chapters = bundle.items.map((item) => {
    const doc = getDoc(item);
    return {
      title: doc.title,
      group: doc.group,
      markdown: keepTeacher ? doc.markdown : stripTeacherSections(doc.markdown),
    };
  });

  return <PrintHandbook title={bundle.title} subtitle={bundle.subtitle} chapters={chapters} />;
}
