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
  siteName: 'AI Cosmetics Innovation Journal',
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

// Persona data (imported from PERSONAS.md)
const PERSONAS = {
  'dr-sarah-kim': {
    name: 'Dr. Sarah Kim',
    role: 'R&D Scientist',
    avatar: '/assets/personas/dr-sarah-kim.svg',
    bio: '15 years in K-beauty innovation. PhD Cosmetic Chemistry.'
  },
  'dr-james-park': {
    name: 'Dr. James Park',
    role: 'Clinical Research Director',
    avatar: '/assets/personas/dr-james-park.svg',
    bio: '20 years clinical practice. MD from Harvard Medical School.'
  },
  'dr-emily-chen': {
    name: 'Dr. Emily Chen',
    role: 'Biotechnology Innovation Lead',
    avatar: '/assets/personas/dr-emily-chen.svg',
    bio: 'PhD Biochemistry MIT. AI cosmetics formulation pioneer.'
  },
  'yuna-lee': {
    name: 'Yuna Lee',
    role: 'Beauty Editor',
    avatar: '/assets/personas/yuna-lee.svg',
    bio: '6 years beauty journalism. Former Allure Korea editor.'
  },
  'alex-thompson': {
    name: 'Alex Thompson',
    role: 'Trend Analyst',
    avatar: '/assets/personas/alex-thompson.svg',
    bio: '12 years beauty consulting. MBA London Business School.'
  },
  'minji-kang': {
    name: 'Min-ji Kang',
    role: 'Lifestyle Writer',
    avatar: '/assets/personas/minji-kang.svg',
    bio: '10 years lifestyle media. Holistic beauty advocate.'
  },
  'dr-david-rodriguez': {
    name: 'Dr. David Rodriguez',
    role: 'Sustainability Officer',
    avatar: '/assets/personas/dr-david-rodriguez.svg',
    bio: 'PhD Environmental Chemistry. B Corp advisor.'
  }
};

// Category metadata (known categories)
const CATEGORIES = {
  development: { name: 'Development', description: 'AI cosmetics R&D process', color: '#6366f1' },
  products: { name: 'Products', description: 'Product information & reviews', color: '#ec4899' },
  ingredients: { name: 'Ingredients', description: 'Ingredient science & formulation', color: '#10b981' },
  trends: { name: 'Trends', description: 'Industry trends & research', color: '#f59e0b' },
  tips: { name: 'Tips', description: 'Beauty tips & usage guides', color: '#8b5cf6' },
  videos: { name: 'Videos', description: 'Video notes & learning resources', color: '#ef4444' }
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
          filePath,
          category,
          persona: PERSONAS[frontmatter.journalist] || PERSONAS['yuna-lee']
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
 * Get image path with fallback to category placeholder
 */
function getImagePath(article) {
  // Use featured_image from YAML if exists
  if (article.featured_image) {
    return article.featured_image;
  }
  // Fallback to category-specific placeholder SVG
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
  const featuredArticles = articles.filter(a => a.featured).slice(0, 3);
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
    <description>AI-powered insights into cosmetics innovation</description>
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
  console.log('\n>> Building AI Cosmetics Journal...\n');
  
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
