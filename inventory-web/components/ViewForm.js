import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import ApiService from '../services/ApiService';
import AutocompleteInput from './AutocompleteInput';

const ViewForm = ({ onBack }) => {
  const [itemName, setItemName] = useState('');
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemSelect = (itemData) => {
    setSelectedItem(itemData);
  };

  const handleView = async () => {
    if (!itemName) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    if (!selectedItem) {
      Alert.alert(
        'Item Not Found', 
        'This item is not in inventory. Please check the item name.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.viewItemEnhanced(itemName);
      setItemData(response);
    } catch (error) {
      Alert.alert('Error', error.message || 'Item not found');
      setItemData(null);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setItemData(null);
    setItemName('');
    setSelectedItem(null);
  };

  const renderInventorySection = () => {
    if (!itemData?.inventory) return null;

    const inventory = itemData.inventory;
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>📦 Current Inventory</Text>
        <View style={styles.inventoryCard}>
          <View style={styles.inventoryRow}>
            <Text style={styles.fieldLabel}>Item Name:</Text>
            <Text style={styles.fieldValue}>{inventory.itemName}</Text>
          </View>
          <View style={styles.inventoryRow}>
            <Text style={styles.fieldLabel}>Current Stock:</Text>
            <Text style={[styles.fieldValue, styles.quantityText]}>{inventory.quantity} units</Text>
          </View>
          <View style={styles.inventoryRow}>
            <Text style={styles.fieldLabel}>Purchase Price:</Text>
            <Text style={styles.fieldValue}>₹{inventory.purchasePrice}</Text>
          </View>
          <View style={styles.inventoryRow}>
            <Text style={styles.fieldLabel}>Selling Price:</Text>
            <Text style={styles.fieldValue}>₹{inventory.sellingPrice}</Text>
          </View>
          <View style={styles.inventoryRow}>
            <Text style={styles.fieldLabel}>Status:</Text>
            <Text style={[
              styles.fieldValue, 
              inventory.status === 'In Stock' ? styles.inStock : styles.outOfStock
            ]}>
              {inventory.status}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderIncomingSection = () => {
    if (!itemData?.incomingHistory) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          📥 Purchase History - {itemData.totalIncoming} entries
        </Text>
        {itemData.incomingHistory.length > 0 ? (
          <View style={styles.historyContainer}>
            {itemData.incomingHistory.map((entry, index) => (
              <View key={index} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyIndex}>Entry #{index + 1}</Text>
                  <Text style={styles.historyDate}>{entry.date}</Text>
                </View>
                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>Quantity Added:</Text>
                  <Text style={styles.historyValue}>{entry.quantity} units</Text>
                </View>
                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>Purchase Price:</Text>
                  <Text style={styles.historyValue}>₹{entry.purchasePrice}</Text>
                </View>
                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>Purchased By:</Text>
                  <Text style={styles.historyValue}>{entry.purchasedBy}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>No purchase records found</Text>
        )}
      </View>
    );
  };

  const renderSalesSection = () => {
    if (!itemData?.salesHistory) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          💰 Sales History - {itemData.totalSales} entries
        </Text>
        {itemData.salesHistory.length > 0 ? (
          <View style={styles.historyContainer}>
            {itemData.salesHistory.map((entry, index) => (
              <View key={index} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyIndex}>Sale #{index + 1}</Text>
                  <Text style={styles.historyDate}>{entry.date}</Text>
                </View>
                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>Quantity Sold:</Text>
                  <Text style={styles.historyValue}>{entry.quantity} units</Text>
                </View>
                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>Selling Price:</Text>
                  <Text style={styles.historyValue}>₹{entry.sellingPrice}</Text>
                </View>
                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>Sold To:</Text>
                  <Text style={styles.historyValue}>{entry.soldTo}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noDataText}>No sales records found</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Name</Text>
      <AutocompleteInput
        value={itemName}
        onChangeText={setItemName}
        onItemSelect={handleItemSelect}
        placeholder="Start typing item name..."
        editable={!loading}
      />

      <Pressable 
        style={[styles.submitBtn, loading && styles.disabledBtn]} 
        onPress={handleView}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>🔍 View Complete Details</Text>
        )}
      </Pressable>

      {itemData && (
        <View style={styles.resultsContainer}>
          {renderInventorySection()}
          {renderIncomingSection()}
          {renderSalesSection()}
          
          <View style={styles.actionButtons}>
            <Pressable style={styles.clearBtn} onPress={clearResults}>
              <Text style={styles.clearText}>🔄 Search Another</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Back to Home</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 8,
    color: '#333',
    fontSize: 16,
  },
  submitBtn: {
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledBtn: {
    backgroundColor: '#9e9e9e',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  resultsContainer: {
    marginTop: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  inventoryCard: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  inventoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2e7d32',
    flex: 1,
  },
  fieldValue: {
    fontSize: 15,
    color: '#1b5e20',
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  inStock: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  outOfStock: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  historyContainer: {
    // Regular view container for history items
  },
  historyCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    marginVertical: 4,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#2196f3',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyIndex: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  historyLabel: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  historyValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    padding: 20,
  },
  actionButtons: {
    marginTop: 20,
    alignItems: 'center',
  },
  clearBtn: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  clearText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    padding: 10,
  },
  backText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
  }
});

export default ViewForm;
