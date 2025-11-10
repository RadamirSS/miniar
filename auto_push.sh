#!/usr/bin/env bash
set -euo pipefail

# --- настройки ---
DEBOUNCE=5                # секунд тишины перед коммитом/пушем
EXCLUDES=(
  --exclude '\.git/'
  --exclude 'node_modules/'
  --exclude 'dist/'
  --exclude '\.vite/'
  --exclude 'coverage/'
  --exclude '\.DS_Store'
)
# ------------------

cd "$(dirname "$0")"

# проверка remotes и ветки
if ! git remote get-url origin >/dev/null 2>&1; then
  echo "[auto-push] ❌ remote 'origin' не настроен"; exit 1
fi

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
echo "[auto-push] watching on branch: $BRANCH"

# аккуратный выход
trap 'echo; echo "[auto-push] stopped"; exit 0' INT TERM

while true; do
  # ждём первое изменение (одиночное событие) и затем — debounce
  fswatch -1 -o "${EXCLUDES[@]}" .
  sleep "$DEBOUNCE"

  # есть ли реальные изменения
  if [[ -n "$(git status --porcelain)" ]]; then
    # не коммитим слишком большие файлы случайно (например, архивы)
    # при желании добавь фильтры или git lfs
    git add -A

    MSG="auto: $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$MSG" || true

    # тянем свежие изменения и пушим
    git pull --rebase origin "$BRANCH" || true
    if git push origin "$BRANCH"; then
      echo "[auto-push] ✅ pushed at $(date '+%H:%M:%S')"
    else
      echo "[auto-push] ⚠️ push failed (сеть/конфликт). Попробую в следующий раз."
    fi
  fi
done
