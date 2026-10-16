import Link from "next/link";
import type { CourseOverview as CourseOverviewData, LessonSummary } from "@/lib/lesson-content";

export function CourseOverview({ course, lessons }: { course: CourseOverviewData; lessons: LessonSummary[] }) {
  return <main className="page-shell">
    <nav className="breadcrumb" aria-label="현재 위치"><Link href="/">교안 보관함</Link> / {course.title}</nav>
    <header className="course-hero">
      <p className="eyebrow">COURSE · {course.slug}</p>
      <h1>{course.title}</h1>
      <p>{course.topic}</p>
    </header>
    <section className="content-card" aria-labelledby="goal-heading">
      <p className="eyebrow">FINAL GOAL</p>
      <h2 id="goal-heading">과정이 끝나면</h2>
      <p>{course.finalGoal || "과정 목표가 아직 작성되지 않았습니다."}</p>
    </section>
    <section className="course-weeks" aria-labelledby="weeks-heading">
      <div className="section-heading"><div><p className="eyebrow">ROADMAP</p><h2 id="weeks-heading">주차별 학습 흐름</h2></div></div>
      <div className="week-list">
        {course.weeks.map((week) => {
          const lessonNumber = week.number.match(/^(\d{1,2})/)?.[1]?.padStart(2, "0");
          const lesson = lessons.find((item) => item.number === lessonNumber);
          const title = week.topic || week.number;
          const content = <><div><h3>{week.number} · {title}</h3><p>{week.goal || week.product}</p></div><span className="week-state">{lesson ? "교안 보기 →" : "계획 중"}</span></>;
          return lesson
            ? <Link className="week-card" href={`/lessons/${course.slug}/${lesson.number}`} key={week.number}>{content}</Link>
            : <div className="week-card" key={week.number}>{content}</div>;
        })}
        {!course.weeks.length && <div className="empty-state"><p>주차별 계획이 아직 준비되지 않았어요.</p></div>}
      </div>
    </section>
  </main>;
}
