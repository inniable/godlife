@echo off
chcp 65001 > nul
title 갓생살기 개발 서버 실행
echo ========================================================
echo   [갓생살기] 개발 서버 실행
echo ========================================================
echo.
echo 브라우저 주소창에: http://localhost:3000
echo 종료하시려면 창을 닫거나 Ctrl + C 를 누르세요.
echo.
call npm run dev
pause
