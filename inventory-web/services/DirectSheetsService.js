import AsyncStorage from '@react-native-async-storage/async-storage';

// Google Sheets API configuration
const SPREADSHEET_ID = '1Q9X6ZKALGzJ_qWz2nrRgKjMb8gE_HVhQ7mC2vBpJnPkS'; // Replace with your actual spreadsheet ID
const API_KEY = 'YOUR_GOOGLE_API_KEY'; // You'll need to create this

// Service Account credentials (embedded - in production, use secure storage)
const SERVICE_ACCOUNT = {
  type: "service_account",
  project_id: "crudproject-463112",
  private_key_id: "bf75339f029d3a5a8f7b6c1a2b0e5f3d4e8c9a1b",
  private_key: "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  client_email: "inventory-service@crudproject-463112.iam.gserviceaccount.com",
  client_id: "123456789012345678901",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/inventory-service%40crudproject-463112.iam.gserviceaccount.com"
};

const SHEETS_BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

class DirectSheetsService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Get OAuth2 access token
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    try {
      // Create JWT token
      const jwt = await this.createJWT();
      
      // Exchange JWT for access token
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
      });

      const data = await response.json();
      
      if (data.access_token) {
        this.accessToken = data.access_token;
        this.tokenExpiry = Date.now() + (data.expires_in * 1000);
        return this.accessToken;
      } else {
        throw new Error('Failed to get access token');
      }
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  // Create JWT token (simplified version)
  async createJWT() {
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    const payload = {
      iss: SERVICE_ACCOUNT.client_email,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    };

    // Note: For production, you'd need a proper JWT library
    // This is a simplified version that would need crypto implementation
    return 'jwt_token_placeholder';
  }

  // Simplified version - direct API calls without authentication
  async makeRequest(url, options = {}) {
    try {
      // For now, use a simpler approach with local storage
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Request failed:', error);
      // Return cached data if available
      return await this.getCachedData(url);
    }
  }

  // Local storage methods
  async saveToLocal(key, data) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }

  async getFromLocal(key) {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting from local storage:', error);
      return null;
    }
  }

  async getCachedData(url) {
    const key = `cache_${url}`;
    return await this.getFromLocal(key);
  }

  // CRUD Operations with local fallback
  async addItem(itemData) {
    try {
      // Save to inventory
      const localItems = await this.getFromLocal('inventory_items') || [];
      const newItem = {
        id: Date.now().toString(),
        ...itemData,
        dateAdded: new Date().toISOString(),
        synced: false
      };
      
      localItems.push(newItem);
      await this.saveToLocal('inventory_items', localItems);

      // Also save to purchase history
      const purchaseHistory = await this.getFromLocal('purchase_items') || [];
      const purchaseRecord = {
        id: Date.now().toString() + '_purchase',
        itemName: itemData.itemName,
        quantity: itemData.quantity,
        purchasePrice: itemData.purchasePrice,
        purchasedBy: itemData.purchasedBy || 'Unknown',
        date: new Date().toISOString(),
        synced: false
      };
      
      purchaseHistory.push(purchaseRecord);
      await this.saveToLocal('purchase_items', purchaseHistory);

      // Try to sync with Google Sheets
      await this.syncToSheets();

      return {
        success: true,
        message: 'Item added successfully',
        item: newItem
      };
    } catch (error) {
      console.error('Error adding item:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteItem(itemName, quantity, soldTo) {
    try {
      const localItems = await this.getFromLocal('inventory_items') || [];
      const itemIndex = localItems.findIndex(item => 
        item.itemName.toLowerCase() === itemName.toLowerCase()
      );

      if (itemIndex === -1) {
        return {
          success: false,
          error: 'Item not found'
        };
      }

      const item = localItems[itemIndex];
      const currentQty = parseInt(item.quantity);

      if (quantity > currentQty) {
        return {
          success: false,
          error: `Cannot sell ${quantity}. Only ${currentQty} in stock.`
        };
      }

      // Log sale
      const sales = await this.getFromLocal('sales_items') || [];
      sales.push({
        id: Date.now().toString(),
        itemName: item.itemName,
        quantity: quantity,
        sellingPrice: item.sellingPrice,
        soldTo: soldTo,
        date: new Date().toISOString(),
        synced: false
      });
      await this.saveToLocal('sales_items', sales);

      // Update inventory
      if (quantity === currentQty) {
        localItems.splice(itemIndex, 1);
      } else {
        localItems[itemIndex].quantity = (currentQty - quantity).toString();
        localItems[itemIndex].synced = false;
      }

      await this.saveToLocal('inventory_items', localItems);
      await this.syncToSheets();

      return {
        success: true,
        message: quantity === currentQty ? 
          'Item sold completely and removed from inventory' : 
          `Sold ${quantity}. Remaining: ${currentQty - quantity}`,
        remaining: currentQty - quantity
      };
    } catch (error) {
      console.error('Error deleting item:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateItem(itemName, field, value) {
    try {
      const localItems = await this.getFromLocal('inventory_items') || [];
      const itemIndex = localItems.findIndex(item => 
        item.itemName.toLowerCase() === itemName.toLowerCase()
      );

      if (itemIndex === -1) {
        return {
          success: false,
          error: 'Item not found'
        };
      }

      // Update the field
      const fieldMap = {
        'quantity': 'quantity',
        'qty': 'quantity',
        'purchase': 'purchasePrice',
        'purchase price': 'purchasePrice',
        'purchaseprice': 'purchasePrice',
        'selling': 'sellingPrice',
        'selling price': 'sellingPrice',
        'sellingprice': 'sellingPrice'
      };

      const actualField = fieldMap[field.toLowerCase()];
      if (!actualField) {
        return {
          success: false,
          error: "Invalid field. Use 'quantity', 'purchase', or 'selling'"
        };
      }

      localItems[itemIndex][actualField] = value;
      localItems[itemIndex].synced = false;

      await this.saveToLocal('inventory_items', localItems);
      await this.syncToSheets();

      return {
        success: true,
        message: `${field} updated to ${actualField === 'quantity' ? value : '₹' + value}`,
        item: localItems[itemIndex].itemName,
        field: field,
        newValue: value
      };
    } catch (error) {
      console.error('Error updating item:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async viewItem(itemName) {
    try {
      const localItems = await this.getFromLocal('inventory_items') || [];
      const item = localItems.find(item => 
        item.itemName.toLowerCase() === itemName.toLowerCase()
      );

      if (!item) {
        return {
          success: false,
          error: 'Item not found'
        };
      }

      return {
        success: true,
        item: {
          ...item,
          status: parseInt(item.quantity) > 0 ? 'In Stock' : 'Out of Stock'
        }
      };
    } catch (error) {
      console.error('Error viewing item:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getAllItems() {
    try {
      const localItems = await this.getFromLocal('inventory_items') || [];
      return {
        success: true,
        items: localItems.map(item => ({
          name: item.itemName,
          quantity: item.quantity,
          purchasePrice: item.purchasePrice,
          sellingPrice: item.sellingPrice
        }))
      };
    } catch (error) {
      console.error('Error getting all items:', error);
      return {
        success: false,
        items: []
      };
    }
  }

  async getSheetData(sheetName) {
    try {
      let localData = [];
      
      if (sheetName === 'inventory') {
        localData = await this.getFromLocal('inventory_items') || [];
      } else if (sheetName === 'purchase') {
        localData = await this.getFromLocal('purchase_items') || [];
      } else if (sheetName === 'sales') {
        localData = await this.getFromLocal('sales_items') || [];
      }

      // Ensure data is always an array
      if (!Array.isArray(localData)) {
        localData = [];
      }

      return {
        success: true,
        sheet: sheetName,
        headers: this.getHeaders(sheetName),
        data: localData
      };
    } catch (error) {
      console.error('Error getting sheet data:', error);
      return {
        success: false,
        error: error.message,
        sheet: sheetName,
        headers: this.getHeaders(sheetName),
        data: []
      };
    }
  }

  getHeaders(sheetName) {
    const headerMap = {
      'inventory': ['Item Name', 'Quantity', 'Purchase Price', 'Selling Price'],
      'purchase': ['Item Name', 'Quantity', 'Purchase Price', 'Purchased By', 'Date'],
      'sales': ['Item Name', 'Quantity', 'Selling Price', 'Sold To', 'Date']
    };
    return headerMap[sheetName] || [];
  }

  async getDashboardStats() {
    try {
      const localItems = await this.getFromLocal('inventory_items') || [];
      const salesData = await this.getFromLocal('sales_items') || [];

      let totalValue = 0;
      let lowStockItems = 0;

      localItems.forEach(item => {
        const quantity = parseInt(item.quantity) || 0;
        const sellingPrice = parseFloat(item.sellingPrice) || 0;
        totalValue += quantity * sellingPrice;
        
        if (quantity < 10) {
          lowStockItems++;
        }
      });

      return {
        success: true,
        stats: {
          totalItems: localItems.length,
          totalValue: Math.round(totalValue * 100) / 100,
          lowStockItems: lowStockItems,
          totalSales: salesData.length
        }
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async viewItemEnhanced(itemName) {
    try {
      const inventory = await this.getFromLocal('inventory_items') || [];
      const purchases = await this.getFromLocal('purchase_items') || [];
      const sales = await this.getFromLocal('sales_items') || [];

      const inventoryItem = inventory.find(item => 
        item.itemName.toLowerCase() === itemName.toLowerCase()
      );

      if (!inventoryItem) {
        return {
          success: false,
          error: 'Item not found in inventory'
        };
      }

      const incomingHistory = purchases.filter(item => 
        item.itemName.toLowerCase() === itemName.toLowerCase()
      );

      const salesHistory = sales.filter(item => 
        item.itemName.toLowerCase() === itemName.toLowerCase()
      );

      return {
        success: true,
        inventory: {
          ...inventoryItem,
          status: parseInt(inventoryItem.quantity) > 0 ? 'In Stock' : 'Out of Stock'
        },
        incomingHistory: incomingHistory,
        salesHistory: salesHistory,
        totalIncoming: incomingHistory.length,
        totalSales: salesHistory.length
      };
    } catch (error) {
      console.error('Error viewing enhanced item:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Sync with Google Sheets (placeholder - would need proper implementation)
  async syncToSheets() {
    try {
      // This would implement the actual Google Sheets sync
      // For now, just mark items as synced
      const items = await this.getFromLocal('inventory_items') || [];
      const sales = await this.getFromLocal('sales_items') || [];
      const purchases = await this.getFromLocal('purchase_items') || [];
      
      // Mark all as synced (placeholder)
      items.forEach(item => item.synced = true);
      sales.forEach(sale => sale.synced = true);
      purchases.forEach(purchase => purchase.synced = true);
      
      await this.saveToLocal('inventory_items', items);
      await this.saveToLocal('sales_items', sales);
      await this.saveToLocal('purchase_items', purchases);
      
      console.log('Data synced to local storage');
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }

  // Initialize with sample data
  async initializeData() {
    try {
      const existingItems = await this.getFromLocal('inventory_items');
      if (!existingItems || existingItems.length === 0) {
        const sampleData = [
          {
            id: '1',
            itemName: 'Sample Laptop',
            quantity: '5',
            purchasePrice: '25000',
            sellingPrice: '30000',
            dateAdded: new Date().toISOString(),
            synced: true
          },
          {
            id: '2',
            itemName: 'Sample Phone',
            quantity: '8',
            purchasePrice: '15000',
            sellingPrice: '18000',
            dateAdded: new Date().toISOString(),
            synced: true
          },
          {
            id: '3',
            itemName: 'Sample Headphones',
            quantity: '12',
            purchasePrice: '2000',
            sellingPrice: '2500',
            dateAdded: new Date().toISOString(),
            synced: true
          }
        ];
        await this.saveToLocal('inventory_items', sampleData);
        console.log('✅ Sample inventory data initialized');
      }

      // Initialize empty sales and purchase arrays if they don't exist
      const existingSales = await this.getFromLocal('sales_items');
      if (!existingSales) {
        await this.saveToLocal('sales_items', []);
        console.log('✅ Sales history initialized');
      }

      const existingPurchases = await this.getFromLocal('purchase_items');
      if (!existingPurchases || existingPurchases.length === 0) {
        const samplePurchases = [
          {
            id: 'p1',
            itemName: 'Sample Laptop',
            quantity: '5',
            purchasePrice: '25000',
            purchasedBy: 'Leonardo DiCaprio',
            date: new Date().toISOString(),
            synced: true
          },
          {
            id: 'p2',
            itemName: 'Sample Phone',
            quantity: '8',
            purchasePrice: '15000',
            purchasedBy: 'Leonardo DiCaprio',
            date: new Date().toISOString(),
            synced: true
          },
          {
            id: 'p3',
            itemName: 'Sample Headphones',
            quantity: '12',
            purchasePrice: '2000',
            purchasedBy: 'Leonardo DiCaprio',
            date: new Date().toISOString(),
            synced: true
          }
        ];
        await this.saveToLocal('purchase_items', samplePurchases);
        console.log('✅ Purchase history initialized with sample data');
      }
    } catch (error) {
      console.error('❌ Error initializing data:', error);
    }
  }
}

export default new DirectSheetsService(); 