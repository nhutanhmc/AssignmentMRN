// src/stacks/UserStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserScreen from '../screens/UserScreen';
import OrderScreen from '../screens/OrderScreen';
import BillScreen from '../screens/BillScreen';

const UserStack = createStackNavigator();

const UserStackNavigator = () => {
  return (
    <UserStack.Navigator>
      <UserStack.Screen name="UserScreen" component={UserScreen} options={{ headerShown: false }} />
      <UserStack.Screen name="OrderScreen" component={OrderScreen} options={{ headerShown: false }} />
      <UserStack.Screen name="BillScreen" component={BillScreen} options={{ title: 'Your Orders' }} />
    </UserStack.Navigator>
  );
};

export default UserStackNavigator;
