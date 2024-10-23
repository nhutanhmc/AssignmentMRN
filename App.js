import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './src/screens/LoginScreen';
import PondListScreen from './src/screens/PondListScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import UserScreen from './src/screens/UserScreen';
import DetailScreen from './src/screens/DetailScreen'; // Import màn hình Detail
import KoiListScreen from './src/screens/KoiListScreen';
import KoiDetailScreen from './src/screens/KoiDetailScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Ponds" component={PondListScreen} />
      <Tab.Screen name="Products" component={ProductListScreen} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen}  />
        <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailScreen} /> 
        <Stack.Screen name="KoiList" component={KoiListScreen} />
        <Stack.Screen name="KoiDetail" component={KoiDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
