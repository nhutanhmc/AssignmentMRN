import React from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const UserScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Logged Out', 'You have been logged out successfully.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      {/* Các nút Cart và Bill */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('OrderScreen')}>
          <Icon name="shopping-cart" size={24} color="#333" />
          <Text style={styles.optionText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('BillScreen')}>
          <Icon name="file-text" size={24} color="#333" />
          <Text style={styles.optionText}>Bill</Text>
        </TouchableOpacity>
      </View>

      {/* Nút Log Out */}
      <View style={styles.logoutContainer}>
        <Button title="Log Out" color="#d9534f" onPress={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  option: {
    alignItems: 'center',
  },
  optionText: {
    marginTop: 8,
    fontSize: 18,
  },
  logoutContainer: {
    width: '60%',
    marginTop: 20,
  },
});

export default UserScreen;
