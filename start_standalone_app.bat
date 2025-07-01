@echo off
echo.
echo ================================================================
echo 🚀 Starting Standalone Inventory Management App
echo ================================================================
echo.
echo ✅ This app runs completely on your phone - no server needed!
echo ✅ Data is stored locally on your device
echo ✅ Works offline and online
echo.

cd inventory-web

echo 📱 Installing React Native dependencies...
call npm install

echo.
echo 🚀 Starting React Native app...
echo.
echo 📋 Options:
echo   [a] Android device/emulator
echo   [i] iOS simulator
echo   [w] Web browser
echo   [s] Start normally (scan QR code)
echo.

set /p choice="Choose option (a/i/w/s): "

if /i "%choice%"=="a" (
    echo 📱 Starting for Android...
    call npx expo start --android
    goto :end
)
if /i "%choice%"=="i" (
    echo 📱 Starting for iOS...
    call npx expo start --ios
    goto :end
)
if /i "%choice%"=="w" (
    echo 🌐 Starting in web browser...
    call npx expo start --web
    goto :end
)
echo 📱 Starting with QR code (default)...
call npx expo start

:end

echo.
echo ✅ App launched successfully!
echo 📱 Scan the QR code with Expo Go app to test on your phone
echo 🛑 Press Ctrl+C to stop the app
echo.
pause 