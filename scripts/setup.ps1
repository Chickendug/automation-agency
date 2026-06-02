# Agency OS — one-time setup (run from project root)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "`n=== Agency OS Setup ===`n" -ForegroundColor Cyan

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm packages..."
    npm install
}

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example"
}

Write-Host "Running database migration..."
npx prisma migrate dev --name sync

Write-Host "Seeding sample leads + default settings..."
npx tsx prisma/seed.ts

Write-Host "`n=== Done ===`n" -ForegroundColor Green
Write-Host "1. Edit .env — add GOOGLE_PLACES_API_KEY (optional)"
Write-Host "2. Run:  npm run dev"
Write-Host "3. Open: http://localhost:3000/start"
Write-Host ""
