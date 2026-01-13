@echo off
title Fen Platformu - Hızlı Başlatma
color 0A
echo.
echo  ╔════════════════════════════════════════╗
echo  ║     🚀 FEN PLATFORMU BAŞLATILIYOR...    ║
echo  ╚════════════════════════════════════════╝
echo.

cd /d "C:\Users\onder\CascadeProjects\fen-platformu"

echo [1/2] 📱 Server başlatılıyor...
start "Fen Platformu Server" cmd /k "node server.js"

timeout /t 3 /nobreak > nul

echo [2/2] 🌐 Domain başlatılıyor...
start "Domain" cmd /k "npm run domain"

echo.
echo  ╔════════════════════════════════════════╗
echo  ║          ✅ PLATFORM HAZIR!            ║
echo  ╠════════════════════════════════════════╣
echo  ║ 📱 Telefon: fenbilimlericalis.loca.lt   ║
echo  ║ 🏠 PC:      localhost:3000             ║
echo  ╚════════════════════════════════════════╝
echo.
echo Platform kapatmak için bu pencereyi kapatabilirsiniz.
pause
