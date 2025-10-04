#!/usr/bin/env pwsh

# 🚀 Quick Setup Script for GitHub Push
# Bu script projeyi GitHub'a yüklemek için gerekli tüm adımları yapar

Write-Host "🚀 @nlabs/grid - GitHub Setup Script" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# 1. Mevcut dizini kontrol et
$currentDir = Get-Location
Write-Host "📂 Current directory: $currentDir" -ForegroundColor Yellow

# 2. Git durumunu kontrol et
Write-Host "`n📊 Checking Git status..." -ForegroundColor Green
git status

# 3. Kullanıcıdan onay al
Write-Host "`n❓ Do you want to commit and push all changes? (Y/N)" -ForegroundColor Cyan
$confirmation = Read-Host

if ($confirmation -ne 'Y' -and $confirmation -ne 'y') {
    Write-Host "❌ Operation cancelled." -ForegroundColor Red
    exit
}

# 4. Tüm değişiklikleri ekle
Write-Host "`n📦 Adding all changes to staging..." -ForegroundColor Green
git add .

# 5. Commit yap
Write-Host "`n💾 Creating commit..." -ForegroundColor Green
git commit -m "feat: initial commit - @nlabs/grid library with full features

- Enterprise-grade DataGrid component
- Light/Dark theme system with auto mode
- Dual edit modes (inline + modal)
- CRUD operations with Turkish UI
- Export to Excel, CSV, PDF, JSON
- Advanced filtering, sorting, grouping
- Custom cell and footer templates
- Responsive design
- Complete documentation and examples
- CI/CD pipeline with GitHub Actions"

# 6. Remote kontrolü
Write-Host "`n🔗 Checking remote repository..." -ForegroundColor Green
$remoteExists = git remote get-url origin 2>$null

if ($remoteExists) {
    Write-Host "✅ Remote 'origin' already exists: $remoteExists" -ForegroundColor Yellow
    Write-Host "❓ Do you want to update it? (Y/N)" -ForegroundColor Cyan
    $updateRemote = Read-Host
    
    if ($updateRemote -eq 'Y' -or $updateRemote -eq 'y') {
        git remote set-url origin https://github.com/nlabsGlobalAngular/nlabs-grid.git
        Write-Host "✅ Remote URL updated!" -ForegroundColor Green
    }
} else {
    Write-Host "📝 Adding remote 'origin'..." -ForegroundColor Green
    git remote add origin https://github.com/nlabsGlobalAngular/nlabs-grid.git
}

# 7. Branch'i main olarak ayarla
Write-Host "`n🌿 Setting branch to 'main'..." -ForegroundColor Green
git branch -M main

# 8. Push et
Write-Host "`n📤 Pushing to GitHub..." -ForegroundColor Green
Write-Host "⚠️  You may need to enter your GitHub credentials..." -ForegroundColor Yellow

$pushResult = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "`n🎉 Your repository is now available at:" -ForegroundColor Cyan
    Write-Host "   https://github.com/nlabsGlobalAngular/nlabs-grid" -ForegroundColor White
    
    Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Visit your repository on GitHub" -ForegroundColor White
    Write-Host "   2. Check the Actions tab for CI/CD status" -ForegroundColor White
    Write-Host "   3. Configure repository settings (optional)" -ForegroundColor White
    Write-Host "   4. Add NPM_TOKEN secret for publishing (optional)" -ForegroundColor White
    Write-Host "   5. Add topics: angular, datagrid, grid, typescript" -ForegroundColor White
} else {
    Write-Host "`n❌ Push failed!" -ForegroundColor Red
    Write-Host "Error: $pushResult" -ForegroundColor Red
    Write-Host "`n💡 Possible solutions:" -ForegroundColor Yellow
    Write-Host "   1. Make sure you have access to the repository" -ForegroundColor White
    Write-Host "   2. Check your Git credentials" -ForegroundColor White
    Write-Host "   3. Ensure the repository exists on GitHub" -ForegroundColor White
    Write-Host "   4. Try: git config credential.helper store" -ForegroundColor White
}

Write-Host "`n✨ Done!" -ForegroundColor Green
