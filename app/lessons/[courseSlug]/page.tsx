import { notFound } from "next/navigation";
import { CourseOverview } from "@/components/course/CourseOverview";
import { getCourseOverview, getCourseSlugs, getLessons } from "@/lib/lesson-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCourseSlugs().map((courseSlug) => ({ courseSlug }));
}

export default async function CoursePage({ params }: PageProps<"/lessons/[courseSlug]">) {
  const { courseSlug } = await params;
  const course = getCourseOverview(courseSlug);
  if (!course) notFound();
  return <CourseOverview course={course} lessons={getLessons(courseSlug)} />;
}
