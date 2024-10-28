import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const OrderScreen = ({ navigation }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderDetailIds, setOrderDetailIds] = useState([]);

  const fetchOrderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const storedOrderDetailIds = JSON.parse(await AsyncStorage.getItem('orderDetailIds')) || [];
      setOrderDetailIds(storedOrderDetailIds);

      const response = await axios.get(
        'https://koifishproject-production.up.railway.app/api/order-details',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const filteredDetails = response.data.data.filter(detail =>
        storedOrderDetailIds.includes(detail.id)
      );
      setOrderDetails(filteredDetails);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const handleOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = await AsyncStorage.getItem('user');
      const idUser = user ? JSON.parse(user).id : null;

      if (!idUser || orderDetails.length === 0) {
        Alert.alert('Error', 'Không có sản phẩm nào trong giỏ hàng hoặc người dùng chưa đăng nhập.');
        return;
      }

      const orderDetailIdsPayload = orderDetails.map(detail => ({ id: detail.id }));
      await axios.post(
        'https://koifishproject-production.up.railway.app/api/orders',
        { idUser, orderDetails: orderDetailIdsPayload, status: "PENDING" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Đặt hàng thành công', 'Vui lòng chờ nhân viên xác nhận.');
      handleClearCart();
      navigation.navigate('BillScreen');
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Không thể đặt hàng.');
    }
  };

  const handleClearCart = async () => {
    setOrderDetails([]);
    setOrderDetailIds([]);
    await AsyncStorage.setItem('orderDetailIds', JSON.stringify([]));
    Alert.alert('Đã xóa giỏ hàng');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={orderDetails}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text>{item.product.productName}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Price: ${item.priceOrderDetail}</Text>
          </View>
        )}
      />
      <Button title="Order" onPress={handleOrder} />
      <Button title="Clear Cart" onPress={handleClearCart} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  orderItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default OrderScreen;
