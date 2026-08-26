# 國中科展社團課｜講義網站

GitHub：https://github.com/fish0048-ai/science-fair-club  
線上網站：https://science-fair-club.vercel.app/

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/import?s=https://github.com/fish0048-ai/science-fair-club)

17 週國中科展社團講義（對齊台灣全國中小學科學展覽會評審標準），可部署到 **Vercel**。右下角 AI 助教**只根據本站知識庫與教師指定問題**回答，不會當成萬能機器人。

## GitHub ↔ Vercel 自動同步

- **GitHub**：https://github.com/fish0048-ai/science-fair-club（`main`）
- **Vercel 正式網址**：https://science-fair-club.vercel.app/（已與 GitHub 連接）
- 之後只要 push `main`，網站會自動更新。不必再手動上傳，也不必再走一次匯入。
- Cursor 每次改完檔案都必須自動 commit 並 push；規則在 `.cursor/rules/`，催促腳本在 `.cursor/hooks.json`。

## 本機預覽

需要 Node.js 18 以上。

```bash
npm install
npm run dev
```

瀏覽器打開 http://localhost:3000  
上課模式：http://localhost:3000/class  
列印講義：http://localhost:3000/print  
教師教案：http://localhost:3000/plans

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

## 列印講義

- 網址：`/print`
- 全冊或單週都有**封面插圖**；全冊另附**目錄（含各章起始頁碼）**
- 封面與各章頁首含 **班級、座號、姓名**（可先填或留白手寫）
- **頁碼**：內文從 1 起編，**封面不印頁碼**；目錄右側數字對應該章第一頁
- 紙張：A4 直向；可用瀏覽器列印或另存 PDF（請關閉瀏覽器預設頁首／頁尾，避免印出網址）
- 學生版會去掉教學流程、教師備課清單與教師提示（參考答案）
- 教師教案請走 `/plans` 或 `/print/plans`，不要和學生講義印在一起

## 教師教案

- 網址：`/plans`
- 17 週皆有素養導向教案，對齊 108 課綱自然科學領域（學習表現、學習內容、核心素養、議題融入、評量規準）
- 第 9–16 週為研究教練教案，不預先鎖死實驗步驟
- 可列印全冊或單週；封面可填授課班級

## 上課模式

- 網址：`/class`
- 適合投影：大字、翻頁、隱藏側欄與助教
- `開始上課` 後啟動 120 分鐘計時，並依該週「教學流程」顯示現在時段
- 快捷鍵：← → 翻頁、空白鍵下一頁、F 全螢幕、T 計時、O 大綱、H 顯示教師頁（含教學流程，預設隱藏）
- 投影頁會依內容配插圖（開場大圖，其餘在側欄）

## 課程內容

- 第 1–8 週：全國科展基本能力講義（已完成）
- 第 9–16 週：依學生主題再補
- 第 17 週：成果發表
