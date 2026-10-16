"use client";

import { useId, useState } from "react";

type Parts = { html: string; css: string; js: string; externalScripts: string[] };
type Language = keyof Parts;

const languages: { id: Language; label: string }[] = [
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "js", label: "JavaScript" },
];

function splitDocument(source: string): Parts {
  const dedent = (value: string) => {
    const lines = value.replace(/^\n+|\n+$/g, "").split("\n");
    const indents = lines.filter((line) => line.trim()).map((line) => line.match(/^\s*/)?.[0].length ?? 0);
    const indent = indents.length ? Math.min(...indents) : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
  };
  const css = [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)].map((match) => match[1]).join("\n\n");
  const js = [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)].map((match) => match[1]).join("\n\n");
  const externalScripts = [...source.matchAll(/<script\b(?=[^>]*\bsrc\s*=)[^>]*>\s*<\/script\s*>/gi)].map((match) => match[0]);
  const body = source.match(/<body\b[^>]*>([\s\S]*?)<\/body\s*>/i)?.[1] ?? source
    .replace(/<!doctype[^>]*>/gi, "")
    .replace(/<html\b[^>]*>|<\/html\s*>|<head\b[^>]*>[\s\S]*?<\/head\s*>/gi, "");
  return {
    html: dedent(body.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "")),
    css: dedent(css),
    js: dedent(js),
    externalScripts,
  };
}

function makeDocument(parts: Parts) {
  return `<!DOCTYPE html>\n<html lang="ko">\n<head>\n  <meta charset="UTF-8">\n${parts.externalScripts.map((script) => `  ${script}`).join("\n")}\n  <style>\n${parts.css}\n  </style>\n</head>\n<body>\n${parts.html}\n  <script>\n${parts.js}\n  </script>\n</body>\n</html>`;
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(code: string, language: Language) {
  const pattern = language === "html"
    ? /(<!--[\s\S]*?-->|<\/?[\w-]+|\s+[\w-]+(?==)|=|"[^"]*"|'[^']*'|\/?>)/g
    : language === "css"
      ? /(\/\*[\s\S]*?\*\/|"[^"]*"|'[^']*'|#[\w-]+|[\w-]+(?=\s*:)|[{}:;(),]|\b\d+(?:\.\d+)?(?:px|rem|%|vh|vw)?\b)/g
      : /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|if|else|for|of|new|true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b)/g;
  const classes = language === "html"
    ? [/^&lt;!--/, /^&lt;\/?[\w-]+/, /^\s+[\w-]+/, /^=/, /^['&quot;]/, /^\/?&gt;/]
    : language === "css"
      ? [/^\/\*/, /^['&quot;]/, /^#[\w-]+/, /^[\w-]+(?=\s*:)/, /^[{}:;(),]/, /^\d/]
      : [/^\/\//, /^\/\*/, /^['&quot;`]/, /^\b(?:const|let|var|function|return|if|else|for|of|new|true|false|null|undefined)\b/, /^\d/];
  return code.split(pattern).map((part) => {
    const type = classes.findIndex((regex) => regex.test(escapeHtml(part)));
    const escaped = escapeHtml(part);
    return type < 0 ? escaped : `<span class="token-${type}">${escaped}</span>`;
  }).join("");
}

function CodeEditor({ language, value, onChange, id }: { language: Language; value: string; onChange: (value: string) => void; id: string }) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  return <div className={`playground-editor-wrap language-${language}`}>
    <div aria-hidden="true" className="playground-highlight" style={{ transform: `translate(${-scrollLeft}px, ${-scrollTop}px)` }} dangerouslySetInnerHTML={{ __html: `${highlight(value, language)}\n` }} />
    <textarea
      id={id}
      className="playground-editor"
      aria-label={`${language.toUpperCase()} 코드 편집`}
      spellCheck={false}
      autoCapitalize="off"
      autoComplete="off"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onScroll={(event) => { setScrollTop(event.currentTarget.scrollTop); setScrollLeft(event.currentTarget.scrollLeft); }}
    />
  </div>;
}

export function CodePlayground({ initialHtml, title, height }: { initialHtml: string; title: string; height: number }) {
  const id = useId();
  const [initialParts] = useState(() => splitDocument(initialHtml));
  const [parts, setParts] = useState(initialParts);
  const [activeLanguage, setActiveLanguage] = useState<Language>("html");
  const [preview, setPreview] = useState(initialHtml);
  const [previewKey, setPreviewKey] = useState(0);
  const run = () => {
    setPreview(makeDocument(parts));
    setPreviewKey((key) => key + 1);
  };
  const reset = () => {
    setParts(initialParts);
    setPreview(initialHtml);
    setPreviewKey((key) => key + 1);
  };
  const updatePart = (language: Language, value: string) => setParts((current) => ({ ...current, [language]: value }));

  return <section className="code-playground" aria-label={`${title} 코드 실습`}>
    <div className="playground-heading">{title}</div>
    <div className="playground-grid">
      <div className="playground-source">
        <div className="playground-tabs" role="tablist" aria-label="코드 언어 선택">
          {languages.map(({ id: language, label }) => <button
            key={language}
            id={`${id}-${language}-tab`}
            className={`playground-tab ${activeLanguage === language ? "is-active" : ""} language-${language}`}
            type="button"
            role="tab"
            aria-selected={activeLanguage === language}
            aria-controls={`${id}-${language}-panel`}
            onClick={() => setActiveLanguage(language)}
          >{label}</button>)}
          <span className="playground-source-note">편집 후 실행을 눌러 결과를 확인하세요</span>
        </div>
        {languages.map(({ id: language }) => <div
          key={language}
          id={`${id}-${language}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-${language}-tab`}
          hidden={activeLanguage !== language}
        >
          <CodeEditor language={language} value={parts[language]} onChange={(value) => updatePart(language, value)} id={`${id}-${language}-editor`} />
        </div>)}
      </div>
      <iframe key={previewKey} className="playground-preview" title={`${title} 실행 결과`} sandbox="allow-scripts" srcDoc={preview} style={{ height }} />
    </div>
    <div className="playground-actions">
      <button className="button button-primary" type="button" onClick={run}>▶ 실행</button>
      <button className="button button-secondary" type="button" onClick={reset}>↺ 초기화</button>
    </div>
  </section>;
}
