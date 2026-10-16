# 코딩 학원 교안 제작 원칙

이 저장소는 하나의 Next.js 앱에서 여러 수업 교안을 제공하기 위한 프로젝트다. 과정은 `lessons/{courseSlug}/`에 두고 과정 페이지는 `/lessons/{courseSlug}`, 주차별 교안 페이지는 `/lessons/{courseSlug}/{number}` 주소로 제공한다. 예를 들어 `lesson-02.md`는 `/lessons/matterjs-game/02`로 열린다. 교안 앱 자체는 Vercel 배포를 목표로 한다. 학생이 수업에서 만드는 별도 프로젝트의 배포처는 과정별로 선택하며, 미정일 수 있다.

## 교안 제작 시작

- 새 교안을 만들기 전에 `lessons/_template/plan.md`를 복사해 대상 학생과 수업 계획을 작성한다.
- 주차별 수업을 만들 때는 `lessons/_template/lesson.md`를 복사한다.
- 학생의 나이 또는 학년, 이미 배운 내용, 수업 환경과 주제를 바탕으로 목표와 난이도를 정한다. 정보가 빠져 있으면 임의로 단정하지 말고 확인하거나, 명시적인 가정을 기록한다.
- 최종 목표는 수업이 끝났을 때 학생이 직접 만들거나 설명할 수 있는 행동으로 쓴다.
- 주차별 내용은 최종 목표를 향해 순서대로 쌓이도록 구성하고, 각 주차에서 다루지 않을 내용도 필요하면 분명히 한다.

## 매 수업의 공통 구성

- 학생이 오늘 배울 내용을 한눈에 알 수 있도록 학습 목표를 제시한다.
- 해당 내용을 왜 배우는지, 앞서 배운 내용 및 앞으로의 목표와 어떻게 이어지는지 설명한다.
- 핵심 개념은 학생의 연령과 선수 지식에 맞는 말과 예시로 설명한다. 전문 용어는 필요할 때 풀어서 소개한다.
- 코드 실습에는 실행 가능한 예제, 실행 방법, 예상 결과, 결과를 확인할 포인트를 포함한다. 실제 실행 환경이 정해지지 않았다면 실행 방법은 가정으로 표시한다.
- 미션은 실습 예제를 그대로 따라 쓰는 데 그치지 않도록 조건이나 선택지를 바꾼다. 학생이 스스로 생각해 작성할 수 있게 요구사항과 완료 조건을 제시하고, 정답 코드는 교사용 자료로 분리하거나 단계별 힌트 뒤에 둔다.
- 수업 분량에 맞춰 도입, 설명, 실습, 미션, 정리를 배치한다. 모든 수업을 불필요하게 같은 길이로 맞추지 않는다.
- 핵심 개념은 설명에 앞서 학생이 바로 와닿도록 **한 줄 정의**와 필요하면 **짧은 식**을 인용 블록(`> **정의:** ...`)으로 먼저 제시한다.

## 실행형 코드 (playground)

교안 안에서 학생이 ▶ 실행 버튼으로 코드를 바로 실행하고 수정할 수 있다. 아래 문법을 지키면 웹 앱에서 편집·실행·초기화 카드로 표시된다. 학생 컴퓨터에서도 실행할 수 있도록 Live Server 등 대체 방법을 함께 안내한다.

- 코드 블록의 언어 뒤에 `playground`를 붙인다. 예: ```` ```html playground title="1단계: 공 떨어뜨리기" height=450 ````
  - `title`: 카드 제목(선택). `height`: 결과 화면 높이 px(선택, 기본 400).
- 한 블록은 그 자체로 실행되는 **완결된 HTML 한 파일**(`<!DOCTYPE html>`부터 `</html>`까지, CSS/JS 포함)이어야 한다. 일부만 보여 주는 조각 코드는 `playground` 없이 일반 코드 블록(`js` 등)으로 쓴다.
- 단계별 실습은 단계마다 완결된 블록을 따로 만들고, 앞 단계에서 바뀐 부분은 `// ★` 주석으로 표시한다.
- 외부 라이브러리는 버전을 고정한 CDN `<script>`로 불러온다. 예: Matter.js `https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js`. 설치나 번들러가 필요한 코드는 playground로 만들지 않는다.
- 서버(Flask 등)나 DB가 필요한 코드, 키·비밀번호가 필요한 코드는 playground로 만들지 않고 일반 코드 블록과 로컬 실행 방법으로 안내한다.
- 학생용 교안에만 쓴다. 정답 코드를 playground로 만들 때는 교사용 메모 안에 둔다.
- 오프라인 대비와 학생이 자기 컴퓨터에서 해 보는 경우를 위해 실행 방법에 Live Server 등 로컬 실행 방법을 선택 항목으로 함께 적는다.

## 디자인 일관성

- 모든 교안의 화면 디자인(색상, 글꼴, 모서리, 카드, 버튼, 교안 요소별 스타일)은 루트의 `DESIGN.md`를 기준으로 한다.
- 교안마다 색·글꼴을 따로 정하지 않는다. 디자인을 바꾸고 싶으면 `DESIGN.md`를 먼저 수정한다.
- 마크다운 교안에서는 정해진 문법(정의 박스 `> **정의:**`, `playground` 블록, 미션 절 등)을 지켜 앱이 `DESIGN.md`의 스타일을 입힐 수 있게 한다.

## 교과 과정 및 생활 맥락


- 학교 교과 과정, 다른 과목, 학생의 생활 경험과 연결하면 이해에 도움이 되는 경우에만 선택적으로 포함한다.
- 연결 내용은 실제 수업 목표와 관련이 있어야 한다. 단지 나이나 학년에 맞춘 것처럼 보이게 하려고 억지로 끼워 넣지 않는다.
- 관련성이 없거나 확인할 정보가 부족하면 해당 부분을 생략하거나 확인이 필요하다고 표시한다.

## 콘텐츠와 경로

- 교안 폴더명은 URL에 사용할 수 있는 짧고 안정적인 slug로 정하고, 공백 대신 소문자와 하이픈을 사용한다. 예: `javascript-basics`.
- 하나의 Next.js 앱에서 `/lessons/[courseSlug]`와 `/lessons/[courseSlug]/[number]` 동적 경로를 사용한다. 새 과정마다 별도 앱이나 별도 배포를 만들 필요는 없다.
- 앱은 `lessons/`의 과정 디렉터리와 `lesson-{number}.md` 파일을 빌드 때 색인한다. 번호는 URL에서 두 자리로 정규화한다. 같은 번호로 정규화되는 파일을 한 과정에 중복으로 두지 않는다.
- 교안 화면은 Markdown 원문을 그대로 출력하지 않는다. `##` 제목은 섹션과 목차 항목이 되고, 본문 문법은 학습 UI로 렌더링한다. 앱에 정의되지 않은 섹션도 기본 본문으로 유지한다.
- 학생 화면의 교사용 메모·정답 섹션은 Markdown AST에서 제거한 뒤 응답을 만든다. 과정 공개 페이지에는 계획 파일에서 제목, 주제, 최종 목표, 주차별 학습 흐름만 표시한다.
- 템플릿에 없는 구성이 수업 목표에 더 적합하면 추가해도 된다. 다만 공통 학습 목표, 학습 이유, 실행 결과를 확인하는 실습, 학생 미션은 유지한다.
- 학생에게 보여줄 내용과 교사용 메모·정답은 명확히 구분한다.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
