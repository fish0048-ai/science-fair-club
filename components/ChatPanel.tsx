"use client";

import { FormEvent, useState } from "react";

type Source = { title: string; href: string; heading: string };
type ChatItem = { role: "user" | "assistant"; content: string; sources?: Source[] };

export function ChatPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [items, setItems] = useState<ChatItem[]>([
    {
      role: "assistant",
      content:
        "我是科展社團助教。只能根據本站講義與老師指定的問題回答，例如評審四面向、變因、研究日誌、安全規則。其他問題我會拒絕。",
    },
  ]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const question = input.trim();
    if (!question || pending) return;

    const nextItems: ChatItem[] = [...items, { role: "user", content: question }];
    setItems(nextItems);
    setInput("");
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextItems.map((item) => ({ role: item.role, content: item.content })),
        }),
      });
      const data = (await response.json()) as {
        answer?: string;
        error?: string;
        sources?: Source[];
      };
      setItems([
        ...nextItems,
        {
          role: "assistant",
          content: data.answer || data.error || "助教暫時沒有回應。",
          sources: data.sources,
        },
      ]);
    } catch {
      setItems([
        ...nextItems,
        { role: "assistant", content: "連線失敗。請稍後再試，或直接閱讀左側講義。" },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button className="chat-toggle" type="button" onClick={() => setOpen((value) => !value)}>
        {open ? "關閉助教" : "科展助教"}
      </button>
      {open && (
        <section className="chat-panel" aria-label="科展 AI 助教">
          <div className="chat-head">
            限定知識庫助教
            <small>只答本站講義與教師指定問題，不會上網亂答</small>
          </div>
          <div className="chat-log">
            {items.map((item, index) => (
              <div key={index} className={`bubble ${item.role}`}>
                {item.content}
                {item.sources && item.sources.length > 0 && (
                  <div className="sources">
                    依據：
                    {item.sources.slice(0, 3).map((source) => (
                      <div key={`${source.href}-${source.heading}`}>
                        {source.title} · {source.heading}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {pending && <div className="bubble assistant">正在只從講義裡找答案……</div>}
          </div>
          <form className="chat-form" onSubmit={onSubmit}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="例如：研究日誌可以活頁嗎？"
            />
            <button type="submit" disabled={pending}>
              送出
            </button>
          </form>
        </section>
      )}
    </>
  );
}
