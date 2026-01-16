# Article Publisher Skill

Validate, optimize, and publish articles to the AI Cosmetics Journal.

## Trigger
When user wants to publish an article draft.

## Usage
```
/article-publisher path=content/development/2025-01-15-my-article.md
```

## Parameters
- `path`: Path to the markdown article file
- `validate-only`: (optional) Only validate, don't publish
- `force`: (optional) Skip confirmation prompts

## Publishing Checklist

### Pre-flight Checks

1. **YAML Frontmatter Validation**
   - All required fields present
   - Valid category value
   - Valid journalist ID
   - Proper date format
   - Unique slug

2. **Content Quality**
   - Article length appropriate (min 800 words)
   - Headings structure valid (H2, H3, not H4+)
   - No broken internal links
   - Alt text on all images
   - No placeholder content

3. **SEO Requirements**
   - Title under 60 characters
   - Excerpt between 150-160 characters
   - 2-5 relevant tags
   - Featured image specified

4. **Image Verification**
   - Featured image exists
   - All referenced images exist
   - Images are optimized (WebP format)
   - Proper dimensions

## Workflow

### Step 1: Validate
```
Running validation checks...

✅ YAML frontmatter: Valid
✅ Required fields: All present
✅ Category: Valid (ingredients)
✅ Journalist: Valid (dr-sarah-kim)
✅ Slug: Unique
✅ Word count: 1,847 words
✅ Heading structure: Valid
✅ Images: All found
⚠️ Excerpt: 172 chars (recommended: 150-160)
```

### Step 2: Optimize (if needed)
- Compress images
- Truncate excerpt
- Generate missing alt text
- Fix formatting issues

### Step 3: Confirm
```
Ready to publish:
  Title: "How AI is Revolutionizing Retinol Formulation"
  Category: development
  Author: Dr. Sarah Kim
  Status: draft → published

Proceed? (y/n)
```

### Step 4: Publish
- Update status to "published"
- Update "updated" date
- Commit to Git
- Trigger site rebuild

## Error Handling

### Critical Errors (Block Publishing)
- Missing required YAML fields
- Invalid category or journalist
- Duplicate slug
- No featured image

### Warnings (Allow with Confirmation)
- Excerpt too long/short
- Missing image alt text
- Unusual word count
- No tags

### Informational
- Suggested tags based on content
- SEO improvement suggestions
- Related article recommendations

## Output

### Success
```
✅ Article published successfully!

📝 "How AI is Revolutionizing Retinol Formulation"
📂 Category: development
👤 Author: Dr. Sarah Kim
🔗 URL: /articles/ai-revolutionizing-retinol-formulation.html

Git commit: abc123f - "content(dev): publish AI retinol formulation article"

Site rebuild triggered. ETA: ~30 seconds.
```

### Failure
```
❌ Publishing failed

Errors found:
1. Missing required field: excerpt
2. Invalid journalist ID: sarah-kim (did you mean: dr-sarah-kim?)
3. Featured image not found: /assets/images/missing.webp

Please fix these issues and try again.
```

## Integration

- Works with Git for version control
- Triggers site build process
- Updates admin dashboard data
- Can be automated via hooks
