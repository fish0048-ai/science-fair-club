"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type PrintChapter = {
  title: string;
  group: string;
  markdown: string;
};

const COVER_ICONS = [
  { src: "/handbook/icon-inquiry.jpg", label: "提問探究" },
  { src: "/handbook/icon-lab.jpg", label: "實驗安全" },
  { src: "/handbook/icon-data.jpg", label: "數據論證" },
] as const;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="print-field">
      <span>{label}</span>
      <em>{value || ""}</em>
    </div>
  );
}

function identityLine(klass: string, seat: string, name: string) {
  return `班級 ${klass || "________"}　座號 ${seat || "________"}　姓名 ${name || "____________________"}`;
}

export function PrintHandbook({
  title,
  subtitle,
  chapters,
}: {
  title: string;
  subtitle: string;
  chapters: PrintChapter[];
}) {
  const [school, setSchool] = useState("");
  const [klass, setKlass] = useState("");
  const [seat, setSeat] = useState("");
  const [name, setName] = useState("");
  const year = useMemo(() => "115", []);
  const showToc = chapters.length > 1;

  return (
    <div className="print-app">
      <div className="print-toolbar no-print">
        <div>
          <strong>列印講義</strong>
          <p>
            封面沒有頁碼，內文從 1 起編。空白欄位可留給學生手寫。紙張選 A4 直向，頁首頁尾請保留（瀏覽器才印得出頁碼）。
          </p>
        </div>
        <div className="print-toolbar-fields">
          <label>
            學校
            <input value={school} onChange={(event) => setSchool(event.target.value)} placeholder="選填" />
          </label>
          <label>
            班級
            <input value={klass} onChange={(event) => setKlass(event.target.value)} placeholder="例：801" />
          </label>
          <label>
            座號
            <input value={seat} onChange={(event) => setSeat(event.target.value)} placeholder="例：12" />
          </label>
          <label>
            姓名
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="例：王小明" />
          </label>
        </div>
        <div className="print-toolbar-actions">
          <button type="button" onClick={() => window.print()}>
            列印／存成 PDF
          </button>
          <a href="/print">回選單</a>
        </div>
      </div>

      <div className="print-sheet">
        <section className="print-cover">
          <div className="print-cover-frame">
            <p className="print-cover-kicker">{year} 學年度　自然領域社團</p>
            <figure className="print-cover-hero">
              <img
                src="/handbook/cover.jpg"
                alt="科展探究場景：研究日誌、顯微鏡、燒杯與紙直升機"
              />
            </figure>
            <h1>{title}</h1>
            <p className="print-cover-sub">{subtitle}</p>
            {school ? (
              <p className="print-cover-school">{school}</p>
            ) : (
              <p className="print-cover-school print-blank-school">學校　＿＿＿＿＿＿＿＿＿＿</p>
            )}

            <div className="print-cover-icons" aria-hidden="true">
              {COVER_ICONS.map((icon) => (
                <figure key={icon.src}>
                  <img src={icon.src} alt="" />
                  <figcaption>{icon.label}</figcaption>
                </figure>
              ))}
            </div>

            <div className="print-id-card">
              <Field label="班級" value={klass} />
              <Field label="座號" value={seat} />
              <Field label="姓名" value={name} />
            </div>

            <ul className="print-cover-notes">
              <li>請用正楷填寫封面，每次上課攜帶本講義與研究日誌。</li>
              <li>講義可書寫、圈記；原始實驗數據仍須寫在成冊研究日誌。</li>
              <li>本課程對齊全國中小學科學展覽會評審標準。</li>
            </ul>
          </div>
        </section>

        <div className="print-body">
          {showToc ? (
            <nav className="print-toc" aria-label="目錄">
              <header className="print-running">
                <strong>{title}</strong>
                <span>{identityLine(klass, seat, name)}</span>
              </header>
              <img className="print-ornament" src="/handbook/chapter-ornament.jpg" alt="" />
              <h2>目錄</h2>
              <ol>
                {chapters.map((chapter, index) => (
                  <li key={`${chapter.title}-${index}`}>
                    <span>{chapter.title}</span>
                    <em>{chapter.group}</em>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          {chapters.map((chapter, index) => (
            <section key={`${chapter.title}-${index}`} className="print-chapter">
              <header className="print-running">
                <strong>{title}</strong>
                <span>{identityLine(klass, seat, name)}</span>
              </header>
              <img className="print-ornament" src="/handbook/chapter-ornament.jpg" alt="" />
              <p className="print-chapter-kicker">
                {chapter.group}
                <span aria-hidden="true"> · </span>
                {index + 1} / {chapters.length}
              </p>
              <article className="print-doc">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{chapter.markdown}</ReactMarkdown>
              </article>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
