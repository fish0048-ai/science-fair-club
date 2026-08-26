import Link from "next/link";
import { printSlug, studentLectureItems } from "@/lib/print";
import { NAV } from "@/lib/nav";

export default function PrintIndexPage() {
  const weeks = studentLectureItems();
  const extras = NAV.filter((item) => item.group === "附錄" || item.group === "總覽");

  return (
    <div className="print-home">
      <header>
        <p>A4 列印　含封面插圖、目錄、頁碼（封面無頁碼）</p>
        <h1>列印講義</h1>
        <p>建議用「列印 → 另存 PDF」或直接印成紙本。封面欄位可先填，也可留白給學生手寫。列印時請選 A4 直向，並關閉瀏覽器預設的「頁首與頁尾」（頁碼由講義樣式產生，封面不會有頁碼）。</p>
        <Link href="/">回閱讀模式</Link>
      </header>

      <section>
        <h2>整本發給學生</h2>
        <div className="print-pick-grid">
          <Link href="/print/full" className="print-pick featured">
            <span>推薦</span>
            <strong>第 1–8 週講義全冊</strong>
            <em>封面＋班級座號姓名＋八章學生講義</em>
          </Link>
          <Link href="/print/worksheets" className="print-pick">
            <strong>學習單彙整</strong>
            <em>封面＋附錄 B 全部學習單</em>
          </Link>
        </div>
      </section>

      <section>
        <h2>只印單週</h2>
        <div className="print-pick-grid">
          {weeks.map((item) => (
            <Link key={item.href} href={`/print/${printSlug(item)}`} className="print-pick">
              <strong>{item.title}</strong>
              <em>單章封面＋講義</em>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>其他</h2>
        <div className="print-pick-grid">
          {extras.map((item) => (
            <Link key={item.href} href={`/print/${printSlug(item)}`} className="print-pick">
              <strong>{item.title}</strong>
              <em>單份列印</em>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>教師用（請勿發給學生）</h2>
        <div className="print-pick-grid">
          <Link href="/print/plans" className="print-pick featured">
            <span>教師</span>
            <strong>17 週教案全冊</strong>
            <em>108 課綱素養導向　含教學流程與評量</em>
          </Link>
          <Link href="/plans" className="print-pick">
            <strong>回教案區選單週</strong>
            <em>也可在各週教案頁按「列印本週教案」</em>
          </Link>
        </div>
      </section>
    </div>
  );
}
