import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

const ViewForm = ({ onBack }) => {
  const [itemName, setItemName] = useState('');

  const handleView = () => {
    console.log({ itemName });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
  <View style={styles.container}>
    <Text style={styles.label}>Item Name</Text>
    <TextInput style={styles.input} value={itemName} onChangeText={setItemName} placeholder="e.g. Pen" />

    <Pressable style={styles.submitBtn} onPress={handleView}>
      <Text style={styles.submitText}>🔍 View Item</Text>
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
    backgroundColor: '#4caf50',
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

export default ViewForm;
