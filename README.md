# Blog

用 [Astro](https://astro.build) 建的個人部落格，部署在 Cloudflare Pages。

## 本機開發

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 輸出到 dist/
```

## 常改的地方

個人資料與經歷都在 `src/data/` 的 YAML 檔裡，每個檔案最上面都有欄位說明。
新增一筆就是複製一段、改內容；欄位寫錯時 `npm run build` 會直接告訴你是哪個檔案、哪一筆。

| 想改什麼 | 檔案 |
| --- | --- |
| 名字、自我介紹、首頁小資訊、社群連結 | `src/data/profile.yaml` |
| 學歷 | `src/data/education.yaml` |
| 工作與實習 / 計畫 | `src/data/jobs.yaml` / `src/data/programs.yaml` |
| 競賽（大學 / 高中） | `src/data/awards.yaml` |
| 開源貢獻 | `src/data/open-source.yaml` |
| 專案（`home: true` 會出現在首頁） | `src/data/projects.yaml` |
| 教學 / 社群（`home: true` 會出現在首頁） | `src/data/teaching.yaml` / `src/data/community.yaml` |
| 組織 logo | 放進 `src/assets/logos/`，在 YAML 裡用 `logo: 檔名`（不含副檔名） |
| 個人照片 | `src/assets/profile/`，檔名寫在 `profile.yaml` 的 `avatar` |
| 履歷 PDF | 覆蓋 `public/resume.pdf` |
| 旅行照片 | 丟進 `src/assets/photos/`（自動壓縮、隨機顯示；檔名就是照片說明，例如 `京都-伏見稻荷_2024.jpg` →「京都 伏見稻荷 · 2024」） |
| 區塊標題（中文 + 英文） | `src/config.ts` 的 `SECTIONS` |
| 網站名稱、網域、導覽列 | `src/config.ts` |
| 顏色、字體 | `src/styles/global.css` 最上方的變數 |

## 寫文章

在 `src/content/posts/` 下新增 `.md`（或 `.mdx`），寫法參考 `src/content/posts/tutorials/p-vs-np.md`。

- `category: tutorial` → 教學
- `category: travel` → 旅遊
- `category: life` → 雜記

文章有圖片時，建議一篇一個資料夾（`index.md` + 圖片）。

## 開放式課程

一門課一個資料夾，放在 `src/content/courses/<課程>/`：

```
src/content/courses/competitive-programming/
├── course.yaml        # title（中文課名）、en（英文課名，顯示在左上角）、description、parts（單元分組順序）
├── 01-what-is-cp.md   # 每個單元一個檔案，網址是 /courses/<課程>/<檔名>/
└── 02-complexity.md
```

單元的 frontmatter：`title`、`unit`（單元編號，決定排序）必填；`description`、`part`（對應 course.yaml 的 parts）、`date`、`draft` 選填。內文寫法跟一般文章一樣（Markdown、程式碼、KaTeX 數學式）。

- `/courses/`：所有課程
- `/courses/<課程>/`：課程首頁，選擇單元
- `/courses/<課程>/<單元>/`：單元內容，左側是單元列表與目錄

## 部署到 Cloudflare Pages

1. 把這個 repo push 到 GitHub
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**，選這個 repo
3. Build 設定：
   - Framework preset: `Astro`
   - Build command: `npm run build`
   - Build output directory: `dist`
4. 部署完成後，到專案的 **Custom domains** 加上你的網域（DNS 在 Cloudflare 上會自動設定）
5. 記得把 `src/config.ts` 的 `url` 改成你的網域

之後每次 push 到 `main` 就會自動部署，開 PR 也會有預覽網址。

## 文章觀看次數

觀看次數由 [worker/index.ts](worker/index.ts) 提供 API，資料存在 Cloudflare D1：

- `POST /api/views/<slug>`：+1（前端同一個瀏覽器每篇每天只會送一次）
- `GET /api/views?slugs=a,b,c`：一次查多篇的總數

第一次設定（wrangler 需要 Node.js 22 以上）：

```bash
npx wrangler d1 create blog-views                          # 把印出的 database_id 填進 wrangler.jsonc
npx wrangler d1 migrations apply blog-views --remote       # 建立資料表
```

本地測試：`npm run build && npx wrangler d1 migrations apply blog-views --local && npx wrangler dev`。
`npm run dev`（astro dev）沒有 API，觀看次數不會顯示，這是正常的。
