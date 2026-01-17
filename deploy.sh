#!/bin/bash
# Obsidian 볼트에서 웹사이트로 배포하는 스크립트

VAULT_CONTENT="/Users/isangsu/Documents/Obsidian/Obsi/Vault.01/Web-Content"
PROJECT_CONTENT="/Users/isangsu/tmp/ai-diven_cos/content"

echo "📦 Syncing from Obsidian vault..."
rsync -av --delete "$VAULT_CONTENT/" "$PROJECT_CONTENT/"

echo "📝 Committing changes..."
cd /Users/isangsu/tmp/ai-diven_cos
git add .
git commit -m "Update content from Obsidian vault - $(date '+%Y-%m-%d %H:%M')"

echo "🚀 Pushing to GitHub..."
git push

echo "✅ Done! Vercel will auto-deploy in ~30 seconds."
echo "🌐 Site: https://ai-divencos.vercel.app"
