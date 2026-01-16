# Image Generator Skill

Generate article images using NanoBanana or other image generation services.

## Trigger
When user needs images for articles.

## Usage
```
/image-generator article="ai-revolutionizing-retinol" type=hero
```

## Parameters
- `article`: Article slug or path
- `type`: hero, section, product, diagram, comparison
- `style`: (optional) scientific, lifestyle, editorial, minimal
- `count`: (optional) Number of images to generate (default: 1)

## Image Types

### Hero Image
- Primary article image
- 1200x630px (optimal for social sharing)
- Captures article essence
- Category-appropriate styling

### Section Image
- Supporting content images
- 800x600px
- Illustrates specific points
- Matches article tone

### Product Image
- Product photography style
- 600x600px square
- Clean background
- Professional lighting

### Diagram
- Technical illustrations
- Explanatory graphics
- Scientific visualizations
- Process flows

### Comparison
- Side-by-side layouts
- Before/after formatting
- Feature comparison grids

## Style Guidelines

### Scientific Style
- Lab imagery, molecular structures
- Clean, clinical aesthetic
- Blue/white/gray palette
- Use for: ingredients, development

### Lifestyle Style
- Warm, aspirational imagery
- Natural lighting, soft colors
- Human elements when appropriate
- Use for: tips, wellness content

### Editorial Style
- Bold, magazine-quality
- Strong composition
- Trend-forward aesthetics
- Use for: products, trends

### Minimal Style
- Simple, clean layouts
- Lots of white space
- Typography-focused
- Use for: guides, how-to content

## Workflow

1. **Analyze article** - Read content to understand visual needs
2. **Generate prompts** - Create detailed image generation prompts
3. **Call NanoBanana** - Generate images via API
4. **Optimize** - Convert to WebP, resize appropriately
5. **Save** - Save to /content/_assets/images/ with proper naming
6. **Update article** - Update image paths in markdown

## Naming Convention

```
{date}-{slug}-{type}.webp

Examples:
2025-01-15-ai-retinol-hero.webp
2025-01-15-ai-retinol-section1.webp
2025-01-15-ai-retinol-diagram.webp
```

## Prompt Templates

### Hero Image Template
```
Professional cosmetics photography for beauty magazine article about [topic].
Style: [style], high-end editorial quality.
Elements: [key visual elements from article].
Mood: [category-appropriate mood].
No text overlays, suitable for article header.
```

### Diagram Template
```
Clean scientific diagram illustrating [concept].
Style: Modern infographic, minimal color palette.
Include: [specific elements to visualize].
Professional quality, suitable for educational content.
```

## Integration Notes

- Requires NanoBanana MCP server configured
- Falls back to placeholder if generation fails
- Always generates WebP format for optimal performance
- Maintains aspect ratios per type specification
