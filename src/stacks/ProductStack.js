// src/stacks/ProductStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import OrderScreen from '../screens/OrderScreen';
import BillScreen from '../screens/BillScreen';

const ProductStack = createStackNavigator();

const ProductStackNavigator = () => {
  return (
    <ProductStack.Navigator>
      <ProductStack.Screen name="ProductListScreen" component={ProductListScreen} options={{ headerShown: false }} />
      <ProductStack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={{ headerShown: false }} />
    </ProductStack.Navigator>
  );
};

export default ProductStackNavigator;
