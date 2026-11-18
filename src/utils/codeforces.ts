// build 時向 Codeforces API 查詢 rank / 最高 rating；失敗時回傳 null，沿用 profile.yaml 的設定
const cache = new Map<string, Promise<{ rank: string; maxRating: number } | null>>();

export function getCodeforces(handle: string) {
  if (!cache.has(handle)) {
    cache.set(
      handle,
      (async () => {
        try {
          const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`, {
            signal: AbortSignal.timeout(8000),
          });
          if (!res.ok) return null;
          const data = (await res.json()) as { status: string; result: { maxRank: string; maxRating: number }[] };
          if (data.status !== 'OK' || !data.result[0]) return null;
          return { rank: data.result[0].maxRank, maxRating: data.result[0].maxRating };
        } catch {
          return null;
        }
      })(),
    );
  }
  return cache.get(handle)!;
}
