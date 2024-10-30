import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, TextInput, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const OrderScreen = ({ navigation }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [orderDetailIds, setOrderDetailIds] = useState([]);
  const [quantities, setQuantities] = useState({});

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

      // Initialize quantities with current quantities
      const initialQuantities = {};
      filteredDetails.forEach(detail => {
        initialQuantities[detail.id] = detail.quantity;
      });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleUpdateQuantity = async (orderDetailId, productId) => {
    const token = await AsyncStorage.getItem('token');
    const newQuantity = quantities[orderDetailId];

    if (newQuantity <= 0) {
      Alert.alert('Error', 'Quantity must be greater than 0');
      return;
    }

    try {
      await axios.put(
        `https://koifishproject-production.up.railway.app/api/order-details/${orderDetailId}`,
        {
          product: { id: productId },
          quantity: newQuantity
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Order detail updated successfully');
      fetchOrderDetails(); // Refresh the order details
    } catch (error) {
      console.error('Error updating order detail:', error);
      Alert.alert('Error', 'Failed to update order detail');
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
            <Image source={{ uri: item.product.image }} style={styles.productImage} />
            <View style={styles.detailContainer}>
              <Text>{item.product.productName}</Text>
              <View style={styles.quantityContainer}>
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  value={quantities[item.id]?.toString()}
                  onChangeText={(text) => setQuantities({ ...quantities, [item.id]: parseInt(text) || 0 })}
                />
                <Button
                  title="Add"
                  onPress={() => handleUpdateQuantity(item.id, item.product.id)}
                  style={styles.addButton}
                />
              </View>
              <Text>Price: ${item.priceOrderDetail}</Text>
            </View>
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
  orderItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc' 
  },
  detailContainer: { flex: 1, paddingLeft: 10 },
  productImage: { width: 60, height: 60, borderRadius: 5 },
  quantityContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  quantityInput: { 
    borderBottomWidth: 1, 
    marginRight: 10, 
    paddingHorizontal: 5, 
    width: 50, 
    textAlign: 'center' 
  },
  addButton: { 
    flex: 1, 
    alignSelf: 'flex-end' 
  },
});

export default OrderScreen;
