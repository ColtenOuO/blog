// Cloudflare Worker：只處理 /api/*，其餘請求一律交給靜態資源（dist/）
//
//   GET  /api/views?slugs=a,b,c   → { "a": 12, "b": 0, "c": 3 }
//   POST /api/views/<slug>        → { "slug": "<slug>", "count": 13 }（+1 後的數字）

interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

// post.id 只會是小寫英數、- _ 與 / 組成
const SLUG_RE = /^[a-z0-9][a-z0-9/_-]{0,199}$/i;
const MAX_BATCH = 100;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

async function getViews(url: URL, env: Env): Promise<Response> {
  const slugs = [...new Set((url.searchParams.get('slugs') ?? '').split(',').filter((s) => SLUG_RE.test(s)))];
  if (!slugs.length) return json({});
  if (slugs.length > MAX_BATCH) return json({ error: 'too many slugs' }, 400);

  const { results } = await env.DB.prepare(
    `SELECT slug, count FROM views WHERE slug IN (${slugs.map(() => '?').join(',')})`,
  )
    .bind(...slugs)
    .all<{ slug: string; count: number }>();

  const out: Record<string, number> = Object.fromEntries(slugs.map((s) => [s, 0]));
  for (const r of results) out[r.slug] = r.count;
  return json(out);
}

async function addView(slug: string, request: Request, env: Env): Promise<Response> {
  if (!SLUG_RE.test(slug)) return json({ error: 'bad slug' }, 400);

  // 只替真的存在的文章計數，避免有人亂打 API 塞垃圾資料
  const page = await env.ASSETS.fetch(new URL(`/posts/${slug}/`, request.url));
  if (page.status !== 200) return json({ error: 'not found' }, 404);

  const row = await env.DB.prepare(
    `INSERT INTO views (slug, count) VALUES (?, 1)
     ON CONFLICT(slug) DO UPDATE SET count = count + 1
     RETURNING count`,
  )
    .bind(slug)
    .first<{ count: number }>();

  return json({ slug, count: row?.count ?? 1 });
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/views' && request.method === 'GET') {
      return getViews(url, env);
    }
    if (url.pathname.startsWith('/api/views/') && request.method === 'POST') {
      return addView(decodeURIComponent(url.pathname.slice('/api/views/'.length)), request, env);
    }
    if (url.pathname.startsWith('/api/')) {
      return json({ error: 'not found' }, 404);
    }
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
