import { notFound } from "next/navigation";
import { MarkdownView } from "@/components/MarkdownView";
import { getDoc } from "@/lib/content";
import { classSlug, findNavBySlug, NAV } from "@/lib/nav";

export function generateStaticParams() {
  return NAV.filter((item) => item.href.startsWith("/docs/")).map((item) => ({
    slug: item.href.replace("/docs/", "").split("/"),
  }));
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const item = findNavBySlug(slug);
  if (!item) notFound();
  const doc = getDoc(item);

  return (
    <>
      <section className="hero">
        <h1>{doc.title}</h1>
        <p>{doc.group} · 可直接投影或列印本章學習單</p>
        <p>
          <a href={`/class/${classSlug(item)}`}>用上課模式投影本章</a>
          {"　"}
          <a href={`/print/${classSlug(item)}`}>列印本章（含封面）</a>
        </p>
      </section>
      <MarkdownView markdown={doc.markdown} />
    </>
  );
}
