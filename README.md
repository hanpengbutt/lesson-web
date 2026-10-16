# 교안 보관함

Next.js App Router로 만든 코딩 수업 교안 웹앱입니다. 교안은 `lessons/`의 Markdown 파일로 관리하고, 웹 화면에서는 수업 섹션과 코드 실습에 맞는 UI로 보여 줍니다.

## 개발

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 과정 목록을 볼 수 있습니다.

## 교안 추가

- 새 과정은 `lessons/{course-slug}/plan.md`를 만듭니다.
- 주차 교안은 `lessons/{course-slug}/lesson-03.md`처럼 추가합니다. URL 주차 번호는 두 자리로 정규화됩니다.
- 과정 페이지는 `/lessons/{course-slug}`, 교안 페이지는 `/lessons/{course-slug}/03` 형식입니다.
- 교안의 `##` 제목은 페이지 섹션과 자동 목차 항목이 됩니다. 알 수 없는 제목도 기본 본문 섹션으로 유지됩니다.
- `## 교사용 메모` 아래 내용은 학생 화면 응답에서 제외됩니다. 교사용 정답도 이 섹션 아래 둡니다.
- 전체 HTML 실습 코드는 ```` ```html playground title="실습 제목" height=450 ```` 펜스로 작성합니다. 나머지 코드 블록은 읽기 전용입니다.

디자인 및 교안 저작 규칙은 [`DESIGN.md`](./DESIGN.md)와 [`AGENTS.md`](./AGENTS.md)를 참고하세요.

## 배포

Vercel에서 이 프로젝트를 Next.js 프로젝트로 가져오면 기본 설정으로 빌드됩니다. 콘텐츠 경로는 빌드 때 정적 페이지로 생성됩니다. 새 교안을 추가한 뒤 다시 배포하면 공개됩니다.

```bash
npm run lint
npm run build
```

교안 앱은 Vercel 배포를 목표로 합니다. 학생이 수업에서 만드는 별도 게임의 배포 서비스는 과정별로 정하며, 이 앱은 게임 배포를 자동화하지 않습니다.
