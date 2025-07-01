import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  ActivityIndicator 
} from 'react-native';
import ApiService from '../services/ApiService';

const AutocompleteInput = ({ 
  value, 
  onChangeText, 
  onItemSelect, 
  placeholder, 
  style,
  editable = true,
  showSuggestions = true 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllItems();
  }, []);

  const loadAllItems = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllItems();
      setAllItems(response.items || []);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (text) => {
    onChangeText(text);
    
    if (showSuggestions && text.length > 0) {
      const filtered = allItems.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestionsList(filtered.length > 0);
    } else {
      setShowSuggestionsList(false);
    }
  };

  const handleSuggestionSelect = (item) => {
    onChangeText(item.name);
    setShowSuggestionsList(false);
    if (onItemSelect) {
      onItemSelect(item);
    }
  };

  const checkItemExists = () => {
    if (!value || value.length < 2) return null;
    
    const exactMatch = allItems.find(item => 
      item.name.toLowerCase() === value.toLowerCase()
    );
    
    if (!exactMatch && value.length > 0 && showSuggestions) {
      return (
        <Text style={styles.warningText}>
          ⚠️ Item not in inventory. Check spelling or add new item first.
        </Text>
      );
    }
    
    if (exactMatch && showSuggestions) {
      return (
        <Text style={styles.successText}>
          ✅ Found: {exactMatch.name} (Qty: {exactMatch.quantity})
        </Text>
      );
    }
    
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, style]}
          value={value}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          editable={editable && !loading}
        />
        {loading && (
          <ActivityIndicator 
            style={styles.loadingIndicator} 
            size="small" 
            color="#3f51b5" 
          />
        )}
      </View>
      
      {checkItemExists()}
      
      {showSuggestionsList && showSuggestions && (
        <ScrollView 
          style={styles.suggestionsContainer}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          {suggestions.map((item, index) => (
            <Pressable
              key={index}
              style={styles.suggestionItem}
              onPress={() => handleSuggestionSelect(item)}
            >
              <View style={styles.suggestionContent}>
                <Text style={styles.suggestionName}>{item.name}</Text>
                <Text style={styles.suggestionDetails}>
                  Qty: {item.quantity} | ₹{item.sellingPrice}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  loadingIndicator: {
    position: 'absolute',
    right: 12,
  },
  suggestionsContainer: {
    maxHeight: 150,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionContent: {
    flexDirection: 'column',
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  suggestionDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  warningText: {
    color: '#ff5722',
    fontSize: 14,
    marginTop: 5,
    fontWeight: '500',
  },
  successText: {
    color: '#4caf50',
    fontSize: 14,
    marginTop: 5,
    fontWeight: '500',
  },
});

export default AutocompleteInput; 