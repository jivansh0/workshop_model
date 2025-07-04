# 📱 Standalone Inventory Management App

A completely self-contained React Native inventory management app that runs entirely on your phone **without needing any external server**. All data is stored locally on your device, making it perfect for offline use.

## ✨ Key Features

- 🚀 **No Server Required** - App runs completely on your phone
- 💾 **Local Storage** - Data stored securely on your device using AsyncStorage
- 🌐 **Offline Ready** - Works without internet connection
- 📱 **Mobile Optimized** - Native mobile experience with React Native
- 💰 **Indian Currency** - Prices displayed in ₹ (Rupees)
- 🔍 **Smart Search** - Autocomplete and intelligent item suggestions
- 📊 **Dashboard** - Real-time inventory analytics and insights

## 🏗️ Architecture

```
📱 Mobile App (React Native + Expo)
├── 🎨 User Interface (React Native Components)
├── 💾 Local Storage (AsyncStorage)
├── 🔧 DirectSheetsService (Local CRUD Operations)
├── 📊 Dashboard & Analytics
└── 🔍 Autocomplete & Search
```

## 🚀 Quick Start

### Windows Users
```bash
# Run the standalone app
start_standalone_app.bat
```

### Mac/Linux Users
```bash
# Make executable and run
chmod +x start_standalone_app.sh
./start_standalone_app.sh
```

### Manual Start
```bash
cd inventory-web
npm install
npx expo start
```

## 📦 Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Expo Go app** on your phone - ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## 🔑 Google Sheets Setup (Optional)

If you want to use Google Sheets integration instead of local storage, you'll need to:

1. **Create a Google Service Account:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google Sheets API
   - Create a service account and download the JSON credentials file

2. **Add Credentials:**
   - Place your service account JSON file in the `model/` directory
   - Name it something like `your-project-credentials.json`
   - Update the filename in `inventory_crud.py` if needed

3. **Share Google Sheets:**
   - Create a Google Sheets document
   - Share it with the service account email (found in the JSON file)
   - Give "Editor" permissions

**Note:** The service account JSON file is not included in this repository for security reasons. You must provide your own credentials.

## 📱 Core Features

### 📱 **Main Navigation**
- **Dashboard** - Overview & Stats
- **Add Items** - Purchase new inventory
- **Sales** - Sell items & log transactions
- **Update Items** - Modify existing items
- **View Items** - Search & view details
- **Inventory Sheet** - All items list
- **Purchase History** - Track all purchases
- **Sales History** - Track all sales

### 💾 **Data Storage**
- **Inventory Items**: Stored in `inventory_items` (AsyncStorage)
- **Purchase History**: Stored in `purchase_items` (AsyncStorage)
- **Sales History**: Stored in `sales_items` (AsyncStorage)

## 🎯 Usage Guide

### 1. Adding Items
1. Go to **"Add Items"** section
2. Fill in item details:
   - Item Name
   - Quantity
   - Purchase Price (₹)
   - Selling Price (₹)
   - Purchased By
3. Tap **"Add Item"**
4. Item is saved locally instantly

### 2. Making Sales
1. Go to **"Sales"** section
2. Use autocomplete to select item
3. Enter quantity to sell
4. Enter customer name
5. Tap **"Sell Item"**
6. Inventory automatically updated

### 3. Updating Items
1. Go to **"Update Items"** section
2. Use autocomplete to select item
3. Choose field to update:
   - Quantity
   - Purchase Price
   - Selling Price
4. Enter new value
5. Tap **"Update"**

### 4. Viewing Items
1. Go to **"View Items"** section
2. Use autocomplete to search
3. View complete item details
4. See purchase and sales history

## 📱 Building APK (Android)

To create an installable APK for your Android device:

```bash
# Windows users
build_standalone_apk.bat

# Mac/Linux users
cd inventory-web
npx eas build --platform android --profile production
```

## 🔧 Project Structure

```
├── inventory-web/              # React Native App
│   ├── components/             # UI Components
│   │   ├── AddForm.js         # Add new items
│   │   ├── DeleteForm.js      # Sell items (process sales)
│   │   ├── UpdateForm.js      # Update items
│   │   ├── ViewForm.js        # View item details
│   │   └── AutocompleteInput.js
│   ├── services/              # Business Logic
│   │   ├── ApiService.js      # Main service layer
│   │   └── DirectSheetsService.js # Local storage operations
│   ├── navigation/            # App Navigation
│   │   └── DrawerNavigator.js
│   └── assets/               # Images & Icons
├── start_standalone_app.bat   # Windows launcher
├── start_standalone_app.sh    # Mac/Linux launcher
├── build_standalone_apk.bat   # APK builder
└── README.md                 # This file
```

## 🚀 Benefits of Standalone App

### ✅ Advantages
- **No Internet Required** - Works completely offline
- **Fast Performance** - No network delays
- **Data Privacy** - All data stays on your device
- **No Server Costs** - No hosting or maintenance fees
- **Instant Startup** - No server connection needed
- **Reliable** - No network failures

### ⚠️ Considerations
- **Data Backup** - Remember to backup your device
- **Device Storage** - Limited by phone storage
- **Multi-device** - Data doesn't sync across devices
- **Data Loss Risk** - If phone is lost/broken

## 🛠️ Troubleshooting

### Common Issues

#### App Won't Start
```bash
# Clear cache and reinstall
cd inventory-web
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

#### Data Not Saving
- Check device storage space
- Restart the app
- Clear app cache in device settings

#### Autocomplete Not Working
- Add some sample items first
- Restart the app

### Debug Mode
```bash
# Start with detailed logging
cd inventory-web
npx expo start --dev-client
```

## 🎉 Getting Started

1. **Install Expo Go** on your phone
2. **Run the app** using `start_standalone_app.bat` (Windows) or `start_standalone_app.sh` (Mac/Linux)
3. **Scan the QR code** with Expo Go app
4. **Start managing** your inventory offline!

Your inventory management app now runs completely on your phone! 

**Happy Inventory Management! 🎊**
