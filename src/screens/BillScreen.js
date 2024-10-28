import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BillScreen = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      const idUser = user ? JSON.parse(user).id : null;

      if (!idUser) {
        Alert.alert('Error', 'Người dùng chưa đăng nhập.');
        return;
      }

      const response = await axios.get(
        'https://koifishproject-production.up.railway.app/api/orders',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Lọc đơn hàng theo idUser
      const userOrders = response.data.data.filter(order => order.idUser === idUser);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text>Order ID: {item.id}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Total Price: ${item.totalPrice}</Text>
            <Text>Order Date: {item.createdAt}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  orderItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default BillScreen;
