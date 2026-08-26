"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { currentFlowStep, type FlowStep, type Slide } from "@/lib/slides";

const CLASS_MINUTES = 120;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatClock(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  if (hours > 0) return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}

const KIND_LABEL: Record<Slide["kind"], string> = {
  title: "開場",
  goals: "學習目標",
  flow: "本週流程",
  lecture: "核心講義",
  activity: "課堂活動",
  worksheet: "學習單",
  homework: "作業",
  myth: "迷思澄清",
  teacher: "教師備註",
  other: "講義",
};

export function ClassPlayer({
  title,
  href,
  slides,
  flow,
}: {
  title: string;
  href: string;
  slides: Slide[];
  flow: FlowStep[];
}) {
  const [index, setIndex] = useState(0);
  const [hideTeacher, setHideTeacher] = useState(true);
  const [showOutline, setShowOutline] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const visible = useMemo(
    () => (hideTeacher ? slides.filter((slide) => slide.kind !== "teacher") : slides),
    [hideTeacher, slides],
  );

  const safeIndex = Math.min(index, Math.max(0, visible.length - 1));
  const slide = visible[safeIndex];
  const elapsedMinutes = Math.floor(elapsed / 60);
  const nowStep = currentFlowStep(flow, elapsedMinutes);

  const go = useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(visible.length - 1, next)));
    },
    [visible.length],
  );

  useEffect(() => {
    if (index > visible.length - 1) setIndex(Math.max(0, visible.length - 1));
  }, [index, visible.length]);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      if (event.key === "ArrowRight" || event.key === " " || event.key === "PageDown") {
        event.preventDefault();
        go(safeIndex + 1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        go(safeIndex - 1);
      } else if (event.key === "Home") {
        go(0);
      } else if (event.key === "End") {
        go(visible.length - 1);
      } else if (event.key === "f" || event.key === "F") {
        if (!document.fullscreenElement) {
          void document.documentElement.requestFullscreen();
        } else {
          void document.exitFullscreen();
        }
      } else if (event.key === "t" || event.key === "T") {
        setRunning((value) => !value);
      } else if (event.key === "o" || event.key === "O") {
        setShowOutline((value) => !value);
      } else if (event.key === "h" || event.key === "H") {
        setHideTeacher((value) => !value);
      } else if (event.key === "Escape" && document.fullscreenElement) {
        void document.exitFullscreen();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, safeIndex, visible.length]);

  if (!slide) {
    return (
      <div className="class-shell">
        <p>這一章還沒有可投影的內容。</p>
        <Link href="/class">回上課模式</Link>
      </div>
    );
  }

  const remaining = CLASS_MINUTES * 60 - elapsed;

  return (
    <div className="class-shell">
      <header className="class-bar">
        <div>
          <div className="class-kicker">上課模式 · {KIND_LABEL[slide.kind]}</div>
          <div className="class-title">{title}</div>
        </div>
        <div className="class-tools">
          <div className={`class-clock${running ? " is-on" : ""}`}>
            <span>已進行 {formatClock(elapsed)}</span>
            <span>剩餘 {formatClock(remaining)}</span>
          </div>
          <button type="button" onClick={() => setRunning((value) => !value)}>
            {running ? "暫停計時" : "開始上課"}
          </button>
          <button type="button" onClick={() => setHideTeacher((value) => !value)}>
            {hideTeacher ? "顯示教師頁" : "隱藏教師頁"}
          </button>
          <button type="button" onClick={() => setShowOutline((value) => !value)}>
            {showOutline ? "隱藏大綱" : "大綱"}
          </button>
          <Link href={href}>講義</Link>
          <Link href="/class">選課</Link>
        </div>
      </header>

      {nowStep && running && (
        <div className="class-now">
          現在時段 {nowStep.start}–{nowStep.end} 分：{nowStep.activity}
          {nowStep.note ? `（${nowStep.note}）` : ""}
        </div>
      )}

      <div className={`class-stage${showOutline ? " with-outline" : ""}`}>
        {showOutline && (
          <nav className="class-outline" aria-label="投影大綱">
            {visible.map((item, itemIndex) => (
              <button
                key={`${item.heading}-${itemIndex}`}
                type="button"
                className={itemIndex === safeIndex ? "active" : ""}
                onClick={() => go(itemIndex)}
              >
                {itemIndex + 1}. {item.heading}
              </button>
            ))}
          </nav>
        )}

        <section className="class-slide" aria-live="polite">
          <p className="class-slide-label">
            {safeIndex + 1} / {visible.length}　{slide.heading}
          </p>
          <article className="class-doc">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{slide.markdown}</ReactMarkdown>
          </article>
        </section>
      </div>

      <footer className="class-foot">
        <button type="button" onClick={() => go(safeIndex - 1)} disabled={safeIndex === 0}>
          上一頁
        </button>
        <div className="class-dots" aria-hidden="true">
          {visible.map((item, itemIndex) => (
            <span
              key={`${item.heading}-dot-${itemIndex}`}
              className={itemIndex === safeIndex ? "on" : ""}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(safeIndex + 1)}
          disabled={safeIndex === visible.length - 1}
        >
          下一頁
        </button>
        <p className="class-hint">← → 翻頁　空白鍵下一頁　F 全螢幕　T 計時　O 大綱　H 教師頁</p>
      </footer>
    </div>
  );
}
