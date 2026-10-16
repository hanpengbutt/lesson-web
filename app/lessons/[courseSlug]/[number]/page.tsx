import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPage } from "@/components/lesson/LessonPage";
import { getCourseOverview, getCourseSlugs, getLesson, getLessons } from "@/lib/lesson-content";
import { parseLesson } from "@/lib/lesson-markdown";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCourseSlugs().flatMap((courseSlug) => getLessons(courseSlug).map(({ number }) => ({ courseSlug, number })));
}

export async function generateMetadata({ params }: PageProps<"/lessons/[courseSlug]/[number]">): Promise<Metadata> {
  const { courseSlug, number } = await params;
  const source = getLesson(courseSlug, number);
  return source ? { title: parseLesson(source.markdown).title } : { title: "교안을 찾을 수 없음" };
}

export default async function LessonRoute({ params }: PageProps<"/lessons/[courseSlug]/[number]">) {
  const { courseSlug, number } = await params;
  const source = getLesson(courseSlug, number);
  const course = getCourseOverview(courseSlug);
  if (!source || !course) notFound();
  return <LessonPage data={parseLesson(source.markdown)} lessonNumber={source.number} courseSlug={courseSlug} courseTitle={course.title} />;
}
