// 文章觀看次數：把 [data-views="<slug>"] 的元素填上數字。
// 文章頁另外有 [data-views-track="<slug>"]，同一個瀏覽器每篇每天只會 +1 一次。
// API 由 worker/index.ts 提供；拿不到（例如 astro dev）時元素保持空白、不顯示。

const API = '/api/views';
const BATCH = 100;

const today = () => new Date().toLocaleDateString('sv'); // YYYY-MM-DD
const seenKey = (slug: string) => `views:${slug}`;

function alreadyCountedToday(slug: string): boolean {
  try {
    return localStorage.getItem(seenKey(slug)) === today();
  } catch {
    return false;
  }
}

function markCounted(slug: string) {
  try {
    localStorage.setItem(seenKey(slug), today());
  } catch {}
}

async function track(slug: string): Promise<number | undefined> {
  const res = await fetch(`${API}/${encodeURI(slug)}`, { method: 'POST' });
  if (!res.ok) return undefined;
  markCounted(slug);
  return ((await res.json()) as { count: number }).count;
}

async function fetchCounts(slugs: string[]): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  for (let i = 0; i < slugs.length; i += BATCH) {
    const qs = encodeURIComponent(slugs.slice(i, i + BATCH).join(','));
    const res = await fetch(`${API}?slugs=${qs}`);
    if (res.ok) Object.assign(out, await res.json());
  }
  return out;
}

async function run() {
  const els = [...document.querySelectorAll<HTMLElement>('[data-views]')];
  const tracked = document.querySelector<HTMLElement>('[data-views-track]')?.dataset.viewsTrack;
  if (!els.length && !tracked) return;

  const counts: Record<string, number> = {};
  if (tracked && !alreadyCountedToday(tracked)) {
    const n = await track(tracked).catch(() => undefined);
    if (n !== undefined) counts[tracked] = n;
  }

  const rest = [...new Set(els.map((el) => el.dataset.views!))].filter((s) => !(s in counts));
  if (rest.length) Object.assign(counts, await fetchCounts(rest).catch(() => ({})));

  for (const el of els) {
    const n = counts[el.dataset.views!];
    if (n !== undefined) el.textContent = `${n.toLocaleString('zh-TW')} 次觀看`;
  }
}

run();
