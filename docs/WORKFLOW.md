# AI Cosmetics Journal - 워크플로우 가이드

## 📁 폴더 구조

```
ai-diven_cos/ (Obsidian Vault)
│
├── CLAUDE.md                  # Claude Code 프로젝트 가이드
├── README.md                  # GitHub 프로젝트 소개
│
├── .obsidian/                 # Obsidian 설정 (Git 제외)
│   ├── plugins/               # 커뮤니티 플러그인
│   ├── snippets/              # CSS 스니펫
│   ├── themes/                # 테마
│   └── templates/             # 글 템플릿
│
├── .claude/                   # Claude Code 에이전트
│   ├── settings.local.json    # MCP 설정
│   ├── commands/              # 커스텀 슬래시 명령
│   └── skills/                # AI 스킬 정의
│
├── content/                   # 📝 아티클 콘텐츠
│   ├── development/           # AI 개발 프로세스
│   ├── products/              # 제품 리뷰
│   ├── ingredients/           # 성분 과학
│   ├── trends/                # 트렌드 분석
│   ├── tips/                  # 뷰티 팁
│   ├── videos/                # 영상 노트
│   └── _assets/
│       ├── images/            # 아티클 이미지
│       └── personas/          # 저널리스트 아바타
│
├── site/                      # 🔧 웹 빌드 (Obsidian에서 숨김)
│   ├── src/                   # 빌드 스크립트
│   ├── public/                # 정적 파일 (CSS, JS)
│   ├── admin/                 # 관리자 대시보드
│   └── build/                 # 빌드 출력
│
├── docs/                      # 📚 시스템 문서
│   ├── PERSONAS.md            # 저널리스트 페르소나
│   ├── YAML_SCHEMA.md         # 프론트매터 스키마
│   └── WORKFLOW.md            # 이 문서
│
└── node_modules/              # npm 패키지 (Git 제외)
```

---

## ✍️ 글 작성 워크플로우

### 1. 새 글 생성

**Obsidian에서:**
1. `content/[카테고리]/` 폴더에서 새 노트 생성
2. 파일명: `YYYY-MM-DD-slug-name.md`
3. 템플릿 적용 (Ctrl/Cmd + T)

**또는 Claude Code에서:**
```
새 글 작성해줘. 카테고리: ingredients, 주제: 히알루론산 가이드
```

### 2. 프론트매터 작성

```yaml
---
title: "글 제목"
slug: "url-friendly-slug"
journalist: "dr-sarah-kim"    # 페르소나 선택
category: "ingredients"        # 카테고리
tags: ["hyaluronic-acid", "hydration"]
date: "2025-01-16"
excerpt: "간단한 요약 (1-2문장)"
status: "published"            # draft 또는 published
featured: false
reading_time: "5 min"
featured_image: "filename.webp"  # 선택사항
---
```

### 3. 본문 작성

- 마크다운 문법 사용
- 이미지: `![[filename.webp]]` (Obsidian 문법)
- 빌드 시 자동 변환됨

### 4. 이미지 추가

1. 이미지를 `content/_assets/images/`에 저장
2. 본문에서 참조: `![[image-name.webp]]`
3. 또는 프론트매터에 썸네일 지정: `featured_image: "image-name.webp"`

**권장 형식:** WebP (압축률 좋음)
**권장 크기:** 1200x800px 이하

---

## 🚀 배포 워크플로우

### 로컬 테스트

```bash
cd ai-diven_cos
npm run build    # 빌드
npm run dev      # 개발 서버 (localhost:3000)
```

### 배포 (자동)

```bash
git add .
git commit -m "Add new article: 글 제목"
git push
```

→ Vercel이 자동으로 빌드 & 배포

### 배포 URL

- **Production:** https://your-site.vercel.app
- **GitHub:** https://github.com/passeth/ai-diven_cos

---

## 📂 카테고리 관리

### 기존 카테고리

| 카테고리 | 설명 | 색상 |
|----------|------|------|
| development | AI 화장품 R&D 프로세스 | #6366f1 |
| products | 제품 정보 & 리뷰 | #ec4899 |
| ingredients | 성분 과학 & 포뮬레이션 | #10b981 |
| trends | 산업 트렌드 & 리서치 | #f59e0b |
| tips | 뷰티 팁 & 사용 가이드 | #8b5cf6 |
| videos | 영상 노트 & 학습 자료 | #ef4444 |

### 새 카테고리 추가

1. `content/` 아래에 새 폴더 생성
2. 빌드 시 자동 인식 (폴더 스캔 방식)
3. 카테고리 메타데이터 커스텀: `site/src/build.js`의 `CATEGORIES` 수정

---

## 👤 페르소나 (저널리스트)

| ID | 이름 | 역할 | 전문 분야 |
|----|------|------|----------|
| dr-sarah-kim | Dr. Sarah Kim | R&D Scientist | 포뮬레이션 과학 |
| dr-james-park | Dr. James Park | Clinical Research Director | 임상 연구 |
| dr-emily-chen | Dr. Emily Chen | Biotechnology Lead | AI 바이오테크 |
| yuna-lee | Yuna Lee | Beauty Editor | 제품 리뷰 |
| alex-thompson | Alex Thompson | Trend Analyst | 시장 분석 |
| minji-kang | Min-ji Kang | Lifestyle Writer | 라이프스타일 |
| dr-david-rodriguez | Dr. David Rodriguez | Sustainability Officer | 지속가능성 |

자세한 내용: `docs/PERSONAS.md`

---

## 🔧 유지관리

### 정기 작업

| 주기 | 작업 |
|------|------|
| 글 작성 시 | 이미지 최적화 (WebP 변환) |
| 주간 | 불필요한 이미지 정리 |
| 월간 | npm 패키지 업데이트 |

### Obsidian 설정

**숨김 처리된 폴더:**
- `site/` - 빌드 관련
- `node_modules/` - npm 패키지
- `.git/` - Git 히스토리

설정 위치: `.obsidian/app.json`

### 문제 해결

**빌드 실패 시:**
```bash
npm run build 2>&1 | head -50  # 에러 확인
```

**이미지 안 보일 때:**
1. 파일명 확인 (공백, 특수문자 X)
2. 경로 확인: `content/_assets/images/`
3. 프론트매터 `featured_image` 확인

**Obsidian에서 폴더 안 보일 때:**
`.obsidian/app.json`의 `userIgnoreFilters` 확인

---

## 🎨 Obsidian 커스텀

### 플러그인 추천

- **Templater** - 고급 템플릿
- **Dataview** - 글 목록 쿼리
- **Kanban** - 글 진행 상태 관리
- **Excalidraw** - 다이어그램 작성

### 스니펫 추가

1. `.obsidian/snippets/`에 CSS 파일 생성
2. Obsidian 설정 → 외관 → CSS 스니펫 활성화

---

## 📝 Claude Code 활용

### 글 작성

```
ingredients 카테고리로 "레티놀 완벽 가이드" 글 작성해줘.
저널리스트는 dr-sarah-kim으로.
```

### 이미지 생성 (향후)

```
이 글에 맞는 히어로 이미지 생성해줘.
```

### 빌드 & 배포

```
빌드하고 푸시해줘.
```

---

## 📚 관련 문서

- [CLAUDE.md](../CLAUDE.md) - Claude Code 프로젝트 가이드
- [PERSONAS.md](./PERSONAS.md) - 저널리스트 페르소나 상세
- [YAML_SCHEMA.md](./YAML_SCHEMA.md) - 프론트매터 스키마
- [README.md](../README.md) - 프로젝트 소개

---

**Last Updated:** 2025-01-16
