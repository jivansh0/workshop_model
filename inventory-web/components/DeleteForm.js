import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import ApiService from '../services/ApiService';
import AutocompleteInput from './AutocompleteInput';

const DeleteForm = ({ onBack }) => {
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('');
  const [soldTo, setSoldTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemSelect = (itemData) => {
    setSelectedItem(itemData);
    // Auto-suggest max quantity available
    if (itemData.quantity && !qty) {
      // Don't auto-set, just show available quantity
    }
  };

  const handleSell = async () => {
    if (!item || !qty || !soldTo) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Check if item exists in inventory
    if (!selectedItem) {
      Alert.alert(
        'Item Not Found', 
        'This item is not in inventory. Please check the item name or add it first.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Check if quantity is valid
    const requestedQty = parseInt(qty);
    const availableQty = parseInt(selectedItem.quantity);
    
    if (requestedQty > availableQty) {
      Alert.alert(
        'Insufficient Stock', 
        `You want to sell ${requestedQty} but only ${availableQty} available in stock.`,
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.deleteItem({
        item,
        qty,
        soldTo
      });

      Alert.alert(
        'Sale Successful! 🎉', 
        response.message,
        [
          {
            text: 'Sell Another',
            onPress: () => {
              setItem('');
              setQty('');
              setSoldTo('');
              setSelectedItem(null);
            }
          },
          {
            text: 'Back to Home',
            onPress: onBack
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to sell item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Name</Text>
      <AutocompleteInput
        value={item}
        onChangeText={setItem}
        onItemSelect={handleItemSelect}
        placeholder="Start typing item name..."
        editable={!loading}
      />

      {selectedItem && (
        <View style={styles.itemInfo}>
          <Text style={styles.infoText}>
            💰 Price: ₹{selectedItem.sellingPrice} | 📦 Available: {selectedItem.quantity}
          </Text>
        </View>
      )}

      <Text style={styles.label}>Quantity to Sell</Text>
      <TextInput 
        style={styles.input} 
        value={qty} 
        onChangeText={setQty} 
        keyboardType="numeric" 
        placeholder={selectedItem ? `Max: ${selectedItem.quantity}` : "e.g. 3"}
        editable={!loading}
      />

      <Text style={styles.label}>Sold To</Text>
      <TextInput 
        style={styles.input} 
        value={soldTo} 
        onChangeText={setSoldTo} 
        placeholder="Customer name or business"
        editable={!loading}
      />

      <Pressable 
        style={[styles.submitBtn, loading && styles.disabledBtn]} 
        onPress={handleSell}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>💰 Sell Item</Text>
        )}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  itemInfo: {
    backgroundColor: '#e8f5e8',
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
    marginBottom: 10,
  },
  infoText: {
    color: '#2e7d32',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: '#e53935',
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
});

export default DeleteForm;
