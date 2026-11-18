import { getCollection, type CollectionEntry } from 'astro:content';
import type { Category } from '../config';

export type Post = CollectionEntry<'posts'>;

/** 取得所有文章（正式環境會排除草稿），依日期新到舊排序 */
export async function getPosts(filter?: (p: Post) => boolean): Promise<Post[]> {
  const posts = await getCollection('posts', (p) => (import.meta.env.PROD ? !p.data.draft : true));
  return posts
    .filter((p) => (filter ? filter(p) : true))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const byCategory = (...cats: Category[]) => (p: Post) => cats.includes(p.data.category);

export const postUrl = (p: Post) => `/posts/${p.id}/`;

export const tagUrl = (tag: string) => `/tags/${encodeURIComponent(tag)}/`;

/** 粗估閱讀時間：中文約 400 字/分、英文約 200 詞/分 */
export function readingTime(body = ''): number {
  const text = body.replace(/```[\s\S]*?```/g, '').replace(/<[^>]+>/g, '');
  const cjk = (text.match(/[一-鿿]/g) ?? []).length;
  const words = (text.replace(/[一-鿿]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' });
}
