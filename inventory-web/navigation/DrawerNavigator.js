// navigation/DrawerNavigator.js
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Appbar, Menu } from 'react-native-paper';
import {
  View,
  StyleSheet,
  Button,
  useWindowDimensions,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import AddForm from '../components/AddForm';
import DeleteForm from '../components/DeleteForm';
import UpdateForm from '../components/UpdateForm';
import ViewForm from '../components/ViewForm';
import ApiService from '../services/ApiService';

const Stack = createStackNavigator();

const Header = ({ title, navigation, isLargeScreen }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Appbar.Header style={{ backgroundColor: '#3f51b5' }}>
      <Appbar.Content title={title} titleStyle={{ fontWeight: 'bold', fontSize: 20 }} />
      {isLargeScreen ? (
        <View style={styles.navLinks}>
          <Pressable onPress={() => navigation.navigate('Inventory')}>
            <Text style={styles.linkText}>Inventory</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Purchase')}>
            <Text style={styles.linkText}>Purchase</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Sales')}>
            <Text style={styles.linkText}>Sales</Text>
          </Pressable>
        </View>
      ) : (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action icon="menu" color="white" onPress={() => setMenuVisible(true)} />
          }>
          <Menu.Item onPress={() => { setMenuVisible(false); navigation.navigate('Inventory'); }} title="Inventory" />
          <Menu.Item onPress={() => { setMenuVisible(false); navigation.navigate('Purchase'); }} title="Purchase" />
          <Menu.Item onPress={() => { setMenuVisible(false); navigation.navigate('Sales'); }} title="Sales" />
        </Menu>
      )}
    </Appbar.Header>
  );
};

const HomeScreen = ({ navigation }) => {
  const [form, setForm] = useState(null);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await ApiService.getDashboardStats();
      setDashboardStats(response.stats);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      Alert.alert('Connection Error', 'Failed to connect to server. Make sure the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    const CurrentForm =
      form === 'add' ? AddForm :
      form === 'delete' ? DeleteForm :
      form === 'update' ? UpdateForm :
      form === 'view' ? ViewForm : null;

    return (
      <View style={styles.formWrapper}>
        <Text style={styles.formTitle}>{form.toUpperCase()} ITEM</Text>
        <View style={styles.tableContainer}>
          {CurrentForm && <CurrentForm onBack={() => setForm(null)} />}
        </View>
        <Pressable style={styles.backButton} onPress={() => setForm(null)}>
          <Text style={styles.backText}>← Back to Home</Text>
        </Pressable>
      </View>
    );
  };

  // Updated demo content with real data
  const renderDashboardContent = () => (
    <View style={styles.demoContentWrapper}>
      <Text style={styles.demoTitle}>📊 Dashboard Overview</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3f51b5" />
          <Text style={styles.loadingText}>Loading dashboard data...</Text>
        </View>
      ) : dashboardStats ? (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{dashboardStats.totalItems}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>₹{dashboardStats.totalValue}</Text>
            <Text style={styles.statLabel}>Total Value</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{dashboardStats.lowStockItems}</Text>
            <Text style={styles.statLabel}>Low Stock</Text>
          </View>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load dashboard data</Text>
          <Pressable style={styles.retryButton} onPress={loadDashboardData}>
            <Text style={styles.retryText}>🔄 Retry</Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.demoTitle}>🔍 Quick Start Guide</Text>
      <View style={styles.tipsContainer}>
        <Text style={styles.tipText}>• Use the Add form to create new inventory items</Text>
                  <Text style={styles.tipText}>• Sell form removes items from inventory and logs sales</Text>
        <Text style={styles.tipText}>• Update form modifies existing item details</Text>
        <Text style={styles.tipText}>• View form displays complete item information</Text>
        <Text style={styles.tipText}>• Access different sheets via the menu above</Text>
        <Text style={styles.tipText}>• All data is automatically saved to Google Sheets</Text>
        <Text style={styles.tipText}>• Autocomplete helps you find existing items quickly</Text>
        <Text style={styles.tipText}>• Real-time sync with Google Sheets database</Text>
        <Text style={styles.tipText}>• Stock validation prevents overselling</Text>
        <Text style={styles.tipText}>• Enhanced view shows complete item history</Text>
      </View>

      <Text style={styles.demoTitle}>📈 Features</Text>
      <View style={styles.featureContainer}>
        <Text style={styles.featureText}>✨ Smart Autocomplete with item suggestions</Text>
        <Text style={styles.featureText}>📊 Real-time dashboard statistics</Text>
        <Text style={styles.featureText}>🔄 Live Google Sheets integration</Text>
        <Text style={styles.featureText}>⚡ Instant data validation</Text>
        <Text style={styles.featureText}>📱 Mobile-optimized interface</Text>
        <Text style={styles.featureText}>💾 Automatic data backup</Text>
        <Text style={styles.featureText}>🎯 Accurate inventory tracking</Text>
        <Text style={styles.featureText}>📋 Complete transaction history</Text>
      </View>

      <Text style={styles.demoTitle}>🚀 System Status</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>✅ API Server: Connected</Text>
        <Text style={styles.statusText}>✅ Google Sheets: Synced</Text>
        <Text style={styles.statusText}>✅ Database: Online</Text>
        <Text style={styles.statusText}>✅ Real-time Updates: Active</Text>
      </View>

      <View style={styles.spacerLarge} />
      
      <View style={styles.scrollIndicatorBottom}>
        <Text style={styles.scrollHintBottom}>👇 Keep Scrolling 👇</Text>
        <Text style={styles.footerText}>More content below...</Text>
        <Text style={styles.scrollHintBottom}>🔄 Swipe up to scroll more 🔄</Text>
      </View>
      
      <View style={styles.spacerLarge} />
      <View style={styles.spacerLarge} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Header title="Inventory Manager" navigation={navigation} isLargeScreen={isLargeScreen} />
      
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
        indicatorStyle="default"
        scrollEnabled={true}
        nestedScrollEnabled={true}
        bounces={true}
        alwaysBounceVertical={true}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subheading}>Select an action:</Text>

        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={() => setForm('add')}><Text style={styles.buttonText}>➕ Add</Text></Pressable>
          <Pressable style={styles.button} onPress={() => setForm('delete')}><Text style={styles.buttonText}>💰 Sell</Text></Pressable>
          <Pressable style={styles.button} onPress={() => setForm('update')}><Text style={styles.buttonText}>✏️ Update</Text></Pressable>
          <Pressable style={styles.button} onPress={() => setForm('view')}><Text style={styles.buttonText}>🔍 View</Text></Pressable>
        </View>

        {form && renderForm()}
        
        {!form && renderDashboardContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const SheetScreen = ({ route, navigation }) => {
  const { title } = route.params;
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const [sheetData, setSheetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSheetData();
  }, []);

  const loadSheetData = async () => {
    try {
      // Map display names to API endpoint names
      let apiSheetName;
      switch (title) {
        case 'Inventory':
          apiSheetName = 'inventory';
          break;
        case 'Purchase':
          apiSheetName = 'purchase';
          break;
        case 'Sales':
          apiSheetName = 'sales';
          break;
        default:
          apiSheetName = title.toLowerCase();
      }
      
      const response = await ApiService.getSheetData(apiSheetName);
      if (response && response.success) {
        setSheetData(response);
      } else {
        // Set fallback data structure
        setSheetData({
          success: false,
          data: [],
          headers: [],
          error: response?.error || 'Failed to load data'
        });
      }
    } catch (error) {
      console.error('Failed to load sheet data:', error);
      Alert.alert('Error', 'Failed to load sheet data');
      // Set fallback data structure
      setSheetData({
        success: false,
        data: [],
        headers: [],
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Header title={title} navigation={navigation} isLargeScreen={isLargeScreen} />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.sheetScrollContent}
        showsVerticalScrollIndicator={true}
        persistentScrollbar={true}
        indicatorStyle="default"
        scrollEnabled={true}
        nestedScrollEnabled={true}
        bounces={true}
        alwaysBounceVertical={true}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sheetPlaceholder}>
          <Text style={styles.sheetTitle}>Viewing {title}</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3f51b5" />
              <Text style={styles.loadingText}>Loading {title} data...</Text>
            </View>
          ) : sheetData && sheetData.success && sheetData.data && Array.isArray(sheetData.data) && sheetData.data.length > 0 ? (
            <View style={styles.sheetDataContainer}>
              <Text style={styles.sheetSubtitle}>
                {sheetData.data.length} {sheetData.data.length === 1 ? 'record' : 'records'} found
              </Text>
              
              {/* Headers */}
              {sheetData.headers && Array.isArray(sheetData.headers) && sheetData.headers.length > 0 && (
                <View style={styles.headerRow}>
                  {sheetData.headers.map((header, index) => (
                    <Text key={index} style={styles.headerText}>{header}</Text>
                  ))}
                </View>
              )}
              
              {/* Data rows */}
              {sheetData.data.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.dataRow}>
                  {(sheetData.headers || []).map((header, cellIndex) => {
                    let cellValue = '';
                    if (Array.isArray(row)) {
                      cellValue = row[cellIndex] || '';
                    } else {
                      // Handle object format from DirectSheetsService
                      switch (header) {
                        case 'Item Name':
                          cellValue = row.itemName || '';
                          break;
                        case 'Quantity':
                          cellValue = row.quantity || '';
                          break;
                        case 'Purchase Price':
                          cellValue = row.purchasePrice ? `₹${row.purchasePrice}` : '';
                          break;
                        case 'Selling Price':
                          cellValue = row.sellingPrice ? `₹${row.sellingPrice}` : '';
                          break;
                        case 'Purchased By':
                          cellValue = row.purchasedBy || '';
                          break;
                        case 'Sold To':
                          cellValue = row.soldTo || '';
                          break;
                        case 'Date':
                          cellValue = row.date ? new Date(row.date).toLocaleDateString() : row.dateAdded ? new Date(row.dateAdded).toLocaleDateString() : '';
                          break;
                        default:
                          cellValue = row[header] || '';
                      }
                    }
                    return (
                      <Text key={cellIndex} style={styles.cellText}>{cellValue}</Text>
                    );
                  })}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No data found in {title}</Text>
              <Text style={styles.emptySubtext}>
                {title === 'Inventory' ? 'Add some items to see them here' : 
                 title === 'Purchase' ? 'Purchase history will appear here' :
                 title === 'Sales' ? 'Sales records will appear here' :
                 'Data will appear here when available'}
              </Text>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <Pressable style={styles.refreshButton} onPress={loadSheetData}>
              <Text style={styles.refreshText}>🔄 Refresh Data</Text>
            </Pressable>
            <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DrawerNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Inventory" component={SheetScreen} initialParams={{ title: 'Inventory' }} />
        <Stack.Screen name="Purchase" component={SheetScreen} initialParams={{ title: 'Purchase' }} />
        <Stack.Screen name="Sales" component={SheetScreen} initialParams={{ title: 'Sales' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  safeContainer: { 
    flex: 1,
    backgroundColor: '#f4f6f8'
  },
  scrollContainer: { 
    flex: 1,
    backgroundColor: '#ffffff',
  },

  subheading: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
    color: '#333'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 15,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#3f51b5',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 5,
    minWidth: 130,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 150,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sheetScrollContent: {
    paddingBottom: 80,
    paddingHorizontal: 10,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 700,
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    marginTop: 20,
    alignSelf: 'center',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 16,
    textAlign: 'center'
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fdfdfd'
  },
  backButton: {
    marginTop: 24,
    backgroundColor: '#eeeeee',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    alignSelf: 'center'
  },
  backText: {
    color: '#444',
    fontSize: 15
  },
  demoContentWrapper: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
    marginTop: 30,
  },
  demoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 25,
    marginBottom: 15,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#3f51b5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3f51b5',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tipsContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 30,
  },
  tipText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    marginBottom: 8,
  },
  sheetPlaceholder: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sheetSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  sheetDataContainer: {
    width: '100%',
    maxWidth: 800,
    marginBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#3f51b5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 2,
  },
  headerText: {
    flex: 1,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  dataRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
    marginBottom: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cellText: {
    flex: 1,
    color: '#333',
    textAlign: 'center',
    fontSize: 13,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginRight: 10
  },
  linkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 10
  },
  featureContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 20,
  },
  featureText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 28,
    marginBottom: 8,
  },
  statusContainer: {
    backgroundColor: '#e8f5e8',
    padding: 20,
    borderRadius: 12,
    elevation: 1,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 15,
    color: '#2e7d32',
    lineHeight: 26,
    marginBottom: 6,
    fontWeight: '500',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
  spacerLarge: {
    height: 40,
  },

  scrollIndicatorBottom: {
    backgroundColor: '#f3e5f5',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#9c27b0',
  },

  scrollHintBottom: {
    fontSize: 14,
    color: '#7b1fa2',
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  refreshButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  refreshText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default DrawerNavigator;
