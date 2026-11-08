@echo off
powershell -NoExit -ExecutionPolicy Bypass -Command "$Host.UI.RawUI.WindowTitle = 'GoalMate GitHub Upload'; Set-Location '%~dp0'; Write-Host '=== GoalMate GitHub Upload ===' -ForegroundColor Cyan; git add .; git commit -m 'update: goalmate app'; Write-Host 'Pushing to GitHub...' -ForegroundColor Yellow; git push -u origin main; Write-Host 'Complete!' -ForegroundColor Green"
