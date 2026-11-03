# ====================================================================
# Android Release Keystore Generator for GoalMate (Google Play Store)
# ====================================================================

param (
    [string]$KeystoreName = "goalmate-release-key.jks",
    [string]$Alias = "goalmate-key",
    [int]$ValidityDays = 10000
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Google Play Store 앱 서명 키(Keystore) 생성기" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$keytool = Get-Command keytool -ErrorAction SilentlyContinue

if (-not $keytool) {
    Write-Host "[주의] Java JDK(keytool)가 시스템 환경변수에 등록되어 있지 않습니다." -ForegroundColor Red
    Write-Host "Android Studio가 설치된 경로(예: C:\Program Files\Android\Android Studio\jbr\bin)에서 keytool을 사용하거나" -ForegroundColor Yellow
    Write-Host "Android Studio 내부의 [Build] -> [Generate Signed Bundle / APK] 메뉴를 이용하시는 것을 추천합니다." -ForegroundColor Green
    exit 1
}

$keystorePath = Join-Path $PSScriptRoot "..\android\$KeystoreName"

keytool -genkey -v -keystore $keystorePath -alias $Alias -keyalg RSA -keysize 2048 -validity $ValidityDays

Write-Host "[성공] Keystore가 생성되었습니다: $keystorePath" -ForegroundColor Green
Write-Host "[경고] 생성된 키 파일과 비밀번호는 절대 분실하거나 외부에 노출하지 마세요!" -ForegroundColor Red
