import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

const DeleteForm = ({ onBack }) => {
  const [item, setItem] = useState('');
  const [qty, setQty] = useState('');
  const [soldTo, setSoldTo] = useState('');

  const handleDelete = () => {
    console.log({ item, qty, soldTo });
  };

  return (
   <ScrollView contentContainerStyle={styles.scrollContent}>
  <View style={styles.container}>
    <Text style={styles.label}>Item Name</Text>
    <TextInput style={styles.input} value={item} onChangeText={setItem} placeholder="e.g. Pen" />

    <Text style={styles.label}>Quantity to Sell</Text>
    <TextInput style={styles.input} value={qty} onChangeText={setQty} keyboardType="numeric" placeholder="e.g. 3" />

    <Text style={styles.label}>Sold To</Text>
    <TextInput style={styles.input} value={soldTo} onChangeText={setSoldTo} placeholder="e.g. Customer A" />

    <Pressable style={styles.submitBtn} onPress={handleDelete}>
      <Text style={styles.submitText}>🗑 Delete Item</Text>
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
    backgroundColor: '#e53935',
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

export default DeleteForm;
