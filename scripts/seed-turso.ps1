# Seed the live Turso database (run once after first Vercel deploy)
param(
  [Parameter(Mandatory = $true)]
  [string]$DatabaseUrl
)

$env:DATABASE_URL = $DatabaseUrl
Set-Location $PSScriptRoot\..

Write-Host "Running migrations on Turso..." -ForegroundColor Yellow
node scripts/migrate-libsql.mjs
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Seeding agency settings + sample data..." -ForegroundColor Yellow
npm run seed
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Done. Open your Vercel URL on phone -> Call mode." -ForegroundColor Green
