import { MarkdownView } from "@/components/MarkdownView";
import { getDoc } from "@/lib/content";
import { NAV } from "@/lib/nav";

export default function HomePage() {
  const overview = getDoc(NAV[0]);
  return (
    <>
      <section className="hero">
        <h1>國中科展社團｜17 週講義</h1>
        <p>第 1–3 週全班先對齊同一套全國能上場的方法規格；第 4–17 週每週都有可投影的技能講義（不鎖各組實驗步驟）。右下角助教只回答本站資料與教師指定問題。</p>
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
