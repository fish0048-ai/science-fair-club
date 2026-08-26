import { notFound } from "next/navigation";
import Link from "next/link";
import { MarkdownView } from "@/components/MarkdownView";
import { getDoc } from "@/lib/content";
import { ALL_PLANS, findPlan, printPlanSlug } from "@/lib/plans";
import { classSlug, findNav } from "@/lib/nav";

export function generateStaticParams() {
  return ALL_PLANS.map((item) => ({ slug: item.slug }));
}

export default async function PlanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findPlan(slug);
  if (!item) notFound();
  const doc = getDoc(item);
  const lecture = item.lectureHref ? findNav(item.lectureHref) : undefined;

  return (
    <>
      <section className="hero">
        <p>教師用教案　108 課綱素養導向　請勿發給學生</p>
        <h1>{doc.title}</h1>
        <p>
          <Link href="/plans">回教案區</Link>
          {"　"}
          <Link href={`/print/${printPlanSlug(item)}`}>列印本週教案</Link>
          {lecture ? (
            <>
              {"　"}
              <Link href={lecture.href}>學生講義</Link>
              {"　"}
              <Link href={`/class/${classSlug(lecture)}`}>上課模式投影</Link>
            </>
          ) : (
            <>
              {"　"}
              <Link href="/class">上課模式</Link>
            </>
          )}
        </p>
      </section>
      <MarkdownView markdown={doc.markdown} audience="teacher" />
    </>
  );
}
