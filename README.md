# 國中科展社團課｜講義網站

17 週國中科展社團講義（對齊台灣全國中小學科學展覽會評審標準），可部署到 **Vercel**。右下角 AI 助教**只根據本站知識庫與教師指定問題**回答，不會當成萬能機器人。

## 本機預覽

需要 Node.js 18 以上。

```bash
npm install
npm run dev
```

瀏覽器打開 http://localhost:3000

## 部署到 Vercel

1. 把本 repo 推上 GitHub。
2. 到 [Vercel](https://vercel.com/new) 匯入這個 GitHub 專案。
3. Framework 選 Next.js，其他用預設即可。
4. （建議）在 Vercel → Settings → Environment Variables 加入其一：
   - `OPENAI_API_KEY`（可再設 `OPENAI_MODEL=gpt-4o-mini`）
   - 或 `GROQ_API_KEY`（Groq 的 OpenAI 相容 API）
5. Deploy。

沒有金鑰時，助教仍會**只從講義做檢索回答**，但文句較像摘錄。有金鑰後才會用模型把講義整理成完整句子，且系統提示會禁止超出範圍的問題。

## 限定 AI 只答你准的內容

可編輯這兩個檔，不必改程式：

| 檔案 | 用途 |
| --- | --- |
| `content/ai/guardrails.md` | 助教守則：能答／不能答 |
| `content/ai/allowed-questions.md` | 教師指定問答；按「問／答」格式增刪即可 |
| `國中科展社團課程/` | 課程講義知識庫（網站與 AI 都會讀這裡） |

助教檢索範圍僅限 `content/`，不會上網搜尋。

## 課程內容

- 第 1–8 週：全國科展基本能力講義（已完成）
- 第 9–16 週：依學生主題再補
- 第 17 週：成果發表
