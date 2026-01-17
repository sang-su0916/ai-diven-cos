/**
 * AI Cosmetics Journal - Static Site Generator
 * Converts markdown content to static HTML website
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const matter = require('gray-matter');

// Configuration
const CONFIG = {
  contentDir: path.join(__dirname, '../../content'),
  outputDir: path.join(__dirname, '../build'),
  templatesDir: path.join(__dirname, 'pages'),
  publicDir: path.join(__dirname, '../public'),
  siteUrl: process.env.SITE_URL || 'https://passeth.github.io/ai-diven_cos',
  siteName: 'L-BIZ PARTNERS 블로그',
  categories: [] // Will be populated by scanCategories()
};

/**
 * Scan content directory for category folders
 * Excludes folders starting with '_' (e.g., _assets)
 */
function scanCategories() {
  const contentDir = CONFIG.contentDir;
  if (!fs.existsSync(contentDir)) return [];
  
  return fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_'))
    .map(dirent => dirent.name);
}

// Initialize categories from folder scan
CONFIG.categories = scanCategories();

// Persona data
const PERSONAS = {
  'sangsu-lee': {
    name: '이상수',
    role: '경영자문 전문가 · AI 강사 · AI 융합 창업가',
    avatar: '/assets/personas/sangsu-lee.png',
    bio: '엘비즈파트너스 대표. 「잘되는 회사는 분명 특별한 이유가 있다」 「경영컨설팅은 끝났다!」 저자. 법인 설립/전환 컨설팅 전문. sangsu0916@naver.com'
  }
};

// Category metadata (known categories)
const CATEGORIES = {
  posts: { name: '블로그', description: 'AI 비즈니스 인사이트 & 가이드', color: '#2563eb' },
  'corporation': { name: '법인설립', description: '법인 설립 및 전환 컨설팅', color: '#1e40af' },
  'tax': { name: '세무', description: '세무 관리 및 절세 전략', color: '#059669' },
  'labor': { name: '노무', description: '노무 관리 및 인사 자문', color: '#7c3aed' },
  'finance': { name: '재무', description: '재무 관리 및 자금 조달', color: '#dc2626' },
  'education': { name: '교육', description: 'AI 및 경영 교육 프로그램', color: '#f59e0b' },
  'ai-tools': { name: 'AI 도구', description: 'AI 도구 활용 가이드', color: '#0891b2' }
};

// Default colors for auto-discovered categories
const DEFAULT_COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316'];

/**
 * Get category metadata (returns defaults for unknown categories)
 */
function getCategoryMeta(categorySlug) {
  if (CATEGORIES[categorySlug]) {
    return CATEGORIES[categorySlug];
  }
  // Generate default metadata for new categories
  const colorIndex = CONFIG.categories.indexOf(categorySlug) % DEFAULT_COLORS.length;
  return {
    name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' '),
    description: `Articles about ${categorySlug.replace(/-/g, ' ')}`,
    color: DEFAULT_COLORS[colorIndex]
  };
}

/**
 * Convert Obsidian-style image links to HTML
 * ![[@ONGOING_NEW/ai-diven_cos/content/_assets/images/file.webp]] -> <img src="/assets/images/file.webp">
 */
function convertObsidianImages(markdown) {
  // Pattern: ![[path/to/image.ext]] - handles full Obsidian vault paths
  return markdown.replace(/!\[\[@?([^\]]+\.(jpg|jpeg|png|gif|webp|svg))\]\]/gi, (match, filepath) => {
    // Extract just the filename from full path
    const filename = filepath.split('/').pop();
    const altText = filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    return `<img src="/assets/images/${filename}" alt="${altText}" class="article-image">`;
  });
}

/**
 * Read all markdown files from content directory
 */
function getArticles() {
  const articles = [];
  
  for (const category of CONFIG.categories) {
    const categoryDir = path.join(CONFIG.contentDir, category);
    
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
      continue;
    }
    
    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filePath = path.join(categoryDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content: markdown } = matter(content);
      
      if (frontmatter.status === 'published') {
        // Convert Obsidian image links before markdown processing
        const processedMarkdown = convertObsidianImages(markdown);
        articles.push({
          ...frontmatter,
          content: marked(processedMarkdown),
          markdown: processedMarkdown,
          rawContent: markdown,  // Original markdown for image detection
          filePath,
          category,
          persona: PERSONAS[frontmatter.journalist] || PERSONAS['sangsu-lee']
        });
      }
    }
  }
  
  // Sort by date (newest first), then by priority
  articles.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    if (a.homepage_priority !== b.homepage_priority) {
      return (a.homepage_priority || 5) - (b.homepage_priority || 5);
    }
    return new Date(b.date) - new Date(a.date);
  });
  
  return articles;
}

/**
 * Generate HTML from template
 */
function renderTemplate(templateName, data) {
  const templatePath = path.join(CONFIG.templatesDir, `${templateName}.html`);
  
  if (!fs.existsSync(templatePath)) {
    console.warn(`Template not found: ${templateName}`);
    return '';
  }
  
  let html = fs.readFileSync(templatePath, 'utf-8');
  
  // Simple template variable replacement
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    html = html.replace(regex, value || '');
  }
  
  return html;
}

/**
 * Get image path with fallback to first image in content, then placeholder
 */
function getImagePath(article) {
  // 1. Use featured_image from YAML if exists
  if (article.featured_image) {
    // If it's just a filename, add the path
    if (!article.featured_image.startsWith('/')) {
      return `/assets/images/${article.featured_image}`;
    }
    return article.featured_image;
  }
  
  // 2. Find first image in article content (Obsidian format or standard markdown)
  const obsidianImageMatch = article.rawContent?.match(/!\[\[@?[^\]]*\/([^\]\/]+\.(jpg|jpeg|png|gif|webp))\]\]/i);
  if (obsidianImageMatch) {
    return `/assets/images/${obsidianImageMatch[1]}`;
  }
  
  const markdownImageMatch = article.rawContent?.match(/!\[.*?\]\(.*?\/([^\/\)]+\.(jpg|jpeg|png|gif|webp))\)/i);
  if (markdownImageMatch) {
    return `/assets/images/${markdownImageMatch[1]}`;
  }
  
  // 3. Fallback to category-specific placeholder SVG
  return `/assets/images/${article.category}-placeholder.svg`;
}

/**
 * Generate article card HTML
 */
function generateArticleCard(article, size = 'normal') {
  const categoryData = getCategoryMeta(article.category);
  const imagePath = getImagePath(article);
  
  return `
    <article class="article-card article-card--${size}">
      <a href="/articles/${article.slug}.html" class="article-card__link">
        <div class="article-card__image">
          <img src="${imagePath}" 
               alt="${article.title}" 
               loading="lazy">
          <span class="article-card__category" style="background-color: ${categoryData.color}">
            ${categoryData.name}
          </span>
        </div>
        <div class="article-card__content">
          <h3 class="article-card__title">${article.title}</h3>
          <p class="article-card__excerpt">${article.excerpt || ''}</p>
          <div class="article-card__meta">
            <div class="article-card__author">
              <img src="${article.persona.avatar}" alt="${article.persona.name}" class="article-card__avatar">
              <span>${article.persona.name}</span>
            </div>
            <span class="article-card__reading-time">${article.reading_time || '5 min'}</span>
          </div>
        </div>
      </a>
    </article>
  `;
}

/**
 * Build homepage
 */
function buildHomepage(articles) {
  // featured 글이 없으면 최신 글 3개를 featured로 사용
  let featuredArticles = articles.filter(a => a.featured).slice(0, 3);
  if (featuredArticles.length === 0) {
    featuredArticles = articles.slice(0, 3);
  }
  const recentArticles = articles.slice(0, 12);

  const featuredHtml = featuredArticles.map((a, i) =>
    generateArticleCard(a, i === 0 ? 'featured' : 'normal')
  ).join('');
  
  const articlesHtml = recentArticles.map(a => generateArticleCard(a)).join('');
  
  // Build category links
  const categoryLinksHtml = Object.entries(CATEGORIES).map(([key, cat]) => `
    <a href="/category/${key}.html" class="category-link" style="--cat-color: ${cat.color}">
      <span class="category-link__name">${cat.name}</span>
      <span class="category-link__count">${articles.filter(a => a.category === key).length} articles</span>
    </a>
  `).join('');
  
  const html = renderTemplate('index', {
    siteName: CONFIG.siteName,
    featured: featuredHtml,
    articles: articlesHtml,
    categories: categoryLinksHtml,
    year: new Date().getFullYear()
  });
  
  const outputPath = path.join(CONFIG.outputDir, 'index.html');
  fs.writeFileSync(outputPath, html);
  console.log('Built: index.html');
}

/**
 * Build individual article pages
 */
function buildArticlePages(articles) {
  const articlesDir = path.join(CONFIG.outputDir, 'articles');
  fs.mkdirSync(articlesDir, { recursive: true });
  
  // Generate recent posts for sidebar (excluding current article)
  const generateRecentPosts = (currentSlug) => {
    return articles
      .filter(a => a.slug !== currentSlug)
      .slice(0, 5)
      .map(a => `
        <a href="/articles/${a.slug}.html" class="sidebar-post">
          <div class="sidebar-post__image">
            <img src="${getImagePath(a)}" alt="${a.title}" loading="lazy">
          </div>
          <div class="sidebar-post__content">
            <h4 class="sidebar-post__title">${a.title}</h4>
            <span class="sidebar-post__author">${a.persona.name}</span>
          </div>
        </a>
      `).join('');
  };
  
  for (const article of articles) {
    const categoryData = getCategoryMeta(article.category);
    
    // Get related articles (same category, different article)
    const related = articles
      .filter(a => a.category === article.category && a.slug !== article.slug)
      .slice(0, 3)
      .map(a => generateArticleCard(a, 'small'))
      .join('');
    
    // Tags HTML
    const tagsHtml = (article.tags || []).map(tag => 
      `<a href="/tag/${tag}.html" class="article-tag">${tag}</a>`
    ).join('');
    
    // Recent posts for sidebar
    const recentPostsHtml = generateRecentPosts(article.slug);
    
    const html = renderTemplate('article', {
      siteName: CONFIG.siteName,
      title: article.title,
      content: article.content,
      featured_image: getImagePath(article),
      category: categoryData.name,
      categorySlug: article.category,
      categoryColor: categoryData.color,
      date: formatDate(article.date),
      updated: formatDate(article.updated),
      reading_time: article.reading_time,
      authorName: article.persona.name,
      authorRole: article.persona.role,
      authorAvatar: article.persona.avatar,
      authorBio: article.persona.bio,
      authorSlug: article.journalist,
      tags: tagsHtml,
      related: related,
      recentPosts: recentPostsHtml,
      excerpt: article.excerpt,
      slug: article.slug,
      url: `${CONFIG.siteUrl}/articles/${article.slug}.html`,
      year: new Date().getFullYear()
    });
    
    const outputPath = path.join(articlesDir, `${article.slug}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`Built: articles/${article.slug}.html`);
  }
}

/**
 * Build category pages
 */
function buildCategoryPages(articles) {
  const categoryDir = path.join(CONFIG.outputDir, 'category');
  fs.mkdirSync(categoryDir, { recursive: true });
  
  for (const [slug, category] of Object.entries(CATEGORIES)) {
    const categoryArticles = articles.filter(a => a.category === slug);
    const articlesHtml = categoryArticles.map(a => generateArticleCard(a)).join('');
    
    const html = renderTemplate('category', {
      siteName: CONFIG.siteName,
      categoryName: category.name,
      categoryDescription: category.description,
      categoryColor: category.color,
      categorySlug: slug,
      articleCount: categoryArticles.length,
      articles: articlesHtml,
      year: new Date().getFullYear()
    });
    
    const outputPath = path.join(categoryDir, `${slug}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`Built: category/${slug}.html`);
  }
}

/**
 * Build journalist/author pages
 */
function buildJournalistPages(articles) {
  const journalistDir = path.join(CONFIG.outputDir, 'journalist');
  fs.mkdirSync(journalistDir, { recursive: true });
  
  for (const [slug, persona] of Object.entries(PERSONAS)) {
    const journalistArticles = articles.filter(a => a.journalist === slug);
    const articlesHtml = journalistArticles.map(a => generateArticleCard(a)).join('');
    
    const html = renderTemplate('journalist', {
      siteName: CONFIG.siteName,
      journalistName: persona.name,
      journalistRole: persona.role,
      journalistAvatar: persona.avatar,
      journalistBio: persona.bio,
      journalistSlug: slug,
      articleCount: journalistArticles.length,
      articles: articlesHtml,
      year: new Date().getFullYear()
    });
    
    const outputPath = path.join(journalistDir, `${slug}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`Built: journalist/${slug}.html`);
  }
}

/**
 * Build tag pages
 */
function buildTagPages(articles) {
  const tagDir = path.join(CONFIG.outputDir, 'tag');
  fs.mkdirSync(tagDir, { recursive: true });
  
  // Collect all unique tags
  const tagMap = new Map();
  for (const article of articles) {
    for (const tag of (article.tags || [])) {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }
      tagMap.get(tag).push(article);
    }
  }
  
  // Build page for each tag
  for (const [tag, tagArticles] of tagMap) {
    const articlesHtml = tagArticles.map(a => generateArticleCard(a)).join('');
    
    const html = renderTemplate('tag', {
      siteName: CONFIG.siteName,
      tagName: tag,
      articleCount: tagArticles.length,
      articles: articlesHtml,
      year: new Date().getFullYear()
    });
    
    const outputPath = path.join(tagDir, `${tag}.html`);
    fs.writeFileSync(outputPath, html);
    console.log(`Built: tag/${tag}.html`);
  }
}

/**
 * Generate RSS feed
 */
function buildRssFeed(articles) {
  const items = articles.slice(0, 20).map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${CONFIG.siteUrl}/articles/${article.slug}.html</link>
      <description><![CDATA[${article.excerpt || ''}]]></description>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <guid>${CONFIG.siteUrl}/articles/${article.slug}.html</guid>
      <author>${article.persona.name}</author>
      <category>${getCategoryMeta(article.category).name}</category>
    </item>
  `).join('');
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${CONFIG.siteName}</title>
    <link>${CONFIG.siteUrl}</link>
    <description>중소기업 경영컨설팅 전문 - 법인설립, 세무, 노무, 재무</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${CONFIG.siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
  
  fs.writeFileSync(path.join(CONFIG.outputDir, 'feed.xml'), rss);
  console.log('Built: feed.xml');
}

/**
 * Generate sitemap
 */
function buildSitemap(articles) {
  const pages = [
    { url: '/', priority: '1.0' },
    ...CONFIG.categories.map(c => ({ url: `/category/${c}.html`, priority: '0.8' })),
    ...Object.keys(PERSONAS).map(p => ({ url: `/journalist/${p}.html`, priority: '0.7' })),
    ...articles.map(a => ({ url: `/articles/${a.slug}.html`, priority: '0.9' }))
  ];
  
  const urls = pages.map(page => `
  <url>
    <loc>${CONFIG.siteUrl}${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>weekly</changefreq>
  </url>`).join('');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  
  fs.writeFileSync(path.join(CONFIG.outputDir, 'sitemap.xml'), sitemap);
  console.log('Built: sitemap.xml');
}

/**
 * Copy static assets
 */
function copyPublicAssets() {
  if (fs.existsSync(CONFIG.publicDir)) {
    copyDir(CONFIG.publicDir, CONFIG.outputDir);
    console.log('Copied: public assets');
  }
  
  // Copy content assets
  const assetsDir = path.join(CONFIG.contentDir, '_assets');
  if (fs.existsSync(assetsDir)) {
    const destAssetsDir = path.join(CONFIG.outputDir, 'assets');
    copyDir(assetsDir, destAssetsDir);
    console.log('Copied: content assets');
  }
}

/**
 * Utility: Copy directory recursively
 */
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Utility: Format date
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Main build function
 */
async function build() {
  console.log('\n>> Building L-BIZ PARTNERS Blog...\n');
  
  const startTime = Date.now();
  
  // Create output directory (don't delete to avoid Dropbox lock issues)
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  
  // Get all articles
  const articles = getArticles();
  console.log(`Found ${articles.length} published articles\n`);
  
  // Build all pages
  buildHomepage(articles);
  buildArticlePages(articles);
  buildCategoryPages(articles);
  buildJournalistPages(articles);
  buildTagPages(articles);
  buildRssFeed(articles);
  buildSitemap(articles);
  copyPublicAssets();
  
  const buildTime = Date.now() - startTime;
  console.log(`\n>> Build complete in ${buildTime}ms\n`);
}

// Run build
build().catch(console.error);
