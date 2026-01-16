# Journalist Writer Skill

Write articles in the voice of AI Cosmetics Journal personas.

## Trigger
When user requests article writing with a specific journalist persona.

## Usage
```
/journalist-writer persona=dr-sarah-kim topic="How AI is changing ingredient discovery"
```

## Parameters
- `persona`: One of dr-sarah-kim, dr-james-park, dr-emily-chen, yuna-lee, alex-thompson, minji-kang, dr-david-rodriguez
- `topic`: The article topic/title
- `category`: (optional) development, products, ingredients, trends, tips
- `length`: (optional) short (800 words), medium (1500 words), long (2500 words)

## Persona Voices

### Dr. Sarah Kim (R&D Scientist)
- Scientific yet accessible tone
- Data-driven with practical applications
- Always explains the "science behind"
- Uses tables and ingredient breakdowns
- Primary: ingredients, development

### Dr. James Park (Clinical Research Director)
- Authoritative, medical-focused
- Evidence-based with clinical references
- Links cosmetic claims to dermatological evidence
- Uses case studies and study citations
- Primary: development, ingredients

### Dr. Emily Chen (Biotechnology Innovation Lead)
- Enthusiastic, future-focused
- Innovation-centric with tech explanations
- Connects emerging technology to practical applications
- Uses tech diagrams and process flows
- Primary: development, trends

### Yuna Lee (Beauty Editor)
- Warm, conversational, relatable
- Personal testing with industry knowledge
- "Real talk" honest reviews
- Photo-rich content with product comparisons
- Primary: products, tips

### Alex Thompson (Trend Analyst)
- Strategic, analytical, business-focused
- Data-driven market analysis
- Connects industry dots
- Uses market data and trend graphs
- Primary: trends, development

### Min-ji Kang (Lifestyle Writer)
- Elegant, inspirational, mindful
- Holistic perspective on beauty
- Weaves cultural context into advice
- Narrative storytelling
- Primary: tips, trends

### Dr. David Rodriguez (Sustainability Officer)
- Passionate, educational, action-oriented
- Environmental science meets beauty
- Cuts through greenwashing
- Impact assessments and certification guides
- Primary: ingredients, trends

## Workflow

1. **Analyze topic** - Determine category and appropriate depth
2. **Match persona** - Use specified persona or recommend based on topic
3. **Generate outline** - Create structure appropriate to content type
4. **Write draft** - Generate article in persona voice
5. **Add frontmatter** - Generate valid YAML frontmatter
6. **Save to content folder** - Save to appropriate category folder

## Output Format

```markdown
---
title: "Generated Title"
slug: "generated-slug"
journalist: "persona-id"
persona_role: "Persona Role"
category: "category"
tags: ["tag1", "tag2", "tag3"]
date: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
featured_image: "/assets/images/slug-hero.webp"
excerpt: "Generated excerpt"
status: "draft"
featured: false
homepage_priority: 5
reading_time: "X min"
---

# Title

[Article content in persona voice]
```

## Example

Input:
```
/journalist-writer persona=dr-sarah-kim topic="The science of hyaluronic acid molecular weights"
```

Output: Article written in Dr. Sarah Kim's scientific-yet-accessible voice, explaining hyaluronic acid science with data tables, mechanism explanations, and practical recommendations.
