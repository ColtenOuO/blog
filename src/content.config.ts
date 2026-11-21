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

export const collections = { posts };
