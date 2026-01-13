@echo off
title Fen Platformu - Yeniden Başlat
color 0C
echo.
echo  ╔══════════════════════════════════════╗
echo  ║    🔄 SUNUCU YENİDEN BAŞLATILIYOR...  ║
echo  ╚══════════════════════════════════════╝
echo.

echo [1/2] 🔴 Mevcut sunucu durduruluyor...
taskkill /f /im node.exe >nul 2>&1

timeout /t 2 /nobreak > nul

echo [2/2] 🟢 Yeni sunucu başlatılıyor...
cd /d "C:\Users\onder\CascadeProjects\fen-platformu"
start "Fen Platformu" cmd /k "node server.js"

timeout /t 3 /nobreak > nul

echo.
echo  ╔══════════════════════════════════════╗
echo  ║          ✅ SUNUCU HAZIR!            ║
echo  ╠══════════════════════════════════════╣
echo  ║ 📱 Telefon: 192.168.1.117:3000      ║
echo  ║ 🏠 PC:       localhost:3000           ║
echo  ╚══════════════════════════════════════╝
echo.
echo Sunucu yeniden başlatıldı!
pause
