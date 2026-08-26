import { notFound } from "next/navigation";
import { PrintHandbook } from "@/components/PrintHandbook";
import { getDoc } from "@/lib/content";
import { NAV, classSlug } from "@/lib/nav";
import { findPrintBundle, stripTeacherSections } from "@/lib/print";

export function generateStaticParams() {
  return [{ slug: "full" }, { slug: "worksheets" }, ...NAV.map((item) => ({ slug: classSlug(item) }))];
}

export default async function PrintBundlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = findPrintBundle(slug);
  if (!bundle) notFound();

  const chapters = bundle.items.map((item) => {
    const doc = getDoc(item);
    return {
      title: doc.title,
      group: doc.group,
      markdown: stripTeacherSections(doc.markdown),
    };
  });

  return <PrintHandbook title={bundle.title} subtitle={bundle.subtitle} chapters={chapters} />;
}
