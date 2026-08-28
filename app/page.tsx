import { MarkdownView } from "@/components/MarkdownView";
import { getDoc } from "@/lib/content";
import { NAV } from "@/lib/nav";

export default function HomePage() {
  const overview = getDoc(NAV[0]);
  return (
    <>
      <section className="hero">
        <h1>國中科展社團｜17 週講義</h1>
        <p>現行前期為 3 週濃縮課；原 8 章改列分章詳解。後期依學生主題調整。右下角助教只回答本站資料與教師指定問題。</p>
        <p>
          <a href="/class">進入上課模式</a>
          {"　"}
          <a href="/print">列印講義（含封面）</a>
          {"　"}
          <a href="/plans">教師教案（108 課綱）</a>
        </p>
      </section>
      <MarkdownView markdown={overview.markdown} />
    </>
  );
}
