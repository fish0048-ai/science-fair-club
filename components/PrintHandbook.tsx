"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type PrintChapter = {
  title: string;
  group: string;
  markdown: string;
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="print-field">
      <span>{label}</span>
      <em>{value || ""}</em>
    </div>
  );
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

  return (
    <div className="print-app">
      <div className="print-toolbar no-print">
        <div>
          <strong>列印講義</strong>
          <p>空白欄位列印後由學生手寫。若先填好，封面與頁首會印出資料。</p>
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
          <p className="print-cover-kicker">{year} 學年度　自然領域社團</p>
          <h1>{title}</h1>
          <p className="print-cover-sub">{subtitle}</p>
          {school ? <p className="print-cover-school">{school}</p> : <p className="print-cover-school print-blank-school">學校　＿＿＿＿＿＿＿＿＿＿</p>}

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
        </section>

        {chapters.map((chapter, index) => (
          <section key={`${chapter.title}-${index}`} className="print-chapter">
            <header className="print-running">
              <strong>{title}</strong>
              <span>
                班級 {klass || "________"}　座號 {seat || "________"}　姓名 {name || "____________________"}
              </span>
            </header>
            <h2 className="print-chapter-title">{chapter.title}</h2>
            <article className="print-doc">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{chapter.markdown}</ReactMarkdown>
            </article>
          </section>
        ))}
      </div>
    </div>
  );
}
