import fs from "node:fs";
import path from "node:path";

const lessonsRoot = path.join(process.cwd(), "lessons");

export type LessonSummary = { number: string; title: string; available: boolean };
export type CourseWeek = { number: string; topic: string; goal: string; product: string };
export type CourseOverview = {
  slug: string;
  title: string;
  topic: string;
  finalGoal: string;
  weeks: CourseWeek[];
};
export type LessonSource = { slug: string; number: string; markdown: string };

function isValidSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function getCourseDirectory(slug: string) {
  if (!isValidSlug(slug) || !fs.existsSync(lessonsRoot)) return null;
  const knownSlugs = fs.readdirSync(lessonsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "_template" && isValidSlug(entry.name))
    .map((entry) => entry.name);
  if (!knownSlugs.includes(slug)) return null;
  return path.join(lessonsRoot, slug);
}

function parseField(markdown: string, label: string) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return markdown.match(new RegExp(`^- \\*\\*${escaped}:\\*\\*\\s*(.+)$`, "m"))?.[1]?.trim() ?? "";
}

export function getCourseSlugs(): string[] {
  if (!fs.existsSync(lessonsRoot)) return [];
  return fs.readdirSync(lessonsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "_template" && isValidSlug(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

export function getCourseOverview(courseSlug: string): CourseOverview | null {
  const directory = getCourseDirectory(courseSlug);
  if (!directory) return null;
  const planPath = path.join(directory, "plan.md");
  if (!fs.existsSync(planPath)) return null;
  const markdown = fs.readFileSync(planPath, "utf8");
  const title = parseField(markdown, "교안 제목") || markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || courseSlug;
  const topic = parseField(markdown, "수업 주제");
  const finalGoal = parseField(markdown, "최종 결과물 또는 수행 능력");
  const table = markdown.match(/\|\s*주차\s*\|[^\n]*\n\|[-| :]+\|\n((?:\|[^\n]*\n?)+)/);
  const weeks = (table?.[1] ?? "").split("\n").filter((row) => row.trim().startsWith("|"))
    .map((row) => row.split("|").slice(1, -1).map((cell) => cell.trim()))
    .filter((cells) => cells.length >= 5)
    .map((cells) => ({ number: cells[0].replace(/\s*\([^)]*\)/g, "").trim(), topic: cells[1], goal: cells[2], product: cells[3] }))
    .filter((week) => week.number && !week.number.includes("~"));
  return { slug: courseSlug, title, topic, finalGoal, weeks };
}

function getLessonIndex(directory: string) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const indexed = new Map<string, string>();
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const match = /^lesson-(\d+)\.md$/.exec(entry.name);
    if (!match) continue;
    const number = match[1].padStart(2, "0");
    const existing = indexed.get(number);
    if (existing) throw new Error(`중복된 교안 번호 ${number}: ${existing}, ${entry.name}`);
    indexed.set(number, entry.name);
  }
  return indexed;
}

export function getLessons(courseSlug: string): LessonSummary[] {
  const directory = getCourseDirectory(courseSlug);
  if (!directory) return [];
  const index = getLessonIndex(directory);
  return [...index.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([number, file]) => {
    const markdown = fs.readFileSync(path.join(lessonsRoot, courseSlug, file), "utf8");
    return { number, title: markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? `${number}주차`, available: true };
  });
}

export function getLesson(courseSlug: string, rawNumber: string): LessonSource | null {
  if (!/^\d{1,2}$/.test(rawNumber)) return null;
  const directory = getCourseDirectory(courseSlug);
  if (!directory) return null;
  const number = rawNumber.padStart(2, "0");
  const file = getLessonIndex(directory).get(number);
  if (!file) return null;
  return { slug: courseSlug, number, markdown: fs.readFileSync(path.join(lessonsRoot, courseSlug, file), "utf8") };
}
