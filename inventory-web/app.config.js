const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

export default {
  "expo": {
    "name": IS_DEV ? "Inventory Standalone (Dev)" : IS_PREVIEW ? "Inventory Standalone (Preview)" : "Inventory Manager - Standalone",
    "slug": "inventory-management-standalone",
    "version": "2.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": IS_DEV ? "com.inventory.app.dev" : IS_PREVIEW ? "com.inventory.app.preview" : "com.inventory.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": IS_DEV ? "com.inventory.app.dev" : IS_PREVIEW ? "com.inventory.app.preview" : "com.inventory.app",
      "versionCode": 1,
      "permissions": ["INTERNET", "ACCESS_NETWORK_STATE"]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "standalone": true,
      "offlineMode": true,
      "dataStorage": "local",
      "environment": process.env.APP_VARIANT || "standalone",
      "eas": {
        "projectId": "7c17f835-5a88-4a14-bad9-1a642f9b8ab9"
      }
    },
    "owner": "jivanshm"
  }
}; 