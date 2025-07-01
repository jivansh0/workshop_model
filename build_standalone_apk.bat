@echo off
echo.
echo ================================================================
echo 🔨 Building Standalone Inventory Management APK
echo ================================================================
echo.
echo ✅ Building app that runs completely on phone
echo ✅ No server required - all data stored locally
echo ✅ Perfect for offline inventory management
echo.

cd inventory-web

echo 📱 Installing dependencies...
call npm install

echo.
echo 🔨 Building APK with EAS Build...
echo.
echo 📋 Build Options:
echo   [p] Production APK (optimized)
echo   [r] Preview APK (testing)
echo   [d] Development build
echo.

set /p choice="Choose build type (p/r/d): "

if /i "%choice%"=="p" (
    echo 🚀 Building Production APK...
    call npx eas build --platform android --profile production
) else if /i "%choice%"=="r" (
    echo 🧪 Building Preview APK...
    call npx eas build --platform android --profile preview
) else if /i "%choice%"=="d" (
    echo 🛠️ Building Development APK...
    call npx eas build --platform android --profile development
) else (
    echo 🚀 Building Production APK (default)...
    call npx eas build --platform android --profile production
)

echo.
echo ✅ APK build completed!
echo 📱 Download link will be shown above
echo 📲 Install the APK on your Android phone
echo 🎯 App will work completely offline!
echo.
pause 