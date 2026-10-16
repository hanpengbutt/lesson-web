import { Fragment, createElement, type ReactNode } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { CodePlayground } from "@/components/lesson/CodePlayground";

type MdNode = {
  type: string;
  children?: MdNode[];
  value?: string;
  depth?: number;
  url?: string;
  lang?: string | null;
  meta?: string | null;
  ordered?: boolean;
  start?: number | null;
  checked?: boolean | null;
  alt?: string | null;
};

export type LessonSection = { kind: string; heading: string; id: string; nodes: MdNode[] };
export type LessonPageData = { title: string; audience: string; lessonNumber: string; sections: LessonSection[]; toc: { label: string; href: string }[] };

function textContent(node: MdNode): string {
  if (node.type === "text" || node.type === "inlineCode") return node.value ?? "";
  return (node.children ?? []).map(textContent).join("");
}

function slugify(value: string) {
  return value.toLocaleLowerCase("ko").normalize("NFKC").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "section";
}

export function parseLesson(markdown: string): LessonPageData {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as unknown as MdNode;
  const root = tree.children ?? [];
  const title = root.find((node) => node.type === "heading" && node.depth === 1);
  const audienceMatch = markdown.match(/^- \*\*대상 \/ 주차:\*\*\s*(.+)$/m);
  const lessonNumber = audienceMatch?.[1]?.match(/(\d{1,2})주차/)?.[1]?.padStart(2, "0") ?? "";
  const boundaries: { heading: string; nodes: MdNode[] }[] = [];
  let current: { heading: string; nodes: MdNode[] } | null = null;
  let hidingPrivateSection = false;
  let hidingPrivateSubsection = false;

  for (const node of root) {
    if (node.type === "heading" && node.depth === 2) {
      const heading = textContent(node).trim();
      hidingPrivateSection = /교사용 메모|정답 코드|교사 참고/.test(heading);
      hidingPrivateSubsection = false;
      current = hidingPrivateSection ? null : { heading, nodes: [] };
      if (current) boundaries.push(current);
      continue;
    }
    if (node.type === "heading" && node.depth === 3) {
      const heading = textContent(node).trim();
      hidingPrivateSubsection = /교사용 메모|정답 코드|정답 예시|지도 참고/.test(heading);
    }
    if (!hidingPrivateSection && !hidingPrivateSubsection && current) current.nodes.push(node);
  }

  const usedIds = new Map<string, number>();
  const sections = boundaries.map(({ heading, nodes }) => {
    const base = slugify(heading);
    const occurrence = usedIds.get(base) ?? 0;
    usedIds.set(base, occurrence + 1);
    const id = occurrence ? `${base}-${occurrence + 1}` : base;
    return { kind: "content", heading, id, nodes };
  });

  return {
    title: title ? textContent(title).trim() : "수업 교안",
    audience: audienceMatch?.[1]?.trim() ?? "",
    lessonNumber,
    sections,
    toc: sections.map((section) => ({ label: section.heading, href: `#${section.id}` })),
  };
}

function renderNode(node: MdNode, key: number | string): ReactNode {
  const children = node.children?.map((child, index) => renderNode(child, index));
  switch (node.type) {
    case "text": return node.value;
    case "emphasis": return createElement("em", { key }, children);
    case "strong": return createElement("strong", { key }, children);
    case "delete": return createElement("del", { key }, children);
    case "inlineCode": return createElement("code", { key }, node.value);
    case "break": return createElement("br", { key });
    case "paragraph": return createElement("p", { key }, children);
    case "heading": return createElement(`h${Math.min(Math.max(node.depth ?? 3, 3), 6)}`, { key }, children);
    case "blockquote": {
      const firstChild = node.children?.[0];
      if (firstChild?.type === "paragraph" && textContent(firstChild).trim() === "힌트 보기") {
        const hintContent = node.children?.slice(1).map((child, index) => renderNode(child, index));
        return createElement("details", { key, className: "lesson-hint" },
          createElement("summary", null, "힌트 보기"),
          createElement("div", { className: "lesson-hint-content" }, hintContent),
        );
      }
      return createElement("blockquote", { key }, children);
    }
    case "list": {
      const tag = node.ordered ? "ol" : "ul";
      return createElement(tag, { key, start: node.ordered && node.start && node.start !== 1 ? node.start : undefined }, children);
    }
    case "listItem": return createElement("li", { key }, children);
    case "link": {
      const href = node.url ?? "#";
      const safe = href.startsWith("/") || href.startsWith("#") || /^https?:\/\//i.test(href) ? href : "#";
      return createElement("a", { key, href: safe }, children);
    }
    case "image": {
      const src = node.url ?? "";
      const safe = (src.startsWith("/") && !src.startsWith("//")) || /^https?:\/\//i.test(src);
      return safe
        ? createElement("img", { key, src, alt: node.alt ?? "", loading: "lazy", decoding: "async" })
        : null;
    }
    case "code": {
      const code = node.value ?? "";
      const meta = node.meta ?? "";
      const isPlayground = node.lang === "html" && /(?:^|\s)playground(?:\s|$)/.test(meta);
      if (isPlayground) {
        const title = meta.match(/title=(?:"([^"]*)"|'([^']*)'|([^\s]+))/)?.slice(1).find(Boolean) ?? "코드 실습";
        const rawHeight = Number(meta.match(/(?:^|\s)height=(\d+)/)?.[1] ?? 400);
        const height = Number.isFinite(rawHeight) && rawHeight >= 180 && rawHeight <= 900 ? rawHeight : 400;
        return createElement(CodePlayground, { key, initialHtml: code, title, height });
      }
      return createElement("pre", { key }, createElement("code", { className: node.lang ? `language-${node.lang}` : undefined }, code));
    }
    case "table": {
      const rows = node.children ?? [];
      const [header, ...body] = rows;
      const renderRow = (row: MdNode, rowKey: number, cellTag: "th" | "td") =>
        createElement("tr", { key: rowKey }, row.children?.map((cell, index) =>
          createElement(cellTag, { key: index }, cell.children?.map((child, childIndex) => renderNode(child, childIndex))),
        ));

      return createElement("table", { key },
        header ? createElement("thead", { key: "head" }, renderRow(header, 0, "th")) : null,
        body.length ? createElement("tbody", { key: "body" }, body.map((row, index) => renderRow(row, index, "td"))) : null,
      );
    }
    case "tableHead": return createElement("thead", { key }, children);
    case "tableBody": return createElement("tbody", { key }, children);
    case "tableRow": return createElement("tr", { key }, children);
    case "tableCell": return createElement("td", { key }, children);
    case "thematicBreak": return createElement("hr", { key });
    case "html": return null;
    default: return children ? createElement(Fragment, { key }, children) : null;
  }
}

export function MarkdownContent({ nodes }: { nodes: MdNode[] }) {
  return <div className="markdown-body">{nodes.map((node, index) => renderNode(node, index))}</div>;
}
