import DirectSheetsService from './DirectSheetsService';
import { Alert } from 'react-native';

class ApiService {
  constructor() {
    // Initialize data when service is created
    this.initializeApp();
  }

  async initializeApp() {
    try {
      await DirectSheetsService.initializeData();
      console.log('🚀 Standalone inventory app initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize app:', error);
    }
  }

  // Health check - always return success for offline app
  async checkHealth() {
    return {
      success: true,
      status: 'Offline Mode - Data stored locally',
      timestamp: new Date().toISOString()
    };
  }

  // Add item to inventory
  async addItem(itemData) {
    try {
      const result = await DirectSheetsService.addItem({
        itemName: itemData.item,
        quantity: parseInt(itemData.qty),
        purchasePrice: parseFloat(itemData.purchasePrice),
        purchasedBy: itemData.purchasedBy,
        sellingPrice: parseFloat(itemData.sellingPrice)
      });

      if (result.success) {
        Alert.alert('Success', 'Item added successfully!');
      }
      
      return result;
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item. Please try again.');
      throw error;
    }
  }

  // Delete/sell item from inventory
  async deleteItem(itemData) {
    try {
      const result = await DirectSheetsService.deleteItem(
        itemData.item,
        parseInt(itemData.qty),
        itemData.soldTo
      );

      if (result.success) {
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Error', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to process sale. Please try again.');
      throw error;
    }
  }

  // Update item in inventory
  async updateItem(itemData) {
    try {
      const result = await DirectSheetsService.updateItem(
        itemData.item,
        itemData.field,
        itemData.value
      );

      if (result.success) {
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Error', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item. Please try again.');
      throw error;
    }
  }

  // View specific item
  async viewItem(itemName) {
    try {
      const result = await DirectSheetsService.viewItem(itemName);
      
      if (!result.success) {
        Alert.alert('Not Found', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Error viewing item:', error);
      Alert.alert('Error', 'Failed to view item. Please try again.');
      throw error;
    }
  }

  // Get sheet data
  async getSheetData(sheetName) {
    try {
      const result = await DirectSheetsService.getSheetData(sheetName);
      return result;
    } catch (error) {
      console.error('Error getting sheet data:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const result = await DirectSheetsService.getDashboardStats();
      return result;
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        success: false,
        error: error.message,
        stats: {
          totalItems: 0,
          totalValue: 0,
          lowStockItems: 0,
          totalSales: 0
        }
      };
    }
  }

  // Get all items for autocomplete
  async getAllItems() {
    try {
      const result = await DirectSheetsService.getAllItems();
      return result;
    } catch (error) {
      console.error('Error getting all items:', error);
      return {
        success: false,
        items: []
      };
    }
  }

  // Enhanced view with all sheet data
  async viewItemEnhanced(itemName) {
    try {
      const result = await DirectSheetsService.viewItemEnhanced(itemName);
      
      if (!result.success) {
        Alert.alert('Not Found', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('Error viewing enhanced item:', error);
      Alert.alert('Error', 'Failed to view item details. Please try again.');
      throw error;
    }
  }
}

export default new ApiService(); 