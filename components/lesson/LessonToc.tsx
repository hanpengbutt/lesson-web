import Link from "next/link";

type TocItem = { label: string; href: string };

export function LessonToc({ items, mode = "both" }: { items: TocItem[]; mode?: "both" | "mobile" | "desktop" }) {
  const links = items.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>);
  return <>
    {mode !== "desktop" && <details className="mobile-toc mobile-only">
      <summary>이 수업 목차</summary>
      <ol>{links}</ol>
    </details>}
    {mode !== "mobile" && <nav className="lesson-toc desktop-only" aria-label="수업 목차">
      <h2>이 수업 목차</h2>
      <ol>{links}</ol>
    </nav>}
  </>;
}
