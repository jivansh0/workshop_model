// navigation/DrawerNavigator.js
import React, { useState } from 'react';
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
} from 'react-native';

import AddForm from '../components/AddForm';
import DeleteForm from '../components/DeleteForm';
import UpdateForm from '../components/UpdateForm';
import ViewForm from '../components/ViewForm';

const Stack = createStackNavigator();

const Header = ({ title, navigation, isLargeScreen }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Appbar.Header style={{ backgroundColor: '#3f51b5' }}>
      <Appbar.Content title={title} titleStyle={{ fontWeight: 'bold', fontSize: 20 }} />
      {isLargeScreen ? (
        <View style={styles.navLinks}>
          <Pressable onPress={() => navigation.navigate('Sheet1')}>
            <Text style={styles.linkText}>Sheet1</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Sheet2')}>
            <Text style={styles.linkText}>Sheet2</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Sheet3')}>
            <Text style={styles.linkText}>Sheet3</Text>
          </Pressable>
        </View>
      ) : (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action icon="menu" color="white" onPress={() => setMenuVisible(true)} />
          }>
          <Menu.Item onPress={() => { setMenuVisible(false); navigation.navigate('Sheet1'); }} title="Sheet1" />
          <Menu.Item onPress={() => { setMenuVisible(false); navigation.navigate('Sheet2'); }} title="Sheet2" />
          <Menu.Item onPress={() => { setMenuVisible(false); navigation.navigate('Sheet3'); }} title="Sheet3" />
        </Menu>
      )}
    </Appbar.Header>
  );
};

const HomeScreen = ({ navigation }) => {
  const [form, setForm] = useState(null);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

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
          {CurrentForm && <CurrentForm />}
        </View>
        <Pressable style={styles.backButton} onPress={() => setForm(null)}>
          <Text style={styles.backText}>← Back to Home</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Header title="Inventory Manager" navigation={navigation} isLargeScreen={isLargeScreen} />

        <Text style={styles.subheading}>Select an action:</Text>

        <View style={styles.buttonRow}>
          <Pressable style={styles.button} onPress={() => setForm('add')}><Text style={styles.buttonText}>➕ Add</Text></Pressable>
          <Pressable style={styles.button} onPress={() => setForm('delete')}><Text style={styles.buttonText}>🗑 Delete</Text></Pressable>
          <Pressable style={styles.button} onPress={() => setForm('update')}><Text style={styles.buttonText}>✏️ Update</Text></Pressable>
          <Pressable style={styles.button} onPress={() => setForm('view')}><Text style={styles.buttonText}>🔍 View</Text></Pressable>
        </View>

        <KeyboardAvoidingView
          style={styles.formScrollContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
          >
            {form && renderForm()}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const SheetScreen = ({ route, navigation }) => {
  const { title } = route.params;
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (
    <View style={styles.container}>
      <Header title={title} navigation={navigation} isLargeScreen={isLargeScreen} />
      <View style={styles.sheetPlaceholder}>
        <Text style={{ fontSize: 16 }}>Viewing {title} (Sheet content placeholder)</Text>
        <Button title="Back to Home" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Sheet1" component={SheetScreen} initialParams={{ title: 'Sheet1' }} />
        <Stack.Screen name="Sheet2" component={SheetScreen} initialParams={{ title: 'Sheet2' }} />
        <Stack.Screen name="Sheet3" component={SheetScreen} initialParams={{ title: 'Sheet3' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#f4f6f8' },
  container: { flex: 1 },

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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 80,
    paddingHorizontal: 20,
  },
  formScrollContainer: {
    flex: 1,
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
    shadowRadius: 6
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
  sheetPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
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
  }
});

export default DrawerNavigator;
