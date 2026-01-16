# YAML Validator Skill

Validate and fix YAML frontmatter in article markdown files.

## Trigger
When user wants to check article frontmatter validity.

## Usage
```
/yaml-validator path=content/products/my-review.md
/yaml-validator --all  # Validate all articles
```

## Parameters
- `path`: Path to single markdown file
- `--all`: Validate all articles in content folder
- `--fix`: Automatically fix minor issues
- `--strict`: Fail on warnings too

## Validation Rules

### Required Fields
| Field | Type | Validation |
|-------|------|------------|
| title | string | Max 100 chars |
| slug | string | Lowercase, hyphens, unique |
| journalist | string | Must match PERSONAS.md ID |
| persona_role | string | Non-empty |
| category | string | One of 5 valid categories |
| tags | array | 2-5 items |
| date | string | YYYY-MM-DD format |
| updated | string | YYYY-MM-DD format |
| featured_image | string | Valid path |
| excerpt | string | 100-250 chars |
| status | string | draft or published |
| featured | boolean | true or false |
| homepage_priority | number | 1-10 |
| reading_time | string | "X min" format |

### Category Values
- development
- products
- ingredients
- trends
- tips

### Journalist IDs
- dr-sarah-kim
- dr-james-park
- dr-emily-chen
- yuna-lee
- alex-thompson
- minji-kang
- dr-david-rodriguez

## Output Examples

### Valid File
```
Validating: content/products/my-review.md

✅ YAML Frontmatter Valid

All 14 required fields present and valid:
  ✓ title: "Best Vitamin C Serums 2025"
  ✓ slug: "best-vitamin-c-serums-2025" (unique)
  ✓ journalist: "yuna-lee"
  ✓ category: "products"
  ✓ tags: ["review", "vitamin-c", "serums"]
  ✓ date: "2025-01-14"
  ✓ excerpt: 156 characters
  ✓ status: "draft"
  ✓ featured: false
  ✓ homepage_priority: 5
  ✓ reading_time: "12 min"
  ✓ featured_image: exists
```

### Invalid File
```
Validating: content/tips/bad-article.md

❌ YAML Frontmatter Invalid

Errors (3):
  ✗ journalist: "sarah" is not a valid journalist ID
    → Did you mean: "dr-sarah-kim"?
  ✗ category: "skincare" is not a valid category
    → Valid options: development, products, ingredients, trends, tips
  ✗ tags: Only 1 tag provided, minimum is 2

Warnings (2):
  ⚠ excerpt: 89 characters (recommended: 100-250)
  ⚠ slug: Contains uppercase letters (will be auto-converted)

Run with --fix to auto-correct warnings.
```

### Batch Validation
```
/yaml-validator --all

Scanning content folder...

Found 10 articles across 5 categories:
  • development: 2 articles
  • products: 2 articles  
  • ingredients: 2 articles
  • trends: 2 articles
  • tips: 2 articles

Results:
  ✅ Valid: 8 articles
  ⚠️ Warnings: 1 article (tips/winter-routine.md)
  ❌ Invalid: 1 article (ingredients/bad-article.md)

Details for issues:

tips/winter-routine.md:
  ⚠ reading_time: "6" should be "6 min"

ingredients/bad-article.md:
  ✗ Missing required field: excerpt
  ✗ Invalid date format: "Jan 15, 2025"
```

## Auto-Fix Capabilities

When run with `--fix`, can automatically:

1. Convert slug to lowercase
2. Fix reading_time format ("5" → "5 min")
3. Set default homepage_priority (5)
4. Set default featured (false)
5. Calculate reading_time from word count
6. Format dates to YYYY-MM-DD

Cannot auto-fix:
- Missing content
- Invalid journalist IDs
- Invalid categories
- Missing images

## Integration

- Called by article-publisher before publishing
- Can be run as pre-commit hook
- Reports to admin dashboard
- Generates fix suggestions for invalid entries
