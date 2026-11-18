// build 時向 GitHub 查詢各 repo 的 merged PR 數與 review 過的 PR 數；失敗時沿用 open-source.yaml 裡的靜態數字
// 若在 Cloudflare 設定 GITHUB_TOKEN 環境變數，可避免被 rate limit
export const GITHUB_USER = 'ColtenOuO';
const USER = GITHUB_USER;

export interface GithubCounts {
  merged: Record<string, number>;
  reviewed: Record<string, number>;
}

// 用 search API 撈出所有符合的 PR，依 repo 計數（search API 最多回傳 1000 筆）
async function countByRepo(query: string, headers: Record<string, string>): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (let page = 1; page <= 10; page++) {
    const q = encodeURIComponent(query);
    const res = await fetch(`https://api.github.com/search/issues?q=${q}&per_page=100&page=${page}`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const data = (await res.json()) as { items: { repository_url: string }[] };
    for (const it of data.items) {
      const repo = it.repository_url.split('/').slice(-2).join('/');
      counts[repo] = (counts[repo] ?? 0) + 1;
    }
    if (data.items.length < 100) break;
  }
  return counts;
}

let cache: Promise<GithubCounts | null> | undefined;

export function getGithubCounts(): Promise<GithubCounts | null> {
  cache ??= (async () => {
    try {
      const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
      const token = process.env.GITHUB_TOKEN;
      if (token) headers.Authorization = `Bearer ${token}`;
      const merged = await countByRepo(`author:${USER} is:pr is:merged -user:${USER}`, headers);
      const reviewed = await countByRepo(`reviewed-by:${USER} is:pr -author:${USER} -user:${USER}`, headers);
      return { merged, reviewed };
    } catch {
      return null;
    }
  })();
  return cache;
}

export const mergedPrsUrl = (repo: string) =>
  `https://github.com/${repo}/pulls?q=${encodeURIComponent(`is:pr author:${USER} is:merged`)}`;

export const reviewedPrsUrl = (repo: string) =>
  `https://github.com/${repo}/pulls?q=${encodeURIComponent(`is:pr reviewed-by:${USER} -author:${USER}`)}`;
