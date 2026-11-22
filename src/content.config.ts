import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      // 作者，沒寫就用預設的名字
      author: z.string().default('Jyun-An Chen (Colten)'),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      category: z.enum(['tutorial', 'travel', 'life']),
      tags: z.array(z.string()).default([]),
      // 封面圖：放在文章旁邊，用相對路徑，例如 ./cover.jpg
      cover: image().optional(),
      draft: z.boolean().default(false),
      pinned: z.boolean().default(false),
    }),
});

// 開放式課程：一個資料夾一門課
//   src/content/courses/<課程>/course.yaml   課程資訊
//   src/content/courses/<課程>/<單元>.md     每個單元一頁，用 unit 排序
const courses = defineCollection({
  loader: glob({
    pattern: '*/course.{yaml,yml}',
    base: './src/content/courses',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    title: z.string(), // 中文課名
    en: z.string(), // 英文課名，顯示在課程頁左上角
    description: z.string(),
    // 單元分組的順序；單元的 part 要對應這裡的名字，沒寫 part 的單元會放在最前面
    parts: z.array(z.string()).default([]),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

const lessons = defineCollection({
  loader: glob({ pattern: '*/*.{md,mdx}', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    unit: z.number(), // 單元編號，決定排序與網址前的 Unit 01
    part: z.string().optional(),
    author: z.string().default('Jyun-An Chen (Colten)'),
    date: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, courses, lessons };
