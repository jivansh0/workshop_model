#!/bin/bash

echo ""
echo "================================================================"
echo "🚀 Starting Standalone Inventory Management App"
echo "================================================================"
echo ""
echo "✅ This app runs completely on your phone - no server needed!"
echo "✅ Data is stored locally on your device"
echo "✅ Works offline and online"
echo ""

cd inventory-web

echo "📱 Installing React Native dependencies..."
npm install

echo ""
echo "🚀 Starting React Native app..."
echo ""
echo "📋 Options:"
echo "  [a] Android device/emulator"
echo "  [i] iOS simulator"
echo "  [w] Web browser"
echo "  [s] Start normally (scan QR code)"
echo ""

read -p "Choose option (a/i/w/s): " choice

case $choice in
    [Aa]* )
        echo "📱 Starting for Android..."
        npx expo start --android
        ;;
    [Ii]* )
        echo "📱 Starting for iOS..."
        npx expo start --ios
        ;;
    [Ww]* )
        echo "🌐 Starting in web browser..."
        npx expo start --web
        ;;
    * )
        echo "📱 Starting with QR code (default)..."
        npx expo start
        ;;
esac

echo ""
echo "✅ App launched successfully!"
echo "📱 Scan the QR code with Expo Go app to test on your phone"
echo "🛑 Press Ctrl+C to stop the app"
echo "" 