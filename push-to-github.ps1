# Run from: C:\Users\Darahaas\voice-shopping-assistant
# Then create repo at https://github.com/new and run the commands at the end.

Set-Location $PSScriptRoot

if (-not (Test-Path .git)) {
    git init
    Write-Host "Git initialized."
}

git add .
$status = git status --short
if ($status) {
    git commit -m "Initial commit: Voice Command Shopping Assistant"
    Write-Host "Committed. Next: create repo at https://github.com/new then run:"
    Write-Host ""
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    Write-Host "  git branch -M main"
    Write-Host "  git push -u origin main"
    Write-Host ""
} else {
    Write-Host "Nothing to commit. To add remote and push:"
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    Write-Host "  git branch -M main"
    Write-Host "  git push -u origin main"
}
