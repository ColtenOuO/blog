// 全站設定。個人資料與經歷請改 src/data/*.yaml
export const SITE = {
  url: 'https://example.com', // TODO: 換成你的 Cloudflare 網域
  title: "Colten's Blog",
  author: 'Colten',
  description: '教學筆記、專案經歷與旅行雜記',
  locale: 'zh-TW',
};

export const NAV = [
  { label: '首頁', href: '/' },
  { label: '經歷', href: '/about' },
  { label: '研究', href: '/research' },
  { label: '教學', href: '/category/tutorial' },
  { label: '隨筆', href: '/category/notes' },
  { label: '履歷', href: '/resume' },
  { label: '聯絡', href: '/contact' },
];

// 各區塊 / 頁面標題（中文 + 英文附註），改這裡全站一起改
export const SECTIONS = {
  tutorials: { zh: '教學文章', en: 'Tutorials' },
  notes: { zh: '隨筆', en: 'Notes' },
  experience: { zh: '經歷', en: 'Experience' },
  jobs: { zh: '工作與實習', en: 'Work Experience' },
  programs: { zh: '計畫', en: 'Programs' },
  awards: { zh: '競賽與獲獎', en: 'Honors & Awards' },
  awardsShort: { zh: '競賽', en: 'Awards' },
  university: { zh: '大學', en: 'University' },
  highSchool: { zh: '高中', en: 'High School' },
  openSource: { zh: '開源貢獻', en: 'Open Source' },
  projects: { zh: '專案', en: 'Projects' },
  teaching: { zh: '教學', en: 'Teaching' },
  community: { zh: '社群', en: 'Community' },
  teachingCommunity: { zh: '教學與社群', en: 'Teaching & Community' },
  courses: { zh: '開放式課程', en: 'Open Courses' },
  talks: { zh: '演講與報導', en: 'Talks & Press' },
  journals: { zh: '期刊論文', en: 'Journal Papers' },
  intlConferences: { zh: '國際會議論文', en: 'International Conference Papers' },
  domesticConferences: { zh: '國內會議論文', en: 'Domestic Conference Papers' },
  education: { zh: '學歷', en: 'Education' },
  contents: { zh: '目錄', en: 'Contents' },
  tags: { zh: '標籤', en: 'Tags' },
  archive: { zh: '封存', en: 'Archive' },
  contactChannels: { zh: '其他管道', en: 'Elsewhere' },
  resume: { zh: '履歷', en: 'Résumé' },
} as const;

export type SectionKey = keyof typeof SECTIONS;

// 文章分類。「隨筆」頁面 = travel + life
export const CATEGORIES = {
  tutorial: { label: '教學', en: 'Tutorials', description: '技術筆記與教學文章', color: 'var(--c-blue)' },
  travel: { label: '旅遊', en: 'Travel', description: '走過的地方', color: 'var(--c-green)' },
  life: { label: '雜記', en: 'Life', description: '生活與碎碎念', color: 'var(--c-pink)' },
} as const;

export type Category = keyof typeof CATEGORIES;
