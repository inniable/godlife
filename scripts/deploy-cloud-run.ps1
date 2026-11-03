# ====================================================================
# GoalMate Google Cloud Run One-Click Deployment Script
# ====================================================================

param (
    [string]$ProjectId = "",
    [string]$ServiceName = "goalmate",
    [string]$Region = "asia-northeast3" # 서울 리전
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " GoalMate Google Cloud Run 배포 스크립트" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if gcloud CLI is installed
$gcloud = Get-Command gcloud -ErrorAction SilentlyContinue
if (-not $gcloud) {
    Write-Host "[오류] Google Cloud SDK(gcloud CLI)가 설치되어 있지 않습니다." -ForegroundColor Red
    Write-Host "https://cloud.google.com/sdk/docs/install 에서 gcloud CLI를 설치 후 로그인(gcloud auth login)해 주세요." -ForegroundColor Yellow
    exit 1
}

# If Project ID is not provided, fetch current active project
if ([string]::IsNullOrWhiteSpace($ProjectId)) {
    $ProjectId = (gcloud config get-value project 2>$null)
    if ([string]::IsNullOrWhiteSpace($ProjectId) -or $ProjectId -eq "(unset)") {
        $ProjectId = Read-Host "배포할 Google Cloud 프로젝트 ID를 입력하세요"
    }
}

Write-Host "1. 대상 프로젝트: $ProjectId" -ForegroundColor Cyan
Write-Host "2. 배포 리전: $Region (서울)" -ForegroundColor Cyan
Write-Host "3. 서비스 이름: $ServiceName" -ForegroundColor Cyan

# Set project
gcloud config set project $ProjectId

# Enable required Google Cloud services
Write-Host "`n필수 구글 클라우드 API 활성화 중 (Cloud Run, Cloud Build, Artifact Registry)..." -ForegroundColor Yellow
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# Build and Deploy to Cloud Run using source deploy
Write-Host "`nCloud Run 소스 빌드 및 자동 배포 시작..." -ForegroundColor Yellow
gcloud run deploy $ServiceName `
    --source . `
    --region $Region `
    --platform managed `
    --allow-unauthenticated `
    --port 8080 `
    --min-instances 0 `
    --max-instances 5 `
    --memory 512Mi `
    --cpu 1

Write-Host "`n[완료] Google Cloud Run 배포가 성공적으로 완료되었습니다!" -ForegroundColor Green
$serviceUrl = (gcloud run services describe $ServiceName --region $Region --format 'value(status.url)' 2>$null)
Write-Host "접속 주소: $serviceUrl" -ForegroundColor Cyan
