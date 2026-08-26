import Link from "next/link";
import { classLessons, classSlug, NAV } from "@/lib/nav";

export default function ClassHomePage() {
  const lessons = classLessons();
  const extras = NAV.filter((item) => item.group === "附錄");

  return (
    <div className="class-home">
      <header className="class-home-hero">
        <p>國中科展社團</p>
        <h1>上課模式</h1>
        <p>全螢幕投影本章講義。左右鍵翻頁，T 開始 120 分鐘計時。教學流程與教師備課預設隱藏，按 H 才顯示；計時開始後仍會提示現在時段。</p>
        <Link href="/" className="class-home-back">
          回閱讀模式
        </Link>
      </header>

      <h2>選本週要上的課</h2>
      <div className="class-cards">
        {lessons.map((item, index) => (
          <Link key={item.href} href={`/class/${classSlug(item)}`} className="class-card">
            <span>{item.group === "總覽" ? "總覽" : `第 ${index} 週`}</span>
            <strong>{item.title}</strong>
            <em>開始上課</em>
          </Link>
        ))}
      </div>

      <h2>附錄（需要時再投影）</h2>
      <div className="class-cards compact">
        {extras.map((item) => (
          <Link key={item.href} href={`/class/${classSlug(item)}`} className="class-card">
            <span>附錄</span>
            <strong>{item.title}</strong>
            <em>開始投影</em>
          </Link>
        ))}
      </div>
    </div>
  );
}
