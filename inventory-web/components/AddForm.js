import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import ApiService from '../services/ApiService';

const AddForm = ({ onBack }) => {
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchasedBy, setPurchasedBy] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!item || !qty || !purchasePrice || !purchasedBy || !sellingPrice) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.addItem({
        item,
        qty,
        purchasePrice,
        purchasedBy,
        sellingPrice
      });

      Alert.alert(
        'Success', 
        response.message,
        [
          {
            text: 'Add Another',
            onPress: () => {
              setItem('');
              setQty('');
              setPurchasePrice('');
              setPurchasedBy('');
              setSellingPrice('');
            }
          },
          {
            text: 'Back to Home',
            onPress: onBack
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Name</Text>
      <TextInput 
        style={styles.input} 
        value={item} 
        onChangeText={setItem} 
        placeholder="e.g. Pen"
        editable={!loading}
      />

      <Text style={styles.label}>Quantity</Text>
      <TextInput 
        style={styles.input} 
        value={qty} 
        onChangeText={setQty} 
        keyboardType="numeric" 
        placeholder="e.g. 10"
        editable={!loading}
      />

      <Text style={styles.label}>Purchase Price</Text>
      <TextInput 
        style={styles.input} 
        value={purchasePrice} 
        onChangeText={setPurchasePrice} 
        keyboardType="numeric" 
        placeholder="e.g. 5.00"
        editable={!loading}
      />

      <Text style={styles.label}>Purchased By</Text>
      <TextInput 
        style={styles.input} 
        value={purchasedBy} 
        onChangeText={setPurchasedBy} 
        placeholder="e.g. Leonardo DiCaprio"
        editable={!loading}
      />

      <Text style={styles.label}>Selling Price</Text>
      <TextInput 
        style={styles.input} 
        value={sellingPrice} 
        onChangeText={setSellingPrice} 
        keyboardType="numeric" 
        placeholder="e.g. 7.50"
        editable={!loading}
      />

      <Pressable 
        style={[styles.submitBtn, loading && styles.disabledBtn]} 
        onPress={handleAdd}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>➕ Add Item</Text>
        )}
      </Pressable>

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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  submitBtn: {
    backgroundColor: '#3f51b5',
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

export default AddForm;
