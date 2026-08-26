import { MarkdownView } from "@/components/MarkdownView";
import { getDoc } from "@/lib/content";
import { NAV } from "@/lib/nav";

export default function HomePage() {
  const overview = getDoc(NAV[0]);
  return (
    <>
      <section className="hero">
        <h1>國中科展社團｜17 週講義</h1>
        <p>前期先練全國科展基本功；後期依學生主題調整。右下角助教只回答本站資料與教師指定問題。</p>
      </section>
      <MarkdownView markdown={overview.markdown} />
    </>
  );
}
