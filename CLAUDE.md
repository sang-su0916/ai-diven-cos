# AI Cosmetics Innovation Journal - Project Guidelines

## Project Overview

A complete AI-powered journal platform for cosmetics innovation, connecting Obsidian vault to Git to Web publishing pipeline.

**Repository:** https://github.com/passeth/ai-diven_cos

## Tech Stack

### Frontend (Website)
- Pure HTML5, CSS3, JavaScript (ES6+)
- No framework dependencies
- Responsive design (mobile-first)
- Markdown to HTML conversion via marked.js

### Build System
- Node.js static site generator
- Image optimization (WebP conversion)
- RSS feed generation
- Sitemap generation

### Content Management
- Markdown files with YAML frontmatter
- Git-based version control
- Obsidian for writing environment
- Claude Code skills for automation

## Directory Structure

```
ai-diven_cos/
├── content/                    # Markdown content
│   ├── development/            # AI cosmetics R&D
│   ├── products/               # Product reviews
│   ├── ingredients/            # Ingredient science
│   ├── trends/                 # Industry trends
│   ├── tips/                   # Beauty tips
│   └── _assets/                # Images & media
├── site/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # HTML components
│   │   ├── styles/             # CSS files
│   │   ├── utils/              # JS utilities
│   │   └── pages/              # Page templates
│   ├── admin/                  # Admin dashboard
│   └── build/                  # Generated output
├── obsidian/
│   ├── .obsidian/              # Obsidian config
│   │   ├── plugins/
│   │   ├── templates/
│   │   └── snippets/
│   ├── skills/                 # Claude Code skills
│   └── commands/               # Custom commands
└── docs/
    ├── CLAUDE.md               # This file
    ├── YAML_SCHEMA.md          # Frontmatter spec
    └── PERSONAS.md             # Journalist personas
```

## Development Guidelines

### Code Style

**HTML:**
- Semantic elements (`<article>`, `<section>`, `<nav>`)
- Accessible markup (ARIA labels, alt text)
- Valid HTML5

**CSS:**
- Mobile-first breakpoints
- CSS custom properties for theming
- BEM-like naming: `.component-name__element--modifier`

**JavaScript:**
- ES6+ features (arrow functions, destructuring, modules)
- No jQuery or heavy libraries
- Vanilla JS only

### Commit Messages

Format: `type(scope): description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `content`: New article/content

Examples:
```
feat(site): add article pagination
fix(admin): resolve visibility toggle bug
docs(yaml): update schema examples
content(dev): add AI formulation article
```

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `content/*` - New articles

## Content Creation Workflow

### 1. Writing in Obsidian

1. Open Obsidian vault (`/obsidian/` folder)
2. Use template: `template-article.md`
3. Fill in YAML frontmatter
4. Write content in Markdown
5. Save to appropriate category folder

### 2. Image Management

1. Add images to `/content/_assets/images/`
2. Use WebP format when possible
3. Naming: `{date}-{slug}-{number}.webp`
4. Reference in markdown: `![Alt text](/assets/images/filename.webp)`

### 3. Publishing

1. Validate YAML with `yaml-validator` skill
2. Run `article-publisher` skill
3. Commit and push to Git
4. Site auto-rebuilds

## Build Process

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Build Steps

1. Scan `/content/` folders for `.md` files
2. Parse YAML frontmatter
3. Convert Markdown to HTML
4. Apply page templates
5. Optimize images
6. Generate RSS feed (`/feed.xml`)
7. Generate sitemap (`/sitemap.xml`)
8. Output to `/site/build/`

### Environment Variables

```
NODE_ENV=production|development
SITE_URL=https://your-domain.com
```

## Admin Dashboard

### Features

- Article visibility toggle (draft/published)
- Featured article management
- Homepage priority ordering
- Preview before publish
- Analytics overview

### Access

Local: `http://localhost:3000/admin`
Production: `https://your-domain.com/admin`

## Claude Code Skills

### Available Skills

| Skill | Purpose |
|-------|---------|
| `journalist-writer.md` | Generate articles in persona voice |
| `image-generator.md` | Create article images via NanoBanana |
| `article-publisher.md` | Validate and publish articles |
| `yaml-validator.md` | Check frontmatter completeness |
| `seo-optimizer.md` | Optimize meta descriptions |

### Usage

In Claude Code:
```
/journalist-writer persona=dr-sarah-kim topic="AI retinol formulation"
/article-publisher path=content/development/my-article.md
```

## Troubleshooting

### Common Issues

**Build fails:**
- Check all YAML frontmatter is valid
- Ensure no missing required fields
- Verify image paths exist

**Images not loading:**
- Check path spelling
- Ensure file is in `/_assets/images/`
- Verify WebP format is supported

**Admin not saving:**
- Check file permissions
- Verify Git is configured
- Ensure no merge conflicts

### Debug Mode

Enable verbose logging:
```bash
DEBUG=true npm run build
```

## Performance Targets

- Lighthouse score: > 90
- First Contentful Paint: < 1.5s
- Build time: < 30 seconds
- Image optimization: 80% compression

## Deployment

### GitHub Pages

```bash
npm run build
npm run deploy
```

### Manual

1. Run `npm run build`
2. Upload `/site/build/` to hosting
3. Configure domain/SSL

## Contact

**Project:** AI Cosmetics Innovation Journal
**Maintainer:** passeth
**Repository:** https://github.com/passeth/ai-diven_cos
