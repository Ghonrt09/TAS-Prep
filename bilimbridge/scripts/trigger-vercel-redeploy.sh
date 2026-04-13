#!/usr/bin/env bash
# Схема: Vercel → Project → Settings → Git → Deploy Hooks → создать hook для branch main.
# Скопировать URL хука в переменную окружения (локально в .env.local не коммитить):
#   export VERCEL_DEPLOY_HOOK_URL='https://api.vercel.com/v1/integrations/deploy/...'
# Запуск: bash scripts/trigger-vercel-redeploy.sh

set -euo pipefail

URL="${VERCEL_DEPLOY_HOOK_URL:-}"
if [[ -z "$URL" ]]; then
  echo "Ошибка: задайте VERCEL_DEPLOY_HOOK_URL (URL из Vercel → Deploy Hooks)." >&2
  exit 1
fi

echo "Отправляю POST на deploy hook..."
curl -fsS -X POST "$URL"
echo ""
echo "Готово: Vercel должен поставить новый деплой в очередь. Проверьте вкладку Deployments."
