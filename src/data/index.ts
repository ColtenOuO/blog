// 讀取 src/data/*.yaml 並檢查格式。要改內容請直接改 yaml 檔，不用動這個檔案。
// 欄位寫錯（例如拼錯 medal、少了必填欄位）時，build 會直接報錯並指出是哪個檔案。
import { parse } from 'yaml';
import { z } from 'astro/zod';

import profileRaw from './profile.yaml?raw';
import educationRaw from './education.yaml?raw';
import jobsRaw from './jobs.yaml?raw';
import programsRaw from './programs.yaml?raw';
import awardsRaw from './awards.yaml?raw';
import openSourceRaw from './open-source.yaml?raw';
import projectsRaw from './projects.yaml?raw';
import teachingRaw from './teaching.yaml?raw';
import communityRaw from './community.yaml?raw';

// ---------- schema ----------
const icon = z.enum(['trophy', 'code', 'people', 'school', 'book', 'star']);
export type Icon = z.infer<typeof icon>;

const bool = z.preprocess((v) => v === true || v === 'true', z.boolean()).default(false);
const link = z.object({ label: z.string(), href: z.string() });

const profile = z.object({
  name: z.string(),
  nickname: z.string(),
  headline: z.string(),
  avatar: z.string(),
  intro: z.array(z.string()),
  facts: z.array(z.object({ label: z.string(), value: z.string() })),
  socials: z.array(link),
  cp: z
    .array(
      z.object({
        site: z.string(),
        handle: z.string(),
        rank: z.string().optional(),
        rating: z.coerce.number().optional(),
        url: z.string(),
      }),
    )
    .default([]),
});

const education = z.object({
  school: z.string(),
  school_en: z.string().optional(),
  degree: z.string(),
  degree_en: z.string().optional(),
  period: z.string(),
  logo: z.string().optional(),
  lab: z.object({ name: z.string(), url: z.string().optional() }).optional(),
  note: z.string().optional(),
});

const job = z.object({
  role: z.string(),
  company: z.string(),
  period: z.string(),
  logo: z.string().optional(),
  icon: icon.optional(),
  url: z.string().optional(),
  bullets: z.array(z.string()).optional(),
});

const award = z.object({
  name: z.string(),
  result: z.string(),
  date: z.string().optional(),
  note: z.string().optional(),
  medal: z.enum(['gold', 'silver', 'bronze']).optional(),
  logo: z.string().optional(),
  icon: icon.optional(),
});

const openSource = z.object({
  repo: z.string(),
  merged: z.coerce.number(),
  unit: z.string().optional(),
  href: z.string().optional(),
  role: z.string().optional(),
  note: z.string().optional(),
  logo: z.string().optional(),
  links: z.array(link).optional(),
  highlights: z.array(z.object({ title: z.string(), pr: z.coerce.number() })).optional(),
});

const project = z
  .object({
    name: z.string(),
    description: z.string(),
    kind: z.string().optional(),
    tech: z.array(z.string()).optional(),
    github: z.string().optional(),
    links: z.array(link).optional(),
    home: bool,
  })
  // github: owner/repo 會自動變成一個 GitHub 連結
  .transform(({ github, links = [], ...p }) => ({
    ...p,
    links: github ? [{ label: 'GitHub', href: `https://github.com/${github}` }, ...links] : links,
  }));

const item = z.object({
  title: z.string(),
  period: z.string().optional(),
  detail: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  url: z.string().optional(),
  logo: z.string().optional(),
  icon: icon.optional(),
  home: bool,
});

// ---------- 讀檔 ----------
// failsafe：所有值先當字串讀進來，避免 2023.10 被當成數字 2023.1
function load<T extends z.ZodTypeAny>(file: string, raw: string, schema: T): z.infer<T> {
  const result = schema.safeParse(parse(raw, { schema: 'failsafe' }) ?? []);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`src/data/${file} 格式有誤：\n${issues}`);
  }
  return result.data;
}

export const PROFILE = load('profile.yaml', profileRaw, profile);
export const SOCIALS = PROFILE.socials;
export const EDUCATION = load('education.yaml', educationRaw, z.array(education));
export const JOBS = load('jobs.yaml', jobsRaw, z.array(job));
export const PROGRAMS = load('programs.yaml', programsRaw, z.array(job));
const awards = load(
  'awards.yaml',
  awardsRaw,
  z.object({ university: z.array(award).default([]), high_school: z.array(award).default([]) }),
);
export const AWARDS = awards.university;
export const AWARDS_HIGH_SCHOOL = awards.high_school;
export const OPEN_SOURCE = load('open-source.yaml', openSourceRaw, z.array(openSource));
export const PROJECTS = load('projects.yaml', projectsRaw, z.array(project));
export const TEACHING = load('teaching.yaml', teachingRaw, z.array(item));
export const COMMUNITY = load('community.yaml', communityRaw, z.array(item));

// 首頁「教學與社群」：teaching / community 裡標了 home: true 的項目
export const HIGHLIGHTS = [...TEACHING, ...COMMUNITY].filter((i) => i.home);

export type Education = z.infer<typeof education>;
export type Job = z.infer<typeof job>;
export type Award = z.infer<typeof award>;
export type OpenSource = z.infer<typeof openSource>;
export type Project = z.output<typeof project>;
export type Item = z.infer<typeof item>;
