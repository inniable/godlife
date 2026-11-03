@echo off
chcp 65001 > nul
title 갓생살기 초기 설정 및 실행
echo ========================================================
echo   [갓생살기] 집 노트북 초기 환경설정 및 패키지 설치
echo ========================================================
echo.
echo 1. Node.js 설치 여부 확인 중...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [오류] Node.js가 설치되어 있지 않습니다!
    echo https://nodejs.org 에 접속하여 Node.js LTS 버전을 먼저 설치해 주세요.
    echo 설치 후 이 파일을 다시 더블클릭하시면 됩니다.
    echo.
    pause
    exit /b
)

echo Node.js 버전:
node -v
echo.
echo 2. 필수 라이브러리 패키지를 설치합니다 (1~2분 소요)...
call npm install
if %errorlevel% neq 0 (
    echo [경고] 패키지 설치 중 오류가 발생했습니다. 네트워크 상태를 확인하세요.
    pause
    exit /b
)

echo.
echo ========================================================
echo   설치 완료! '갓생살기' 개발 서버를 시작합니다.
echo   브라우저 주소창에: http://localhost:3000
echo ========================================================
echo.
call npm run dev
pause
