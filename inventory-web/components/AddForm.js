import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

const AddForm = ({ onBack }) => {
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchasedBy, setPurchasedBy] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  const handleAdd = () => {
    // Add logic to send data to backend here
    console.log({ item, qty, purchasePrice, purchasedBy, sellingPrice });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.label}>Item Name</Text>
        <TextInput style={styles.input} value={item} onChangeText={setItem} placeholder="e.g. Pen" />

        <Text style={styles.label}>Quantity</Text>
        <TextInput style={styles.input} value={qty} onChangeText={setQty} keyboardType="numeric" placeholder="e.g. 10" />

        <Text style={styles.label}>Purchase Price</Text>
        <TextInput style={styles.input} value={purchasePrice} onChangeText={setPurchasePrice} keyboardType="numeric" placeholder="e.g. 5.00" />

        <Text style={styles.label}>Purchased By</Text>
        <TextInput style={styles.input} value={purchasedBy} onChangeText={setPurchasedBy} placeholder="e.g. Jasleen" />

        <Text style={styles.label}>Selling Price</Text>
        <TextInput style={styles.input} value={sellingPrice} onChangeText={setSellingPrice} keyboardType="numeric" placeholder="e.g. 7.50" />

        <Pressable style={styles.submitBtn} onPress={handleAdd}>
          <Text style={styles.submitText}>➕ Add Item</Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>← Back to Home</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 3
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff'
  },
  submitBtn: {
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center'
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center'
  },
  backText: {
    fontSize: 15,
    color: '#555'
  }
});

export default AddForm;
