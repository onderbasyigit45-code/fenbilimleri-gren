@echo off
echo 🚀 Fen Platformu Başlatılıyor...
echo.

cd /d "C:\Users\onder\CascadeProjects\fen-platformu"

echo 📱 Server başlatılıyor...
start "Fen Platformu Server" cmd /k "node server.js"

timeout /t 3 /nobreak > nul

echo 🌐 Özel domain başlatılıyor...
start "Domain" cmd /k "npm run domain"

echo.
echo ✅ Platform hazır!
echo 📱 Telefonunuzdan: https://fenbilimlericalis.loca.lt
echo 🏠 Bilgisayarda: http://localhost:3000
echo.
pause
