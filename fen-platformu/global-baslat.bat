@echo off
title Fen Platformu - Global Erişim
color 0E
echo.
echo  ╔══════════════════════════════════════╗
echo  ║   🌐 GLOBAL ERİŞİM BAŞLATILIYOR...    ║
echo  ╚══════════════════════════════════════╝
echo.

cd /d "C:\Users\onder\CascadeProjects\fen-platformu"

echo [1/2] 📱 Server başlatılıyor...
start "Fen Platformu Server" cmd /k "node server.js"

timeout /t 3 /nobreak > nul

echo [2/2] 🌍 Global link oluşturuluyor...
start "Global Link" cmd /k "npm run public"

timeout /t 10 /nobreak > nul

echo.
echo  ╔══════════════════════════════════════╗
echo  ║       ✅ GLOBAL ERİŞİM HAZIR!       ║
echo  ╠══════════════════════════════════════╣
echo  ║ 🌍 Link: lk2vur-ip-78-190-250-179     ║
echo  ║           .tunnelmole.net              ║
echo  ║                                        ║
echo  ║ 📱 Paylaş: Linki kopyala & gönder!     ║
echo  ╚══════════════════════════════════════╝
echo.
echo Global link hazır! Öğrencilerle paylaşabilirsiniz.
pause
