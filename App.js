import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import LoginScreen from './src/screens/LoginScreen';
import PondStack from './src/stacks/PondStack'; // Import PondStack
import ProductStack from './src/stacks/ProductStack'; // Import PondStack
import UserStack from './src/stacks/UserStack'; // Import PondStack
import ProductListScreen from './src/screens/ProductListScreen';
import UserScreen from './src/screens/UserScreen';
import DetailScreen from './src/screens/DetailScreen'; // Import Detail
import MeasureDataScreen from './src/screens/MeasureDataScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import OrderScreen from './src/screens/OrderScreen'
import BillScreen from './src/screens/BillScreen';
import KoiListScreen from './src/screens/KoiListScreen';
import KoiDetailScreen from './src/screens/KoiDetailScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import CreateScheduleScreen from './src/screens/CreateScheduleScreen';
import ShowScheduleScreen from './src/screens/ShowScheduleScreen';
import KoiMarketScreen from './src/screens/KoiMarketScreen';
import KoiPersonDetail from './src/screens/KoiPersonDetail';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Ponds') iconName = 'fish';
          else if (route.name === 'Products') iconName = 'cart-outline';
          else if (route.name === 'User') iconName = 'account-outline';
          else if (route.name === 'KoiMarket') iconName = 'store';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Ponds" component={PondStack} options={{ headerShown: false }} />
      <Tab.Screen name="Products" component={ProductStack} />
      <Tab.Screen name="KoiMarket" component={KoiMarketScreen} options={{ headerShown: false }} />
      <Tab.Screen name="User" component={UserStack} />
      
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ headerShown: false }} /> 
        <Stack.Screen name="KoiList" component={KoiListScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="KoiDetail" component={KoiDetailScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="CreateSchedule" component={CreateScheduleScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ShowSchedule" component={ShowScheduleScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="MeasureDataScreen" component={MeasureDataScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ProductListScreen" component={ProductListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OrderScreen" component={OrderScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BillScreen" component={BillScreen} options={{ title: 'Your Orders' }}/>
        <Stack.Screen name="KoiPersonDetail" component={KoiPersonDetail} options={{ title: 'Koi Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
