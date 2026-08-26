# 國中科展社團課｜講義網站

GitHub：https://github.com/fish0048-ai/science-fair-club

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/import?s=https://github.com/fish0048-ai/science-fair-club)

17 週國中科展社團講義（對齊台灣全國中小學科學展覽會評審標準），可部署到 **Vercel**。右下角 AI 助教**只根據本站知識庫與教師指定問題**回答，不會當成萬能機器人。

## GitHub ↔ Vercel 自動同步

1. **一次匯入（若尚未連接）**：用 GitHub 登入 Vercel，匯入同一個 repo  
   https://vercel.com/new/import?s=https://github.com/fish0048-ai/science-fair-club  
   Production Branch 選 `main`。
2. **之後**：只要有更新並 push 到 `main`，Vercel 會自動重新部署。
3. **Cursor 規定**：每次改完檔案都必須自動 commit 並 push GitHub，不必再下「幫我推上去」。未同步時，專案 hook 會在對話結束再催一次。
4. 規則檔：`.cursor/rules/`；自動催促腳本：`.cursor/hooks.json`

## 本機預覽

需要 Node.js 18 以上。

```bash
npm install
npm run dev
```

瀏覽器打開 http://localhost:3000  
上課模式：http://localhost:3000/class

## 部署到 Vercel（環境變數）

第一次匯入後，可在 Vercel → Settings → Environment Variables 加入 `OPENAI_API_KEY` 或 `GROQ_API_KEY`。沒有金鑰時，助教仍會只從講義檢索；有金鑰才會整理成完整句子。金鑰不要寫進 git。

## 限定 AI 只答你准的內容

可編輯這兩個檔，不必改程式：

| 檔案 | 用途 |
| --- | --- |
| `content/ai/guardrails.md` | 助教守則：能答／不能答 |
| `content/ai/allowed-questions.md` | 教師指定問答；按「問／答」格式增刪即可 |
| `國中科展社團課程/` | 課程講義知識庫（網站與 AI 都會讀這裡） |

助教檢索範圍僅限本站講義與指定問題，不會上網搜尋。

## 上課模式

- 網址：`/class`
- 適合投影：大字、翻頁、隱藏側欄與助教
- `開始上課` 後啟動 120 分鐘計時，並依該週「教學流程」顯示現在時段
- 快捷鍵：← → 翻頁、空白鍵下一頁、F 全螢幕、T 計時、O 大綱、H 顯示教師備課頁

## 課程內容

- 第 1–8 週：全國科展基本能力講義（已完成）
- 第 9–16 週：依學生主題再補
- 第 17 週：成果發表
