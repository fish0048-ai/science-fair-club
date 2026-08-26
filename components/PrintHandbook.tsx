"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BODY_PAGE_HEIGHT_MM,
  BODY_PAGE_WIDTH_MM,
  chapterStartPages,
  estimateBlockPages,
  pxPerMm,
} from "@/lib/printPages";

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
  const sheetRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLElement>(null);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const [pageMap, setPageMap] = useState<number[]>(() => chapters.map(() => 0));

  const measurePages = useCallback(() => {
    if (!showToc) return;
    const unit = pxPerMm();
    const pageHeightPx = BODY_PAGE_HEIGHT_MM * unit;
    const printWidthPx = BODY_PAGE_WIDTH_MM * unit;
    const tocPages = tocRef.current ? estimateBlockPages(tocRef.current, pageHeightPx, printWidthPx) : 1;
    const chapterPages = chapters.map((_, index) => {
      const node = chapterRefs.current[index];
      return node ? estimateBlockPages(node, pageHeightPx, printWidthPx) : 1;
    });
    const next = chapterStartPages(tocPages, chapterPages);
    setPageMap((prev) => (prev.length === next.length && prev.every((value, index) => value === next[index]) ? prev : next));
  }, [chapters, showToc]);

  useLayoutEffect(() => {
    measurePages();
  }, [measurePages]);

  useEffect(() => {
    const sheet = sheetRef.current;
    const images = sheet ? Array.from(sheet.querySelectorAll("img")) : [];
    const onReady = () => measurePages();
    images.forEach((image) => {
      if (!image.complete) image.addEventListener("load", onReady);
    });
    window.addEventListener("beforeprint", onReady);
    window.addEventListener("resize", onReady);
    const fonts = document.fonts?.ready.then(onReady);
    return () => {
      images.forEach((image) => image.removeEventListener("load", onReady));
      window.removeEventListener("beforeprint", onReady);
      window.removeEventListener("resize", onReady);
      void fonts;
    };
  }, [measurePages]);

  return (
    <div className="print-app">
      <div className="print-toolbar no-print">
        <div>
          <strong>列印講義</strong>
          <p>
            封面沒有頁碼，內文從 1 起編；目錄會列出各章起始頁碼。空白欄位可留給學生手寫。紙張選 A4 直向；請關閉瀏覽器預設的「頁首與頁尾」，以免多印網址。
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

      <div className="print-sheet" ref={sheetRef}>
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
            <nav className="print-toc" aria-label="目錄" ref={tocRef}>
              <header className="print-running">
                <strong>{title}</strong>
                <span>{identityLine(klass, seat, name)}</span>
              </header>
              <img className="print-ornament" src="/handbook/chapter-ornament.jpg" alt="" />
              <h2>目錄</h2>
              <div className="print-toc-head">
                <span>章名</span>
                <span>頁碼</span>
              </div>
              <ol>
                {chapters.map((chapter, index) => {
                  const page = pageMap[index];
                  const pageLabel = page ? String(page) : "";
                  return (
                    <li key={`${chapter.title}-${index}`}>
                      <a
                        className="print-toc-link"
                        href={`#print-ch-${index}`}
                        aria-label={page ? `${chapter.title}，第 ${page} 頁` : chapter.title}
                      >
                        <span className="print-toc-text">
                          <span className="print-toc-title">{chapter.title}</span>
                          <span className="print-toc-group">{chapter.group}</span>
                        </span>
                        <span className="print-toc-leader" aria-hidden="true" />
                        <span className="print-toc-page">{pageLabel}</span>
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          ) : null}

          {chapters.map((chapter, index) => (
            <section
              key={`${chapter.title}-${index}`}
              id={`print-ch-${index}`}
              className="print-chapter"
              ref={(node) => {
                chapterRefs.current[index] = node;
              }}
            >
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
