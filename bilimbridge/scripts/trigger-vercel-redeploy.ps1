# Схема: Vercel → Project → Settings → Git → Deploy Hooks → hook для main.
# В PowerShell (секрет не кладите в репозиторий):
#   $env:VERCEL_DEPLOY_HOOK_URL = "https://api.vercel.com/v1/integrations/deploy/..."
#   .\scripts\trigger-vercel-redeploy.ps1

$ErrorActionPreference = "Stop"
$url = $env:VERCEL_DEPLOY_HOOK_URL
if (-not $url) {
  Write-Error "Задайте VERCEL_DEPLOY_HOOK_URL — URL из Vercel → Deploy Hooks."
}
Write-Host "Отправляю POST на deploy hook..."
Invoke-WebRequest -Uri $url -Method POST -UseBasicParsing | Out-Null
Write-Host "Готово: проверьте Deployments в Vercel."
