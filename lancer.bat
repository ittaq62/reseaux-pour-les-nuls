@echo off
rem Réseaux pour les nuls : ouvre la page (démarre le petit serveur local si besoin)
chcp 65001 >nul
cd /d "%~dp0"
powershell -NoProfile -Command "try { Invoke-WebRequest -UseBasicParsing -TimeoutSec 2 http://localhost:8766/api/health | Out-Null; exit 0 } catch { exit 1 }"
if %errorlevel%==0 (
  start "" "http://localhost:8766/"
  exit /b
)
start "Reseaux pour les nuls" /min powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serveur.ps1"
exit /b
