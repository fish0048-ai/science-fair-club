import { notFound } from "next/navigation";
import { ClassPlayer } from "@/components/ClassPlayer";
import { getDoc } from "@/lib/content";
import { findNavByClassSlug, NAV, classSlug } from "@/lib/nav";
import { parseLesson } from "@/lib/slides";

export function generateStaticParams() {
  return NAV.map((item) => ({ slug: classSlug(item) }));
}

export default async function ClassLessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = findNavByClassSlug(slug);
  if (!item) notFound();
  const doc = getDoc(item);
  const lesson = parseLesson(doc.markdown, doc.title);

  return (
    <ClassPlayer
      title={doc.title}
      href={item.href}
      slides={lesson.slides}
      flow={lesson.flow}
    />
  );
}
