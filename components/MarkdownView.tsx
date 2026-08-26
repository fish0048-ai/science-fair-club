"use client";

import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { hasTeacherContent, stripTeacherSections } from "@/lib/studentContent";

export function MarkdownView({ markdown }: { markdown: string }) {
  const [showTeacher, setShowTeacher] = useState(false);
  const canToggle = useMemo(() => hasTeacherContent(markdown), [markdown]);
  const text = showTeacher ? markdown : stripTeacherSections(markdown);

  return (
    <>
      {canToggle ? (
        <p className="teacher-toggle no-print">
          <button type="button" onClick={() => setShowTeacher((value) => !value)}>
            {showTeacher ? "隱藏教師頁" : "顯示教師頁"}
          </button>
          <span>教學流程與備課清單預設不顯示，學生講義也不會印出這些段落。</span>
        </p>
      ) : null}
      <article className="doc">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
      </article>
    </>
  );
}
