import Link from "next/link";
import { PLAN_GUIDE, WEEKLY_PLANS } from "@/lib/plans";

export default function PlansIndexPage() {
  const early = WEEKLY_PLANS.filter((item) => item.phase === "前期");
  const later = WEEKLY_PLANS.filter((item) => item.phase === "後期");
  const finale = WEEKLY_PLANS.filter((item) => item.phase === "期末");

  return (
    <>
      <section className="hero">
        <p>教師用　請勿發給學生</p>
        <h1>上課教案區</h1>
        <p>
          依十二年國教（108 課綱）自然科學領域素養導向教案格式編寫。第 1–8 週對齊已完成講義；第 9–16
          週是研究教練教案，不預先鎖死實驗步驟。
        </p>
        <p>
          <Link href={PLAN_GUIDE.href}>先看格式與課綱對照</Link>
          {"　"}
          <Link href="/print/plans">列印全學期教案</Link>
          {"　"}
          <Link href="/class">上課模式（投影學生講義）</Link>
        </p>
      </section>

      <section className="plans-block">
        <h2>前期｜基本能力</h2>
        <div className="print-pick-grid">
          {early.map((item) => (
            <Link key={item.slug} href={item.href} className="print-pick">
              <span>第 {item.week} 週</span>
              <strong>{item.title.replace(/^第 \d+ 週　/, "")}</strong>
              <em>教案　可列印</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="plans-block">
        <h2>後期｜研究教練（依學生主題調整）</h2>
        <div className="print-pick-grid">
          {later.map((item) => (
            <Link key={item.slug} href={item.href} className="print-pick">
              <span>第 {item.week} 週</span>
              <strong>{item.title.replace(/^第 \d+ 週　/, "")}</strong>
              <em>不鎖實驗步驟</em>
            </Link>
          ))}
        </div>
      </section>

      <section className="plans-block">
        <h2>期末</h2>
        <div className="print-pick-grid">
          {finale.map((item) => (
            <Link key={item.slug} href={item.href} className="print-pick">
              <span>第 {item.week} 週</span>
              <strong>{item.title.replace(/^第 \d+ 週　/, "")}</strong>
              <em>四面向發表</em>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
