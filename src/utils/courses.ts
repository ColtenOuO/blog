import { getCollection, type CollectionEntry } from 'astro:content';
import { readingTime } from './posts';

export type Course = CollectionEntry<'courses'>;
export type Lesson = CollectionEntry<'lessons'>;

const visible = (e: { data: { draft: boolean } }) => (import.meta.env.PROD ? !e.data.draft : true);

/** 所有課程（正式環境排除草稿），依 order 排序 */
export async function getCourses(): Promise<Course[]> {
  const courses = await getCollection('courses', visible);
  return courses.sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}

/** 單元 id 是「課程/檔名」，取出所屬課程 */
export const lessonCourse = (l: Lesson) => l.id.split('/')[0];
/** 單元在網址上的名字（檔名） */
export const lessonSlug = (l: Lesson) => l.id.split('/').slice(1).join('/');

/** 某門課的所有單元，依 unit 排序 */
export async function getLessons(courseId: string): Promise<Lesson[]> {
  const lessons = await getCollection('lessons', (l) => visible(l) && lessonCourse(l) === courseId);
  return lessons.sort((a, b) => a.data.unit - b.data.unit);
}

/** 依 course.yaml 的 parts 把單元分組；沒寫 part 的放最前面 */
export function groupLessons(course: Course, lessons: Lesson[]): { part?: string; lessons: Lesson[] }[] {
  const groups: { part?: string; lessons: Lesson[] }[] = [];
  const loose = lessons.filter((l) => !l.data.part);
  if (loose.length) groups.push({ lessons: loose });
  const parts = [...course.data.parts, ...new Set(lessons.map((l) => l.data.part).filter(Boolean) as string[])];
  for (const part of new Set(parts)) {
    const ls = lessons.filter((l) => l.data.part === part);
    if (ls.length) groups.push({ part, lessons: ls });
  }
  return groups;
}

export const courseUrl = (id: string) => `/courses/${id}/`;
export const lessonUrl = (l: Lesson) => `/courses/${l.id}/`;
export const unitLabel = (n: number) => `Unit ${String(n).padStart(2, '0')}`;

export interface CourseSummary {
  course: Course;
  lessons: Lesson[];
  minutes: number;
  /** 所有單元中最新的 updated / date */
  updated?: Date;
}

/** 課程列表用：每門課的單元數、總閱讀時間、最後更新日期 */
export async function getCourseSummaries(): Promise<CourseSummary[]> {
  return Promise.all(
    (await getCourses()).map(async (course) => {
      const lessons = await getLessons(course.id);
      const dates = lessons.map((l) => l.data.updated ?? l.data.date).filter((d): d is Date => !!d);
      return {
        course,
        lessons,
        minutes: lessons.reduce((sum, l) => sum + readingTime(l.body), 0),
        updated: dates.length ? new Date(Math.max(...dates.map((d) => d.valueOf()))) : undefined,
      };
    }),
  );
}
