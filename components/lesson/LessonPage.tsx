import Link from "next/link";
import type { LessonPageData } from "@/lib/lesson-markdown";
import { LessonToc } from "@/components/lesson/LessonToc";
import { MarkdownContent } from "@/components/lesson/MarkdownContent";

export function LessonPage({ data, lessonNumber, courseSlug, courseTitle }: { data: LessonPageData; lessonNumber: string; courseSlug: string; courseTitle: string }) {
  return <main className="page-shell">
    <nav className="breadcrumb" aria-label="현재 위치"><Link href="/">교안 보관함</Link> / <Link href={`/lessons/${courseSlug}`}>{courseTitle}</Link> / {lessonNumber}주차</nav>
    <div className="lesson-layout">
      <article className="lesson-main">
        <header className="lesson-header">
          <div className="lesson-kicker"><span>{lessonNumber}주차</span></div>
          <h1>{data.title.replace(/^\d+주차:\s*/, "")}</h1>
        </header>
        <LessonToc items={data.toc} mode="mobile" />
        {data.sections.map((section) => <section className={`lesson-section kind-${section.kind}`} id={section.id} key={section.id}>
          <h2>{section.heading}</h2>
          <MarkdownContent nodes={section.nodes} />
        </section>)}
        <nav className="lesson-bottom-nav" aria-label="교안 이동">
          <Link href={`/lessons/${courseSlug}`}>← 과정으로 돌아가기</Link>
        </nav>
      </article>
      <LessonToc items={data.toc} mode="desktop" />
    </div>
  </main>;
}
