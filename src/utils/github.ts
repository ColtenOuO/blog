// build 時向 GitHub 查詢各 repo 的 merged PR 數；失敗時沿用 experience.ts 裡的靜態數字
// 若在 Cloudflare 設定 GITHUB_TOKEN 環境變數，可避免被 rate limit
const USER = 'ColtenOuO';

let cache: Promise<Record<string, number> | null> | undefined;

export function getMergedCounts(): Promise<Record<string, number> | null> {
  cache ??= (async () => {
    try {
      const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
      const token = process.env.GITHUB_TOKEN;
      if (token) headers.Authorization = `Bearer ${token}`;
      const counts: Record<string, number> = {};
      for (let page = 1; page <= 5; page++) {
        const q = encodeURIComponent(`author:${USER} is:pr is:merged -user:${USER}`);
        const res = await fetch(`https://api.github.com/search/issues?q=${q}&per_page=100&page=${page}`, {
          headers,
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return null;
        const data = (await res.json()) as { items: { repository_url: string }[] };
        for (const it of data.items) {
          const repo = it.repository_url.split('/').slice(-2).join('/');
          counts[repo] = (counts[repo] ?? 0) + 1;
        }
        if (data.items.length < 100) break;
      }
      return counts;
    } catch {
      return null;
    }
  })();
  return cache;
}

export const mergedPrsUrl = (repo: string) =>
  `https://github.com/${repo}/pulls?q=${encodeURIComponent(`is:pr author:${USER} is:merged`)}`;
