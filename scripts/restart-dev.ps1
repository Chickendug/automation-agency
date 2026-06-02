# Stop old servers and start fresh on port 3000
$ErrorActionPreference = "SilentlyContinue"

Write-Host "Stopping processes on port 3000 and 3002..." -ForegroundColor Yellow
foreach ($port in 3000, 3002) {
  $lines = netstat -ano | findstr ":$port "
  foreach ($line in $lines) {
    if ($line -match "LISTENING\s+(\d+)") {
      $pid = $Matches[1]
      if ($pid -ne "0") {
        taskkill /PID $pid /F 2>$null
        Write-Host "  Killed PID $pid (port $port)"
      }
    }
  }
}

Start-Sleep -Seconds 2

Set-Location $PSScriptRoot\..

Write-Host "Clearing .next cache..." -ForegroundColor Yellow
if (Test-Path .next) {
  cmd /c "rmdir /s /q .next" 2>$null
}

Write-Host "Regenerating Prisma..." -ForegroundColor Yellow
npx prisma generate

Write-Host "`nStarting dev server at http://localhost:3000`n" -ForegroundColor Green
npm run dev
