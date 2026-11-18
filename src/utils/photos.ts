import { getImage } from 'astro:assets';

// 自動讀取 src/assets/photos/ 的照片
// 檔名會變成照片說明，例如「京都-伏見稻荷_2024.jpg」→「京都 伏見稻荷 · 2024」
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/photos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

export interface Photo {
  src: string;
  caption: string;
  file: string;
}

let cache: Promise<Photo[]> | undefined;

export function getPhotos(): Promise<Photo[]> {
  cache ??= Promise.all(
    Object.entries(files)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(async ([path, mod]) => {
        const img = await getImage({ src: mod.default, width: 2000, format: 'webp', quality: 80 });
        const name = path.split('/').pop()!.replace(/\.[^.]+$/, '');
        const caption = name.replace(/_/g, ' · ').replace(/-/g, ' ');
        return { src: img.src, caption, file: name };
      }),
  );
  return cache;
}
