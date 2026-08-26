# On agent stop: if git is dirty or ahead of origin, request an immediate GitHub sync.
$ErrorActionPreference = "Continue"

$raw = [Console]::In.ReadToEnd()
$payload = $null
if ($raw) {
  try { $payload = $raw | ConvertFrom-Json } catch { $payload = $null }
}

$status = ""
$loopCount = 0
if ($payload) {
  if ($payload.status) { $status = [string]$payload.status }
  if ($null -ne $payload.loop_count) { $loopCount = [int]$payload.loop_count }
}

if ($status -eq "aborted" -or $loopCount -ge 2) {
  Write-Output "{}"
  exit 0
}

$git = Get-Command git -ErrorAction SilentlyContinue
if (-not $git) {
  Write-Output "{}"
  exit 0
}

$porcelain = & git status --porcelain 2>$null
$short = & git status -sb 2>$null
$hasLocalChanges = -not [string]::IsNullOrWhiteSpace(($porcelain | Out-String))
$ahead = (($short | Out-String) -match "ahead")

if (-not $hasLocalChanges -and -not $ahead) {
  Write-Output "{}"
  exit 0
}

$reason = if ($hasLocalChanges) {
  "working tree has files that are not committed"
} else {
  "local commits are not pushed to origin/main"
}

$msgPath = Join-Path $PSScriptRoot "auto-sync-github.message.txt"
$template = Get-Content -Raw -Encoding UTF8 -Path $msgPath
$followup = $template.Replace("{reason}", $reason).Trim()

$json = (@{ followup_message = $followup } | ConvertTo-Json -Compress)
$utf8 = New-Object System.Text.UTF8Encoding $false
[Console]::OutputEncoding = $utf8
$bytes = $utf8.GetBytes($json)
[Console]::OpenStandardOutput().Write($bytes, 0, $bytes.Length)
exit 0
