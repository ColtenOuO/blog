-- 每篇文章的總觀看次數，slug 對應 Astro content 的 post.id（例如 tutorials/p-vs-np）
CREATE TABLE IF NOT EXISTS views (
  slug  TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0
);
