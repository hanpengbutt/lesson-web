import Link from "next/link";
import { CourseCard } from "@/components/course/CourseCard";
import { getCourseSlugs, getCourseOverview } from "@/lib/lesson-content";

export default function HomePage() {
  const courses = getCourseSlugs()
    .map((slug) => getCourseOverview(slug))
    .filter((course) => course !== null);

  return (
    <main className="home-shell">
      <header className="site-header"><Link className="brand" href="/">교안 보관함</Link><span>함께 배우고 직접 만들어 봐요</span></header>
      <section className="home-hero">
        <p className="eyebrow">CODING CLASSROOM</p>
        <h1>배우고, 실험하고,<br />내 것으로 만들기</h1>
        <p>수업에서 배우는 개념을 직접 실행하고 바꿔 보며 익혀요.</p>
      </section>
      <section aria-labelledby="courses-heading" className="course-list">
        <div className="section-heading"><div><p className="eyebrow">COURSES</p><h2 id="courses-heading">진행 중인 과정</h2></div><span>{courses.length}개 과정</span></div>
        {courses.length ? courses.map((course) => <CourseCard key={course.slug} course={course} />) : <div className="empty-state"><h3>아직 공개된 과정이 없어요</h3><p>lessons 폴더에 교안 계획을 추가하면 여기에 표시됩니다.</p></div>}
      </section>
      <footer className="site-footer">수업 자료는 계속 다듬어집니다.</footer>
    </main>
  );
}
