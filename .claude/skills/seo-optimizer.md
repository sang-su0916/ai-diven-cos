# SEO Optimizer Skill

Optimize articles for search engine visibility and social sharing.

## Trigger
When user wants to improve article SEO.

## Usage
```
/seo-optimizer path=content/ingredients/niacinamide-guide.md
/seo-optimizer --audit-all
```

## Parameters
- `path`: Path to article file
- `--audit-all`: Audit all published articles
- `--generate-suggestions`: Create improvement suggestions
- `--update`: Apply recommended changes

## SEO Checklist

### Title Optimization
- Length: 50-60 characters optimal
- Primary keyword near beginning
- Engaging but accurate
- Unique across site

### Meta Description (Excerpt)
- Length: 150-160 characters
- Includes primary keyword
- Clear value proposition
- Call to action if appropriate

### URL (Slug)
- Contains primary keyword
- Short but descriptive
- No stop words
- Hyphen-separated

### Headings
- Single H1 (article title)
- H2s contain secondary keywords
- Logical hierarchy
- Scannable structure

### Content
- Keyword density 1-2%
- Natural language (not stuffed)
- Internal links to related content
- External links to authoritative sources

### Images
- Descriptive alt text with keywords
- Optimized file size
- Proper dimensions
- WebP format preferred

## Analysis Output

```
SEO Analysis: niacinamide-guide.md

Overall Score: 78/100

Title: "Niacinamide: The Complete Science-Backed Guide"
  ✅ Length: 47 chars (optimal)
  ✅ Keyword position: "Niacinamide" at start
  ⚠️ Missing modifier: Consider adding "2025" or "Ultimate"
  Score: 85/100

Excerpt: "Everything you need to know about niacinamide..."
  ✅ Length: 156 chars (optimal)
  ✅ Contains primary keyword
  ⚠️ Could be more compelling
  Score: 75/100

URL Slug: niacinamide-complete-guide
  ✅ Contains keyword
  ✅ Good length
  ✅ No stop words
  Score: 95/100

Content Analysis:
  ✅ Word count: 2,847 (comprehensive)
  ✅ Keyword density: 1.4% (optimal)
  ✅ Internal links: 3 (good)
  ⚠️ External links: 0 (add authoritative sources)
  ⚠️ FAQ section: Missing (consider adding)
  Score: 72/100

Images:
  ✅ Featured image: Present
  ⚠️ Alt text: Generic ("placeholder")
  ❌ Missing: Section images
  Score: 55/100

Recommendations:
1. Add 2-3 section images with keyword-rich alt text
2. Include FAQ section for featured snippets
3. Link to 1-2 scientific studies
4. Update title to "Niacinamide Guide 2025: Science-Backed Benefits"
```

## Keyword Suggestions

```
Primary Keyword: "niacinamide"
  Search volume: 74,000/mo
  Difficulty: Medium
  Current ranking: Not indexed

Related Keywords to Include:
  • "niacinamide benefits" (18,000/mo)
  • "niacinamide serum" (12,000/mo)
  • "niacinamide and vitamin c" (8,000/mo)
  • "niacinamide percentage" (4,000/mo)

Long-tail Opportunities:
  • "best niacinamide percentage for oily skin"
  • "can you use niacinamide with retinol"
  • "niacinamide before or after moisturizer"
```

## Auto-Improvements

When run with `--update`, can:

1. **Optimize Title**
   - Adjust length
   - Reposition keyword
   - Add modifiers

2. **Improve Excerpt**
   - Ensure keyword inclusion
   - Optimize length
   - Add action words

3. **Generate Alt Text**
   - Create descriptive, keyword-rich alt text
   - Based on surrounding content context

4. **Add Internal Links**
   - Find related articles
   - Suggest anchor text
   - Insert contextual links

5. **Suggest FAQ**
   - Generate common questions
   - Based on keyword research
   - Formatted for featured snippets

## Schema Markup

Generates structured data for:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "description": "Excerpt",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-15",
  "publisher": {
    "@type": "Organization",
    "name": "AI Cosmetics Journal"
  }
}
```

## Reporting

```
/seo-optimizer --audit-all

Site-wide SEO Audit
===================

Total Articles: 10
Average Score: 74/100

Score Distribution:
  90-100: ██ 2 articles
  80-89:  ████ 4 articles
  70-79:  ██ 2 articles
  Below 70: ██ 2 articles

Top Issues:
1. Missing alt text: 6 articles
2. No external links: 8 articles
3. Short excerpts: 3 articles
4. Missing FAQ: 10 articles

Quick Wins (Highest Impact):
1. Add FAQ sections (+15 avg score)
2. Optimize image alt text (+8 avg score)
3. Add external authoritative links (+5 avg score)
```
