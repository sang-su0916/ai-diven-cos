# AI Cosmetics Innovation Journal

A complete AI-powered journal platform for cosmetics innovation, connecting Obsidian vault → Git → Web publishing pipeline.

## 💡 Zero-Cost CMS Architecture

This project demonstrates a modern **serverless CMS** that costs $0/month to operate.

```
┌─────────────────────────────────────────────────────────────┐
│                      WORKFLOW                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Obsidian            Claude Code           Vercel           │
│   ┌─────────┐         ┌───────────┐        ┌─────────┐      │
│   │ Write   │         │  Build    │        │ Deploy  │      │
│   │ Edit    │ ──────▶ │  Automate │ ─────▶ │ Host    │      │
│   │ Images  │ GitHub  │  Enhance  │  Auto  │ SSL     │      │
│   └─────────┘  Sync   └───────────┘        └─────────┘      │
│       ▲                                                      │
│       │ Obsidian Plugins                                     │
│       ├─ GitHub Sync (one-click deploy)                      │
│       ├─ Paste Image Rename (auto image naming)              │
│       ├─ Templater (article templates)                       │
│       └─ Linter (YAML formatting)                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Why This Stack?

| Feature | Traditional CMS | This System |
|---------|-----------------|-------------|
| Hosting Cost | $10~50/month | **Free** (Vercel) |
| Database | MySQL/PostgreSQL | **Git** (free, versioned) |
| Backup | Manual setup | **Automatic** (Git history) |
| Editor | Web-based only | **Obsidian** (offline capable) |
| Version Control | Limited or none | **Full Git history** |
| Deployment | Manual/complex | **Push = Auto deploy** |
| AI Integration | None | **Claude Code built-in** |
| Admin Panel | Separate system | **Obsidian IS the admin** |

### Key Benefits

- **Obsidian as Admin Panel**: Write, edit, and manage content locally with full Markdown support
- **GitHub as Database**: Free storage, automatic versioning, collaboration-ready
- **Vercel as Host**: Automatic SSL, CDN, zero-config deployment
- **Claude Code as Developer**: Build features, fix bugs, generate content on demand

## 🧪 Overview

This project is a static site generator for a cosmetics innovation journal, featuring:

- **7 AI journalist personas** with distinct writing styles
- **5 content categories**: Development, Products, Ingredients, Trends, Tips
- **Full admin dashboard** for content management
- **Obsidian integration** with Claude Code skills
- **SEO-optimized** static HTML output

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/passeth/ai-diven_cos.git
cd ai-diven_cos

# Install dependencies
npm install

# Build the site
npm run build

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
ai-diven_cos/                   # Root = Obsidian Vault
├── content/                    # Markdown articles
│   ├── development/            # AI cosmetics R&D
│   ├── products/               # Product reviews
│   ├── ingredients/            # Ingredient science
│   ├── trends/                 # Industry trends
│   ├── tips/                   # Beauty tips
│   ├── videos/                 # YouTube embeds + notes
│   └── _assets/images/         # Article images
├── site/
│   ├── public/                 # Static assets (CSS, JS)
│   ├── src/                    # Build scripts & templates
│   └── build/                  # Generated output (deploy this)
├── .obsidian/                  # Obsidian settings & plugins
├── .claude/skills/             # Claude Code skills
├── docs/                       # Documentation
├── Home.md                     # Obsidian homepage
└── CLAUDE.md                   # Project guidelines for Claude
```

## ✍️ Creating Content

### 1. Using Templates

Templates are located in `.obsidian/templates/`:

- `template-article.md` - Standard article
- `template-product-review.md` - Product review
- `template-research.md` - Scientific article
- `template-tutorial.md` - How-to guide

### 2. YAML Frontmatter

Every article requires valid frontmatter:

```yaml
---
title: "Article Title"
slug: "url-friendly-slug"
journalist: "dr-sarah-kim"
category: "ingredients"
tags: ["tag1", "tag2"]
date: "2025-01-15"
excerpt: "Brief summary"
status: "published"
featured: false
homepage_priority: 5
reading_time: "5 min"
---
```

See [docs/YAML_SCHEMA.md](docs/YAML_SCHEMA.md) for complete schema.

### 3. Journalist Personas

Choose from 7 personas, each with a unique voice:

| Persona | Expertise | Style |
|---------|-----------|-------|
| Dr. Sarah Kim | Formulation science | Scientific yet accessible |
| Dr. James Park | Clinical research | Evidence-based |
| Dr. Emily Chen | Biotechnology | Tech-forward |
| Yuna Lee | Product reviews | Conversational |
| Alex Thompson | Market trends | Analytical |
| Min-ji Kang | Lifestyle | Elegant, mindful |
| Dr. David Rodriguez | Sustainability | Action-oriented |

See [docs/PERSONAS.md](docs/PERSONAS.md) for full details.

## 🔧 Claude Code Skills

Located in `.claude/skills/`:

| Skill | Purpose |
|-------|---------|
| `journalist-writer.md` | Generate articles in persona voice |
| `image-generator.md` | Create article images |
| `article-publisher.md` | Validate and publish articles |
| `yaml-validator.md` | Check frontmatter validity |
| `seo-optimizer.md` | Optimize for search engines |

## 🎛️ Admin Dashboard

Access at `http://localhost:3000/admin/` to:

- Toggle article visibility (draft/published)
- Manage featured articles
- Set homepage priority order
- Preview articles before publishing

## 📦 Build Process

The build script (`site/src/build.js`) performs:

1. Scans `/content/` for markdown files
2. Parses YAML frontmatter
3. Converts Markdown → HTML via marked.js
4. Generates:
   - Homepage
   - Article pages
   - Category pages
   - Journalist pages
   - RSS feed
   - Sitemap

## 🚢 Deployment

### Vercel (Recommended)

This project is configured for **automatic Vercel deployment**:

1. Push to GitHub → Vercel builds automatically
2. Preview deployments for every branch
3. Production deployment on `master` branch

### From Obsidian (One-Click)

With **GitHub Sync** plugin installed:
1. Click the sync icon in Obsidian ribbon
2. Done! Vercel deploys automatically

### Manual

1. Run `npm run build`
2. Upload `site/build/` contents to your hosting
3. Configure domain/SSL

## 🔌 Recommended Obsidian Plugins

| Plugin | Purpose |
|--------|---------|
| **GitHub Sync** | One-click push to GitHub → auto deploy |
| **Paste Image Rename** | Auto-name images: `{filename}_{date}_{n}.png` |
| **Templater** | Article templates with dynamic fields |
| **Linter** | Auto-format YAML frontmatter |
| **Homepage** | Set a default note on vault open |

### Plugin Setup Tips

- **GitHub Sync**: Just add your repo URL in settings
- **Paste Image Rename**: Pattern: `{{fileName}}_{{DATE:YYYYMMDD}}_{{NNNNN}}`
- **Images folder**: `content/_assets/images/`

## 📝 Documentation

- [CLAUDE.md](CLAUDE.md) - Project guidelines for Claude Code
- [WORKFLOW.md](docs/WORKFLOW.md) - Content creation workflow
- [YAML_SCHEMA.md](docs/YAML_SCHEMA.md) - Frontmatter specification
- [PERSONAS.md](docs/PERSONAS.md) - Journalist personas

## 🔗 Links

- **Repository**: https://github.com/passeth/ai-diven_cos
- **Live Site**: Deployed via Vercel
- **Documentation**: `/docs/`

## 📄 License

MIT License - see LICENSE file for details.

---

Built with Obsidian + Claude Code + Vercel | Zero infrastructure cost
