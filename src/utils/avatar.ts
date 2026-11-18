import { PROFILE } from '../data';

// profile.yaml 的 avatar 對應到 src/assets/profile/ 裡的圖片
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/profile/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

export const avatar: ImageMetadata | undefined = Object.entries(files).find(
  ([p]) => p.split('/').pop() === PROFILE.avatar,
)?.[1].default;
