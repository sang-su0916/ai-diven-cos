# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

L-BIZ PARTNERS 블로그 - Obsidian → GitHub → Vercel 자동 배포 시스템. 마크다운 콘텐츠를 정적 HTML 사이트로 변환하는 제로 비용 CMS.

**Live Site:** https://ai-diven-cos.vercel.app

## Essential Commands

```bash
# 빌드
npm run build           # 정적 사이트 생성 (site/build/)

# 개발 서버
npm run dev             # localhost:3000에서 로컬 서버 실행

# 배포
npm run deploy          # gh-pages로 배포 (GitHub Pages용)
git push origin master  # Vercel 자동 배포 (권장)

# 빌드 초기화
npm run clean           # site/build/ 폴더 삭제
```

## Architecture

### Build Pipeline

```
content/**/*.md (Obsidian 마크다운)
    ↓ gray-matter (YAML frontmatter 파싱)
    ↓ marked.js (Markdown → HTML)
    ↓ site/src/build.js (템플릿 적용)
    ↓
site/build/ (정적 HTML/CSS/JS)
    ↓ git push
    ↓
Vercel (자동 배포)
```

### Key Files

| 파일 | 역할 |
|------|------|
| `site/src/build.js` | 정적 사이트 생성기 메인 로직. PERSONAS, CATEGORIES 정의 포함 |
| `site/src/pages/*.html` | HTML 템플릿 (index, article, category, tag, journalist) |
| `site/public/styles/main.css` | Neo Brutalism 디자인 시스템 (네이비/골드 테마) |
| `auto-deploy.sh` | Obsidian 볼트 감시 → 자동 동기화 → git push 스크립트 |
| `vercel.json` | Vercel 배포 설정 (outputDirectory: site/build) |

### Content Structure

```
content/
├── posts/          # 블로그 글
├── _assets/
│   └── images/     # 이미지 파일 (WebP 권장)
└── [category]/     # 카테고리별 폴더 (자동 감지)
```

### YAML Frontmatter (필수 필드)

```yaml
---
title: "글 제목"
slug: "url-slug"
journalist: "sangsu-lee"    # PERSONAS 키와 매칭
category: "posts"           # CATEGORIES 키와 매칭
date: "2025-01-17"
excerpt: "요약"
status: "published"         # published만 빌드에 포함
---
```

## Customization Points

### 페르소나 추가/수정
`site/src/build.js`의 PERSONAS 객체:
```javascript
const PERSONAS = {
  'sangsu-lee': { name: '이상수', role: '...', avatar: '...', bio: '...' }
};
```

### 카테고리 추가/수정
`site/src/build.js`의 CATEGORIES 객체:
```javascript
const CATEGORIES = {
  posts: { name: '블로그', description: '...', color: '#2563eb' },
  corporation: { name: '법인설립', description: '...', color: '#1e40af' }
};
```

### 테마 색상
`site/public/styles/main.css`의 CSS 변수:
```css
:root {
  --color-primary: #1e3a5f;        /* 네이비 */
  --color-secondary: #c9a227;      /* 골드 */
  --color-accent-gold: #c9a227;
}
```

## Auto-Deploy Workflow

Obsidian 볼트의 `Web-Content` 폴더를 감시하여 자동 배포:

```bash
# 자동 배포 시작 (터미널에서 실행)
./auto-deploy.sh

# 감시 중단: Ctrl+C
```

동작: `Web-Content/` 변경 → `content/`로 rsync → git commit → git push → Vercel 자동 빌드

## Obsidian Integration

### 이미지 링크 변환
Obsidian 형식 `![[path/to/image.webp]]` → HTML `<img src="/assets/images/image.webp">` 자동 변환

### 권장 Obsidian 플러그인
- GitHub Sync: 원클릭 푸시
- Paste Image Rename: `{filename}_{date}_{n}.png` 형식
- Templater: 글 템플릿
- Linter: YAML 포맷팅

## Build Output

`npm run build` 실행 시 생성되는 파일:
- `index.html` - 홈페이지
- `articles/{slug}.html` - 개별 글 페이지
- `category/{name}.html` - 카테고리 페이지
- `journalist/{slug}.html` - 저자 페이지
- `tag/{name}.html` - 태그 페이지
- `feed.xml` - RSS 피드
- `sitemap.xml` - 사이트맵
