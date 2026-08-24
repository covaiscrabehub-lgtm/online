@echo off
echo.
echo ================================================================
echo COVAI SCRAP HUB - Push Notification Sender
echo ================================================================
echo.
echo Choose option:
echo.
echo 1. Interactive mode (asks for details)
echo 2. Quick send (default message)
echo 3. Setup instructions
echo.
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
    node send-push.js
    goto end
)

if "%choice%"=="2" (
    node send-notification-simple.js
    goto end
)

if "%choice%"=="3" (
    type SETUP-AND-RUN.txt
    echo.
    pause
    goto end
)

echo Invalid choice
:end
pause
