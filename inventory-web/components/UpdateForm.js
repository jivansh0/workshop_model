import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import ApiService from '../services/ApiService';
import AutocompleteInput from './AutocompleteInput';

const UpdateForm = ({ onBack }) => {
  const [item, setItem] = useState('');
  const [field, setField] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemSelect = (itemData) => {
    setSelectedItem(itemData);
    // Clear field and value when item changes
    setField('');
    setValue('');
  };

  const handleFieldSelect = (selectedField) => {
    setField(selectedField);
    // Pre-fill current value for the selected field
    if (selectedItem) {
      switch (selectedField.toLowerCase()) {
        case 'quantity':
          setValue(selectedItem.quantity);
          break;
        case 'purchase':
          setValue(selectedItem.purchasePrice);
          break;
        case 'selling':
          setValue(selectedItem.sellingPrice);
          break;
        default:
          setValue('');
      }
    }
  };

  const handleUpdate = async () => {
    if (!item || !field || !value) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Check if item exists in inventory
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
      const response = await ApiService.updateItem({
        item,
        field,
        value
      });

      Alert.alert(
        'Update Successful! ✅', 
        response.message,
        [
          {
            text: 'Update Another Field',
            onPress: () => {
              setField('');
              setValue('');
            }
          },
          {
            text: 'Update Another Item',
            onPress: () => {
              setItem('');
              setField('');
              setValue('');
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
      Alert.alert('Error', error.message || 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const fieldOptions = ['quantity', 'purchase', 'selling'];

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
          <Text style={styles.infoText}>Current Values:</Text>
          <Text style={styles.currentValue}>Quantity: {selectedItem.quantity}</Text>
          <Text style={styles.currentValue}>Purchase Price: ₹{selectedItem.purchasePrice}</Text>
          <Text style={styles.currentValue}>Selling Price: ₹{selectedItem.sellingPrice}</Text>
        </View>
      )}

      <Text style={styles.label}>Field to Update</Text>
      <View style={styles.fieldContainer}>
        {fieldOptions.map((option) => (
          <Pressable
            key={option}
            style={[
              styles.fieldOption,
              field === option && styles.selectedField
            ]}
            onPress={() => handleFieldSelect(option)}
            disabled={loading}
          >
            <Text style={[
              styles.fieldText,
              field === option && styles.selectedFieldText
            ]}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>New Value</Text>
      <TextInput 
        style={styles.input} 
        value={value} 
        onChangeText={setValue} 
        placeholder={
          field === 'quantity' ? 'Enter new quantity' :
          field === 'purchase' ? 'Enter new purchase price' :
          field === 'selling' ? 'Enter new selling price' :
          'Select a field first'
        }
        keyboardType={field === 'quantity' ? 'numeric' : 'decimal-pad'}
        editable={!loading && field !== ''}
      />

      <Pressable 
        style={[styles.submitBtn, loading && styles.disabledBtn]} 
        onPress={handleUpdate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>✏️ Update Item</Text>
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
    backgroundColor: '#f3e5f5',
    padding: 12,
    borderRadius: 6,
    marginTop: 5,
    marginBottom: 10,
  },
  infoText: {
    color: '#7b1fa2',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
  },
  currentValue: {
    color: '#7b1fa2',
    fontSize: 14,
    marginBottom: 2,
  },
  fieldContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  fieldOption: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedField: {
    backgroundColor: '#ff9800',
    borderColor: '#ff9800',
  },
  fieldText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedFieldText: {
    color: '#fff',
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#ff9800',
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

export default UpdateForm;
