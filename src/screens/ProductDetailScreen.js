import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState('');
  const [orderDetailIds, setOrderDetailIds] = useState([]);

  const handleAddToCart = async () => {
    if (parseInt(quantity) > product.quantity) {
      Alert.alert('Error', 'Số lượng không đủ.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        'https://koifishproject-production.up.railway.app/api/order-details',
        {
          product: { id: product.id },
          quantity: parseInt(quantity),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newOrderDetailId = response.data.data.id;
      const updatedOrderDetailIds = [...orderDetailIds, newOrderDetailId];
      setOrderDetailIds(updatedOrderDetailIds);

      // Lưu mảng orderDetailIds mới vào AsyncStorage
      await AsyncStorage.setItem('orderDetailIds', JSON.stringify(updatedOrderDetailIds));
      console.log('Current orderDetailIds:', updatedOrderDetailIds);

      Alert.alert(
        'Thêm vào giỏ hàng thành công',
        'Bạn có muốn thanh toán hoặc tiếp tục mua sắm?',
        [
          {
            text: 'Mua tiếp',
            onPress: () => navigation.navigate('ProductListScreen'),
          },
          {
            text: 'Thanh toán',
            onPress: () => navigation.navigate('OrderScreen', { orderDetailIds: updatedOrderDetailIds }),
          },
        ]
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Không thể thêm vào giỏ hàng.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.productName}</Text>
      <Text>Price: ${product.productPrice}</Text>
      <Text>Quantity Available: {product.quantity}</Text>
      <Text>Status: {product.status}</Text>
      {product.image && <Image source={{ uri: product.image }} style={styles.image} />}

      <TextInput
        style={styles.input}
        placeholder="Enter quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <Button title="Add to Cart" onPress={handleAddToCart} />
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
    marginBottom: 10,
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
});

export default ProductDetailScreen;
