import { NextResponse } from "next/server";
import {
  loadAllowedQuestions,
  loadGuardrails,
  retrieveChunks,
} from "@/lib/content";
import { askLlm, hasLlm } from "@/lib/llm";

export const runtime = "nodejs";

type IncomingMessage = { role?: string; content?: string };

function offTopicFallback() {
  return "這個問題超出本站知識庫與教師指定問題。我只能回答國中科展社團講義、全國科展規則，或老師在「指定問題」檔裡寫過的內容。請改問評審標準、變因、研究日誌、安全規則或本週作業。";
}

function searchAnswer(question: string) {
  const chunks = retrieveChunks(question, 4);
  const allowed = loadAllowedQuestions();
  const inAllowed = allowed.includes(question.trim()) || /指定問題|這個網站|幾小時|四面向|日誌|幾人/.test(question);

  if (chunks.length === 0 && !inAllowed) {
    return { answer: offTopicFallback(), sources: [] as { title: string; href: string; heading: string }[] };
  }

  const sources = chunks.map((chunk) => ({
    title: chunk.title,
    href: chunk.href,
    heading: chunk.heading,
  }));

  const body = chunks
    .map((chunk, index) => `【${index + 1} ${chunk.title}／${chunk.heading}】\n${chunk.text.slice(0, 500)}`)
    .join("\n\n");

  const answer = [
    "目前尚未設定 AI 金鑰，我先用講義檢索回答（只引用本站資料，不向外搜尋）。",
    "",
    body || "請改看「教師指定問題」檔。",
    "",
    "若要讓助教用完整句子整理，請在 Vercel 環境變數加入 OPENAI_API_KEY 或 GROQ_API_KEY。",
  ].join("\n");

  return { answer, sources };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: IncomingMessage[] };
    const messages = (body.messages || [])
      .filter((item) => item.content && (item.role === "user" || item.role === "assistant"))
      .map((item) => ({
        role: item.role as "user" | "assistant",
        content: String(item.content).slice(0, 2000),
      }));

    const question = [...messages].reverse().find((item) => item.role === "user")?.content?.trim();
    if (!question) {
      return NextResponse.json({ error: "請先輸入問題。" }, { status: 400 });
    }

    const chunks = retrieveChunks(question, 6);
    const sources = chunks.map((chunk) => ({
      title: chunk.title,
      href: chunk.href,
      heading: chunk.heading,
    }));

    if (!hasLlm()) {
      const fallback = searchAnswer(question);
      return NextResponse.json({
        answer: fallback.answer,
        sources: fallback.sources,
        mode: "search",
      });
    }

    const context = chunks
      .map((chunk, index) => `來源${index + 1}《${chunk.title}》${chunk.heading}\n${chunk.text}`)
      .join("\n\n---\n\n");

    const system = [
      loadGuardrails(),
      "",
      "以下是教師指定問題與解答，優先對照：",
      loadAllowedQuestions(),
      "",
      "以下是從本站講義檢索到的段落。沒有出現的事實不要編造：",
      context || "（沒有檢索到相關段落。若問題也不在指定問題中，請拒絕回答。）",
    ].join("\n");

    const answer = await askLlm(system, messages.slice(-8));
    return NextResponse.json({
      answer: answer || offTopicFallback(),
      sources,
      mode: "llm",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "伺服器錯誤";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
