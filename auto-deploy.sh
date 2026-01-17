#!/bin/bash
# Obsidian Web-Content 폴더 감시 → 자동 배포 스크립트

VAULT_CONTENT="/Users/isangsu/Documents/Obsidian/Obsi/Vault.01/Web-Content"
PROJECT_DIR="/Users/isangsu/tmp/ai-diven_cos"
PROJECT_CONTENT="$PROJECT_DIR/content"
LOG_FILE="$PROJECT_DIR/auto-deploy.log"

# 로그 함수
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 배포 함수
deploy() {
    log "📦 변경 감지! 동기화 시작..."

    # Obsidian → 프로젝트 동기화
    rsync -av --delete "$VAULT_CONTENT/" "$PROJECT_CONTENT/"

    # Git 커밋 & 푸시
    cd "$PROJECT_DIR"

    # 변경사항 있는지 확인
    if [[ -n $(git status --porcelain) ]]; then
        git add .
        git commit -m "Auto-deploy: $(date '+%Y-%m-%d %H:%M')"
        git push
        log "✅ 배포 완료! Vercel에서 30초 후 반영됩니다."
    else
        log "ℹ️ 변경사항 없음, 스킵"
    fi
}

# 시작 메시지
log "🚀 자동 배포 감시 시작: $VAULT_CONTENT"
log "   종료하려면 Ctrl+C"

# 초기 동기화
deploy

# 폴더 감시 (debounce 10초, 안정적인 동기화)
fswatch -o -l 10 --event Created --event Updated --event Removed "$VAULT_CONTENT" | while read -r; do
    sleep 2  # 파일 저장 완료 대기
    deploy
done
