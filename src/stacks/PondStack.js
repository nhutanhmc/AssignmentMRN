// PondStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PondListScreen from '../screens/PondListScreen';
import KoiListScreen from '../screens/KoiListScreen';
import KoiDetailScreen from '../screens/KoiDetailScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import CreateScheduleScreen from '../screens/CreateScheduleScreen';
import ShowScheduleScreen from '../screens/ShowScheduleScreen';

const PondStack = createStackNavigator();

const PondStackNavigator = () => {
  return (
    <PondStack.Navigator>
      <PondStack.Screen name="PondList" component={PondListScreen} options={{ headerShown: false }} />
      <PondStack.Screen name="KoiList" component={KoiListScreen} options={{ headerShown: false }} />
      <PondStack.Screen name="KoiDetail" component={KoiDetailScreen} options={{ headerShown: false }} />
      <PondStack.Screen name="Schedule" component={ScheduleScreen} options={{ headerShown: false }} />
      <PondStack.Screen name="CreateSchedule" component={CreateScheduleScreen} options={{ headerShown: false }} />
      <PondStack.Screen name="ShowSchedule" component={ShowScheduleScreen} options={{ headerShown: false }} />
    </PondStack.Navigator>
  );
};

export default PondStackNavigator;
