export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

function llmConfig() {
  if (process.env.GROQ_API_KEY) {
    return {
      apiKey: process.env.GROQ_API_KEY,
      baseUrl: "https://api.groq.com/openai/v1",
      model: process.env.OPENAI_MODEL || "llama-3.3-70b-versatile",
      provider: "groq" as const,
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      provider: "openai" as const,
    };
  }
  return null;
}

export function hasLlm() {
  return llmConfig() !== null;
}

export async function askLlm(system: string, messages: ChatMessage[]) {
  const config = llmConfig();
  if (!config) return null;

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`LLM 呼叫失敗（${response.status}）：${detail.slice(0, 400)}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() || "";
}
