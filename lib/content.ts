import fs from "fs";
import path from "path";
import { NAV, type NavItem } from "./nav";

export type DocChunk = {
  id: string;
  title: string;
  href: string;
  heading: string;
  text: string;
};

export function readContentFile(relativePath: string) {
  const candidates = [
    path.join(process.cwd(), "content", relativePath),
    path.join(process.cwd(), relativePath),
  ];
  for (const full of candidates) {
    if (fs.existsSync(full)) return fs.readFileSync(full, "utf8");
  }
  throw new Error(`找不到檔案：${relativePath}`);
}

export function getDoc(item: NavItem) {
  return {
    ...item,
    markdown: readContentFile(item.file),
  };
}

function splitChunks(markdown: string, item: NavItem): DocChunk[] {
  const parts = markdown.split(/\n(?=##\s)/);
  return parts
    .map((part, index) => {
      const headingMatch = part.match(/^##\s+(.+)$/m);
      const heading = headingMatch?.[1]?.replace(/[#*`]/g, "").trim() || item.title;
      const text = part.replace(/\s+/g, " ").trim();
      if (text.length < 40) return null;
      return {
        id: `${item.href}-${index}`,
        title: item.title,
        href: item.href,
        heading,
        text: text.slice(0, 1800),
      };
    })
    .filter((chunk): chunk is DocChunk => chunk !== null);
}

let cachedChunks: DocChunk[] | null = null;

export function loadAllChunks(): DocChunk[] {
  if (cachedChunks) return cachedChunks;
  const extraFiles = [
    {
      title: "教師指定問題",
      href: "/docs/ai-allowed",
      file: "ai/allowed-questions.md",
    },
    {
      title: "AI 助教守則",
      href: "/docs/ai-guardrails",
      file: "ai/guardrails.md",
    },
  ];

  const chunks: DocChunk[] = [];
  for (const item of NAV) {
    chunks.push(...splitChunks(readContentFile(item.file), item));
  }
  for (const extra of extraFiles) {
    const markdown = readContentFile(extra.file);
    chunks.push(
      ...splitChunks(markdown, {
        title: extra.title,
        href: extra.href,
        file: extra.file,
        group: "AI",
      }),
    );
  }
  cachedChunks = chunks;
  return chunks;
}

export function loadGuardrails() {
  return readContentFile("ai/guardrails.md");
}

export function loadAllowedQuestions() {
  return readContentFile("ai/allowed-questions.md");
}

function tokenize(query: string) {
  const normalized = query.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const parts = normalized.split(/\s+/).filter((token) => token.length >= 2);
  const extras = normalized.match(/[\u4e00-\u9fff]{2,4}/g) ?? [];
  return Array.from(new Set([...parts, ...extras]));
}

export function retrieveChunks(query: string, limit = 6): DocChunk[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored = loadAllChunks().map((chunk) => {
    const hay = `${chunk.title} ${chunk.heading} ${chunk.text}`.toLowerCase();
    let score = 0;
    for (const token of tokens) {
      if (hay.includes(token)) {
        score += token.length >= 4 ? 3 : 2;
      }
    }
    if (hay.includes(query.trim().toLowerCase())) score += 8;
    return { chunk, score };
  });

  return scored
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.chunk);
}
