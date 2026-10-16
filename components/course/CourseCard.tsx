import Link from "next/link";
import type { CourseOverview } from "@/lib/lesson-content";

export function CourseCard({ course }: { course: CourseOverview }) {
  return <Link className="course-card" href={`/lessons/${course.slug}`}>
    <p className="course-topic">{course.topic}</p>
    <h3>{course.title}</h3>
    <p>{course.finalGoal || "과정의 학습 목표와 주차별 교안을 살펴보세요."}</p>
    <p className="course-cta">과정 살펴보기 <span aria-hidden="true">→</span></p>
  </Link>;
}
